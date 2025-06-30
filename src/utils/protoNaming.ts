/**
 * Utility functions for converting user input to Protocol Buffer naming standards
 */

/**
 * Convert a user-entered package name to proto package naming convention
 * - Lowercase only
 * - Snake_case for multiple words
 * - No special characters except underscores
 * - Must start with a letter
 */
export function toProtoPackageName(input: string): string {
  return input
    .trim()
    .toLowerCase()
    // Replace spaces, hyphens, dots with underscores
    .replace(/[\s\-\.]+/g, '_')
    // Remove any non-alphanumeric characters except underscores
    .replace(/[^a-z0-9_]/g, '')
    // Ensure it starts with a letter (prefix with 'pkg_' if it starts with number)
    .replace(/^([0-9])/, 'pkg_$1')
    // Remove duplicate underscores
    .replace(/_+/g, '_')
    // Remove leading/trailing underscores
    .replace(/^_+|_+$/g, '');
}

/**
 * Convert a user-entered message name to proto message naming convention
 * - PascalCase (UpperCamelCase)
 * - No special characters
 * - Must start with a letter
 */
export function toProtoMessageName(input: string): string {
  return input
    .trim()
    // Split on spaces, hyphens, underscores, dots
    .split(/[\s\-_\.]+/)
    // Capitalize each word
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
    // Remove any remaining non-alphanumeric characters
    .replace(/[^a-zA-Z0-9]/g, '')
    // Ensure it starts with a letter (prefix with 'Message' if it starts with number)
    .replace(/^([0-9])/, 'Message$1')
    // Ensure it's not empty
    || 'Message';
}

/**
 * Convert a user-entered field name to proto field naming convention
 * - snake_case
 * - Lowercase only
 * - No special characters except underscores
 * - Must start with a letter
 */
export function toProtoFieldName(input: string): string {
  return input
    .trim()
    // Convert camelCase to snake_case
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase()
    // Replace spaces, hyphens, dots with underscores
    .replace(/[\s\-\.]+/g, '_')
    // Remove any non-alphanumeric characters except underscores
    .replace(/[^a-z0-9_]/g, '')
    // Ensure it starts with a letter (prefix with 'field_' if it starts with number)
    .replace(/^([0-9])/, 'field_$1')
    // Remove duplicate underscores
    .replace(/_+/g, '_')
    // Remove leading/trailing underscores
    .replace(/^_+|_+$/g, '')
    // Ensure it's not empty
    || 'field';
}

/**
 * Generate a comment showing the original user input if it was modified
 */
export function generateOriginalNameComment(original: string, converted: string): string {
  if (original.trim() !== converted) {
    return `  // Original name: "${original.trim()}"`;
  }
  return '';
}

/**
 * Validate and suggest proto-compliant names
 */
export function validateProtoNaming(input: string, type: 'package' | 'message' | 'field'): {
  isValid: boolean;
  suggestion: string;
  issues: string[];
} {
  const issues: string[] = [];
  let suggestion: string;
  
  switch (type) {
    case 'package':
      suggestion = toProtoPackageName(input);
      if (!/^[a-z][a-z0-9_]*$/.test(input)) {
        issues.push('Package names should be lowercase with underscores');
      }
      break;
      
    case 'message':
      suggestion = toProtoMessageName(input);
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
        issues.push('Message names should be PascalCase (e.g., UserProfile)');
      }
      break;
      
    case 'field':
      suggestion = toProtoFieldName(input);
      if (!/^[a-z][a-z0-9_]*$/.test(input)) {
        issues.push('Field names should be snake_case (e.g., user_name)');
      }
      break;
      
    default:
      suggestion = input;
  }
  
  const isValid = input.trim() === suggestion && issues.length === 0;
  
  return { isValid, suggestion, issues };
}
