import { DataProduct, Entity, PROTO_TYPE_MAPPING, TYPE_MAPPING_COMMENTS } from '../types';
import { 
  toProtoPackageName, 
  toProtoMessageName, 
  toProtoFieldName, 
  generateOriginalNameComment 
} from './protoNaming';

export function generateProtoFile(dataProduct: DataProduct): string {
  const { name, entities } = dataProduct;
  
  // Convert data product name to proto package naming convention
  const protoPackageName = toProtoPackageName(name);
  
  let proto = `syntax = "proto3";\n\n`;
  proto += `package ${protoPackageName};\n\n`;
  
  // Add language-specific options for Java and Go
  proto += `// Language-specific options\n`;
  proto += `option java_multiple_files = true;\n`;
  proto += `option java_package = "com.${protoPackageName.replace(/_/g, '.')}";\n`;
  proto += `option java_outer_classname = "${toProtoMessageName(name)}Protos";\n`;
  proto += `option go_package = "./${protoPackageName};${protoPackageName}";\n\n`;
  
  // Add imports if needed
  proto += `// Generated proto file for ${name}\n`;
  if (name !== protoPackageName) {
    proto += `// Original data product name: "${name}"\n`;
  }
  proto += `// Generated on ${new Date().toISOString()}\n`;
  proto += `// Compatible with Java and Go\n\n`;
  
  // Generate messages for each entity
  entities.forEach((entity) => {
    proto += generateEntityMessage(entity);
    proto += '\n';
  });
  
  return proto;
}

function generateEntityMessage(entity: Entity): string {
  // Convert entity name to proto message naming convention
  const protoMessageName = toProtoMessageName(entity.name);
  
  let message = `message ${protoMessageName} {\n`;
  
  // Add original name comment if it was changed
  const originalNameComment = generateOriginalNameComment(entity.name, protoMessageName);
  if (originalNameComment) {
    message += `${originalNameComment}\n`;
  }
  
  entity.attributes.forEach((attribute, index) => {
    const fieldNumber = index + 1;
    const protoType = PROTO_TYPE_MAPPING[attribute.type];
    const protoFieldName = toProtoFieldName(attribute.name);
    const typeComment = TYPE_MAPPING_COMMENTS[attribute.type];
    
    // Add comment for primary key
    if (attribute.isPrimaryKey) {
      message += `  // Primary key\n`;
    }
    
    // Add original field name comment if it was changed
    const fieldNameComment = generateOriginalNameComment(attribute.name, protoFieldName);
    if (fieldNameComment) {
      message += `${fieldNameComment}\n`;
    }
    
    // Add type mapping comment for clarity
    if (typeComment) {
      message += `  // ${typeComment}\n`;
    }
    
    message += `  ${protoType} ${protoFieldName} = ${fieldNumber};\n`;
    
    // Add empty line between fields for better readability
    if (index < entity.attributes.length - 1) {
      message += `\n`;
    }
  });
  
  message += `}`;
  
  return message;
}

export function validateDataProduct(dataProduct: DataProduct): string[] {
  const errors: string[] = [];
  
  // Validate data product name
  if (!dataProduct.name.trim()) {
    errors.push('Data product name is required');
  }
  
  // Validate entities
  if (dataProduct.entities.length === 0) {
    errors.push('At least one entity is required');
  }
  
  dataProduct.entities.forEach((entity, entityIndex) => {
    // Validate entity name
    if (!entity.name.trim()) {
      errors.push(`Entity ${entityIndex + 1}: Name is required`);
    }
    
    // Validate attributes
    if (entity.attributes.length === 0) {
      errors.push(`Entity "${entity.name}": At least one attribute is required`);
    }
    
    // Check for primary key
    const primaryKeys = entity.attributes.filter(attr => attr.isPrimaryKey);
    if (primaryKeys.length === 0) {
      errors.push(`Entity "${entity.name}": At least one primary key is required`);
    }
    
    // Validate attribute names
    const attributeNames = new Set<string>();
    entity.attributes.forEach((attribute, attrIndex) => {
      if (!attribute.name.trim()) {
        errors.push(`Entity "${entity.name}", Attribute ${attrIndex + 1}: Name is required`);
      } else {
        // Convert to proto naming to check for duplicates
        const protoFieldName = toProtoFieldName(attribute.name);
        if (attributeNames.has(protoFieldName)) {
          errors.push(`Entity "${entity.name}": Duplicate attribute name "${attribute.name}" (converts to "${protoFieldName}")`);
        } else {
          attributeNames.add(protoFieldName);
        }
      }
    });
  });
  
  // Check for duplicate entity names (after conversion)
  const entityNames = new Set<string>();
  dataProduct.entities.forEach(entity => {
    const protoMessageName = toProtoMessageName(entity.name);
    if (entityNames.has(protoMessageName)) {
      errors.push(`Duplicate entity name "${entity.name}" (converts to "${protoMessageName}")`);
    } else {
      entityNames.add(protoMessageName);
    }
  });
  
  return errors;
}

export function downloadProtoFile(content: string, dataProductName: string): void {
  const protoPackageName = toProtoPackageName(dataProductName);
  const filename = `${protoPackageName}.proto`;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9);
}
