#!/bin/bash
set -e

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_DIR="/home/bravaboards-surf-skate"
FRONTEND_DIR="$PROJECT_DIR/apps/frontend"
BACKEND_DIR="$PROJECT_DIR/apps/backend"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/deploy.log"

# Crear directorio de logs si no existe
mkdir -p "$LOG_DIR"

# Timestamp para el deployment
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
DEPLOY_START=$(date +%s)

# Función para imprimir y guardar en log
log() {
    local level=$1
    shift
    local message="$@"
    local log_line="[$TIMESTAMP] [$level] $message"

    case $level in
        INFO)
            echo -e "${GREEN}[INFO]${NC} $message"
            ;;
        WARN)
            echo -e "${YELLOW}[WARN]${NC} $message"
            ;;
        ERROR)
            echo -e "${RED}[ERROR]${NC} $message"
            ;;
        SUCCESS)
            echo -e "${GREEN}[✓]${NC} $message"
            ;;
    esac

    echo "$log_line" >> "$LOG_FILE"
}

# Banner inicial
echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  Deploy Script - bravaboards.es${NC}"
echo -e "${BLUE}  Date: $TIMESTAMP${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

log INFO "Starting deployment process..."

# Cambiar al directorio del proyecto
cd "$PROJECT_DIR"

# 1. Git Pull (si es un repositorio git)
if [ -d ".git" ]; then
    log INFO "Git repository detected, pulling latest changes..."

    # Guardar el hash del commit actual
    CURRENT_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "unknown")

    if git pull origin main 2>&1 | tee -a "$LOG_FILE"; then
        NEW_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "unknown")

        if [ "$CURRENT_COMMIT" != "$NEW_COMMIT" ]; then
            log SUCCESS "Git pull completed - new changes detected"
            log INFO "Commit: $CURRENT_COMMIT -> $NEW_COMMIT"
        else
            log INFO "Git pull completed - already up to date"
        fi
    else
        log WARN "Git pull failed or no remote configured"
    fi
else
    log INFO "Not a git repository, skipping git pull"
fi

# 2. Detectar cambios en backend
BACKEND_CHANGED=false
if [ -d ".git" ]; then
    # Verificar si hubo cambios en el directorio backend
    BACKEND_FILES_CHANGED=$(git diff --name-only HEAD@{1} HEAD 2>/dev/null | grep "^apps/backend/" || true)

    if [ -n "$BACKEND_FILES_CHANGED" ]; then
        BACKEND_CHANGED=true
        log INFO "Backend changes detected"
    fi
fi

# 3. Build del frontend (Astro)
log INFO "Building frontend (Astro)..."
cd "$FRONTEND_DIR"

if npm run build 2>&1 | tee -a "$LOG_FILE"; then
    log SUCCESS "Frontend build successful!"
else
    log ERROR "Frontend build failed!"
    exit 1
fi

# 4. Restart backend si hubo cambios
if [ "$BACKEND_CHANGED" = true ]; then
    log INFO "Restarting Strapi backend due to code changes..."

    cd "$BACKEND_DIR"

    # Verificar si el servicio existe
    if systemctl list-units --full -all | grep -q "strapi.service"; then
        if sudo systemctl restart strapi.service 2>&1 | tee -a "$LOG_FILE"; then
            log SUCCESS "Strapi backend restarted successfully!"

            # Esperar un momento para que el servicio inicie
            sleep 2

            # Verificar estado
            if sudo systemctl is-active --quiet strapi.service; then
                log SUCCESS "Strapi is running"
            else
                log WARN "Strapi may not be running properly"
            fi
        else
            log ERROR "Failed to restart Strapi backend!"
            exit 1
        fi
    else
        log WARN "Strapi service not found, skipping restart"
    fi
else
    log INFO "No backend changes detected, skipping Strapi restart"
fi

# 5. Verificar configuración de nginx
log INFO "Testing nginx configuration..."

if sudo nginx -t 2>&1 | tee -a "$LOG_FILE"; then
    log SUCCESS "Nginx configuration is valid"
else
    log ERROR "Nginx configuration test failed!"
    exit 1
fi

# 6. Recargar nginx
log INFO "Reloading nginx..."

if sudo systemctl reload nginx 2>&1 | tee -a "$LOG_FILE"; then
    log SUCCESS "Nginx reloaded successfully!"
else
    log ERROR "Nginx reload failed!"
    exit 1
fi

# 7. Verificar estado de nginx
log INFO "Checking nginx status..."

if sudo systemctl is-active --quiet nginx; then
    log SUCCESS "Nginx is running"
else
    log ERROR "Nginx is not running!"
    exit 1
fi

# Calcular duración del deployment
DEPLOY_END=$(date +%s)
DEPLOY_DURATION=$((DEPLOY_END - DEPLOY_START))

# Banner final
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  ✓ Deployment completed successfully!${NC}"
echo -e "${GREEN}  Duration: ${DEPLOY_DURATION}s${NC}"
echo -e "${GREEN}  Site: https://bravaboards.es${NC}"
echo -e "${GREEN}  Logs: $LOG_FILE${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""

log SUCCESS "Deployment completed in ${DEPLOY_DURATION}s"
echo "---" >> "$LOG_FILE"
