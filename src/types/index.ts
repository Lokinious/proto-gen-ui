export interface Attribute {
  id: string;
  name: string;
  type: JavaPrimitiveType;
  isPrimaryKey: boolean;
}

export interface Entity {
  id: string;
  name: string;
  attributes: Attribute[];
}

export interface DataProduct {
  name: string;
  entities: Entity[];
}

export type JavaPrimitiveType = 
  | 'String'
  | 'int'
  | 'long'
  | 'double'
  | 'float'
  | 'boolean'
  | 'byte'
  | 'short'
  | 'char'
  | 'LocalDateTime'
  | 'LocalDate'
  | 'BigDecimal'
  | 'UUID'
  | 'byte[]'
  | 'Integer'
  | 'Long'
  | 'Double'
  | 'Float'
  | 'Boolean';

export const JAVA_PRIMITIVE_TYPES: JavaPrimitiveType[] = [
  'String',
  'int',
  'Integer',
  'long',
  'Long',
  'double',
  'Double',
  'float',
  'Float',
  'boolean',
  'Boolean',
  'byte',
  'short',
  'char',
  'byte[]',
  'LocalDateTime',
  'LocalDate',
  'BigDecimal',
  'UUID'
];

export const PROTO_TYPE_MAPPING: Record<JavaPrimitiveType, string> = {
  'String': 'string',
  'int': 'int32',
  'Integer': 'int32',
  'long': 'int64',
  'Long': 'int64',
  'double': 'double',
  'Double': 'double',
  'float': 'float',
  'Float': 'float',
  'boolean': 'bool',
  'Boolean': 'bool',
  'byte': 'int32',
  'short': 'int32',
  'char': 'string',
  'byte[]': 'bytes',
  'LocalDateTime': 'string', // ISO 8601 format
  'LocalDate': 'string',     // ISO 8601 format
  'BigDecimal': 'string',    // String representation
  'UUID': 'string'           // String representation
};

// Type mapping comments for better understanding
export const TYPE_MAPPING_COMMENTS: Record<JavaPrimitiveType, string> = {
  'String': 'UTF-8 encoded string',
  'int': '32-bit signed integer',
  'Integer': '32-bit signed integer (boxed)',
  'long': '64-bit signed integer',
  'Long': '64-bit signed integer (boxed)',
  'double': '64-bit floating point',
  'Double': '64-bit floating point (boxed)',
  'float': '32-bit floating point',
  'Float': '32-bit floating point (boxed)',
  'boolean': 'Boolean value',
  'Boolean': 'Boolean value (boxed)',
  'byte': '8-bit signed integer (as int32)',
  'short': '16-bit signed integer (as int32)',
  'char': 'Single character (as string)',
  'byte[]': 'Binary data',
  'LocalDateTime': 'ISO 8601 timestamp (YYYY-MM-DDTHH:mm:ss)',
  'LocalDate': 'ISO 8601 date (YYYY-MM-DD)',
  'BigDecimal': 'Decimal number as string',
  'UUID': 'UUID as string (e.g., 123e4567-e89b-12d3-a456-426614174000)'
};
