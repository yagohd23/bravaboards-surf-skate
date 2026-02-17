# Guía de Deployment - bravaboards.es

## 🚀 Resumen de la Configuración

Mi sitio web está configurado con:
- **Frontend**: Astro (archivos estáticos en producción)
- **Backend**: Strapi CMS (solo accesible por localhost)
- **Servidor Web**: Nginx con SSL (Let's Encrypt)
- **Dominio**: bravaboards.es (HTTPS habilitado)

## 📁 Estructura del Proyecto

```
/home/bravaboards-surf-skate/
├── apps/
│   ├── frontend/        # Código de Astro
│   │   ├── src/
│   │   └── dist/        # Archivos construidos (servidos por nginx)
│   └── backend/         # Código de Strapi
├── deploy.sh            # Script de deployment
└── DEPLOYMENT.md        # Este archivo
```

## 🔄 Workflow de Desarrollo

### Desarrollo del Frontend (Astro)

1. **Modo desarrollo** (localhost:4321):
   ```bash
   cd /home/bravaboards-surf-skate/apps/frontend
   npm run dev
   ```

2. **Deployment automático** (recomendado):
   ```bash
   deploy
   # O desde cualquier directorio:
   /home/bravaboards-surf-skate/deploy.sh
   ```

3. **El script hace automáticamente**:
   - ✅ Git pull (si es un repositorio git)
   - ✅ Detecta cambios en backend
   - ✅ Build del frontend de Astro
   - ✅ Restart de Strapi (solo si hay cambios en backend)
   - ✅ Verifica la configuración de nginx
   - ✅ Recarga nginx
   - ✅ Guarda logs en `/home/bravaboards-surf-skate/logs/deploy.log`
   - ✅ Muestra duración del deployment

### Desarrollo del Backend (Strapi)

Strapi está configurado para ejecutarse **solo en localhost:1337** (NO es accesible públicamente).

1. **Iniciar Strapi manualmente**:
   ```bash
   sudo systemctl start strapi.service
   ```

2. **Ver logs de Strapi**:
   ```bash
   sudo journalctl -u strapi.service -f
   ```
   O revisar archivos de log:
   ```bash
   tail -f /var/log/strapi.log
   tail -f /var/log/strapi-error.log
   ```

3. **Detener Strapi**:
   ```bash
   sudo systemctl stop strapi.service
   ```

4. **Ver estado de Strapi**:
   ```bash
   sudo systemctl status strapi.service
   ```

**Nota**: Strapi se inicia automáticamente al arrancar el servidor. Si quieres deshabilitarlo:
```bash
sudo systemctl disable strapi.service
```

## 🌐 Nginx

### Archivos de Configuración

- Configuración del sitio: `/etc/nginx/sites-available/bravaboards.es`
- Logs de acceso: `/var/log/nginx/bravaboards.es.access.log`
- Logs de errores: `/var/log/nginx/bravaboards.es.error.log`

### Comandos Útiles

```bash
# Verificar configuración
sudo nginx -t

# Recargar nginx (sin downtime)
sudo nginx -s reload
# O
sudo systemctl reload nginx

# Reiniciar nginx
sudo systemctl restart nginx

# Ver estado
sudo systemctl status nginx

# Ver logs en tiempo real
sudo tail -f /var/log/nginx/bravaboards.es.access.log
sudo tail -f /var/log/nginx/bravaboards.es.error.log
```

## 🔒 SSL/HTTPS

### Certificado SSL

- **Proveedor**: Let's Encrypt
- **Dominio**: bravaboards.es
- **Ubicación**: `/etc/letsencrypt/live/bravaboards.es/`
- **Expiración**: Los certificados se renuevan automáticamente

### Renovación Manual (si es necesario)

```bash
sudo certbot renew
```

### Verificar Certificados

```bash
sudo certbot certificates
```

## 🔥 Firewall

Puertos abiertos:
- **22**: SSH (para tu acceso)
- **80**: HTTP (redirige automáticamente a HTTPS)
- **443**: HTTPS (tu sitio web)

```bash
# Ver reglas del firewall
sudo ufw status

# Agregar nueva regla (ejemplo)
sudo ufw allow 8080/tcp
```

## 📝 Deployment Paso a Paso

### Cada vez que hagas cambios en el frontend:

1. Edita tus archivos en `apps/frontend/src/`
2. Ejecuta el script de deployment:
   ```bash
   deploy
   ```
3. ¡Listo! Los cambios están en https://bravaboards.es

### Ver logs de deployment:

```bash
# Ver últimos deployments
tail -50 /home/bravaboards-surf-skate/logs/deploy.log

# Ver logs en tiempo real durante deployment
tail -f /home/bravaboards-surf-skate/logs/deploy.log
```

### Si haces cambios en la configuración de nginx:

1. Edita `/etc/nginx/sites-available/bravaboards.es`
2. Verifica la configuración:
   ```bash
   sudo nginx -t
   ```
3. Recarga nginx:
   ```bash
   sudo systemctl reload nginx
   ```

## 🛠️ Troubleshooting

### El sitio no carga

1. Verificar que nginx está corriendo:
   ```bash
   sudo systemctl status nginx
   ```

2. Verificar logs de error:
   ```bash
   sudo tail -50 /var/log/nginx/bravaboards.es.error.log
   ```

3. Verificar que el directorio dist existe y tiene archivos:
   ```bash
   ls -la /home/bravaboards-surf-skate/apps/frontend/dist/
   ```

### Strapi no responde en localhost:1337

1. Verificar si está corriendo:
   ```bash
   sudo systemctl status strapi.service
   ```

2. Iniciar si está detenido:
   ```bash
   sudo systemctl start strapi.service
   ```

3. Ver logs:
   ```bash
   sudo journalctl -u strapi.service -n 50
   ```

### Problemas con SSL

1. Verificar certificados:
   ```bash
   sudo certbot certificates
   ```

2. Renovar manualmente:
   ```bash
   sudo certbot renew --force-renewal
   ```

## 📊 Monitoreo

### Ver tráfico del sitio en tiempo real

```bash
sudo tail -f /var/log/nginx/bravaboards.es.access.log
```

### Verificar recursos del servidor

```bash
# Uso de CPU y memoria
htop

# Espacio en disco
df -h

# Procesos de Node.js
ps aux | grep node
```

## 🔄 Actualización de Node.js

Si necesitas actualizar Node.js en el futuro:

```bash
# Ver versión actual
node --version

# Actualizar a la última LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs -y
```

## 📞 Acceso desde localhost

Para acceder a tu sitio desde tu máquina local:

1. **Frontend en desarrollo**: http://localhost:4321
2. **Strapi (si está corriendo)**: http://localhost:1337
3. **Frontend en producción**: https://bravaboards.es (desde cualquier lugar)

## ⚠️ Importante

- **Strapi NO es accesible públicamente** - solo por localhost:1337
- **El frontend se sirve desde archivos estáticos** - debes hacer `npm run build` después de cambios
- **Los certificados SSL se renuevan automáticamente** cada 60 días
- **Siempre usa HTTPS** - HTTP redirige automáticamente a HTTPS
