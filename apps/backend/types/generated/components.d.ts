import type { Schema, Struct } from '@strapi/strapi';

export interface SeoComponentsSeo extends Struct.ComponentSchema {
  collectionName: 'components_seo_components_seos';
  info: {
    displayName: 'SEO';
    icon: 'cursor';
  };
  attributes: {
    meta_description: Schema.Attribute.Blocks & Schema.Attribute.Required;
    meta_title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'seo-components.seo': SeoComponentsSeo;
    }
  }
}
