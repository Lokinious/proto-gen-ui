# Proto Gen UI

Customer Facing Proto Builder for data transport - A React application for generating Protocol Buffer files from Java entities with built-in Java and Go support.

## Features

- **Data Product Management**: Define a name for your data product (becomes the proto package name)
- **Entity Builder**: Create Java entities with attributes and primary keys
- **Smart Naming Conversion**: Automatically converts user input to Protocol Buffer naming standards
- **Real-time Suggestions**: Shows proto-compliant naming suggestions as you type
- **Multi-Language Support**: Generated proto files include Java and Go language options
- **Compilation Instructions**: Built-in instructions for Java and Go compilation
- **Proto Generation**: Automatically generate Protocol Buffer (.proto) files
- **Validation**: Built-in validation for proper naming and structure
- **Conversion Summary**: Shows all naming conversions applied during generation
- **Download**: Export generated proto files for use in your projects

## Getting Started

### Prerequisites

- Node.js (v20.0.0 or higher)
- npm (v9.6.4 or higher)

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

### Preview Production Build

Preview the production build:
```bash
npm run preview
```

## How to Use

### Step 1: Data Product Name
- Enter a name for your data product in any format (e.g., "User Management", "order-service", "ProductCatalog")
- The app will automatically convert it to proper proto package naming (lowercase with underscores)
- Real-time suggestions show you exactly how the name will be converted

### Step 2: Define Entities
- Add entities by clicking "Add Entity"
- Entity names can be in any format (e.g., "User Profile", "order-item", "ProductDetails")
- For each entity, click "Edit" to define attributes:
  - **Attribute Name**: Any format (e.g., "firstName", "user_id", "Product Name")
  - **Type**: Choose from Java primitive types (String, int, long, double, float, boolean, etc.)
  - **Primary Key**: Mark attributes that serve as primary keys
- The app automatically converts all names to proto standards:
  - Entity names → PascalCase (UserProfile, OrderItem, ProductDetails)
  - Field names → snake_case (first_name, user_id, product_name)
- Real-time suggestions show conversions as you type
- Each entity must have at least one attribute and one primary key

### Step 3: Preview & Download
- Review the generated Protocol Buffer file
- See a summary of all naming conversions that were applied
- The proto file includes:
  - Proper syntax declaration (`syntax = "proto3"`)
  - Package declaration based on your data product name
  - Message definitions for each entity with converted names
  - Comments showing original names when conversions were applied
  - Proper field numbering and type mapping
- Click "Approve & Download" to download the `.proto` file
- Or click "Make Changes" to go back and edit

## Naming Conversion Rules

The application automatically converts user input to Protocol Buffer naming standards:

### Package Names (Data Product)
- **Input**: Any format (e.g., "User Management", "order-service", "ProductCatalog")
- **Output**: lowercase with underscores (e.g., "user_management", "order_service", "product_catalog")
- **Rules**: 
  - Converts to lowercase
  - Replaces spaces, hyphens, dots with underscores
  - Removes special characters
  - Ensures it starts with a letter

### Message Names (Entities)
- **Input**: Any format (e.g., "user profile", "order-item", "ProductDetails")
- **Output**: PascalCase (e.g., "UserProfile", "OrderItem", "ProductDetails")
- **Rules**:
  - Capitalizes each word
  - Removes spaces and special characters
  - Ensures it starts with a letter

### Field Names (Attributes)
- **Input**: Any format (e.g., "firstName", "User ID", "product-name")
- **Output**: snake_case (e.g., "first_name", "user_id", "product_name")
- **Rules**:
  - Converts camelCase to snake_case
  - Converts to lowercase
  - Replaces spaces, hyphens with underscores
  - Removes special characters
  - Ensures it starts with a letter

## Type Mapping

Java types are automatically mapped to Protocol Buffer types:

| Java Type | Proto Type | Notes |
|-----------|------------|-------|
| String | string | |
| int | int32 | |
| long | int64 | |
| double | double | |
| float | float | |
| boolean | bool | |
| byte | int32 | |
| short | int32 | |
| char | string | Single character as string |
| LocalDateTime | string | ISO 8601 format |
| LocalDate | string | ISO 8601 format |
| BigDecimal | string | String representation |
| UUID | string | String representation |

## Example Output

For a data product named "User Management Service" with a "User Profile" entity having attributes like "firstName", "user-email", and "userID", the generated proto file would look like:

```protobuf
syntax = "proto3";

package user_management_service;

// Language-specific options
option java_multiple_files = true;
option java_package = "com.user.management.service";
option java_outer_classname = "UserManagementServiceProtos";
option go_package = "./user_management_service;user_management_service";

// Generated proto file for User Management Service
// Original data product name: "User Management Service"
// Generated on 2025-06-30T...
// Compatible with Java and Go

message UserProfile {
  // Original name: "User Profile"
  // Primary key
  // Original name: "userID"
  // UUID as string (e.g., 123e4567-e89b-12d3-a456-426614174000)
  string user_id = 1;

  // Original name: "firstName"
  // UTF-8 encoded string
  string first_name = 2;

  // Original name: "user-email"
  // UTF-8 encoded string
  string user_email = 3;

  // Boolean value
  bool is_active = 4;
}
```

The conversion summary would show:
- **📦 Package**: "User Management Service" → "user_management_service"
- **📋 Message**: "User Profile" → "UserProfile"
- **🏷️ Field**: "UserProfile.userID" → "UserProfile.user_id"
- **🏷️ Field**: "UserProfile.firstName" → "UserProfile.first_name"
- **🏷️ Field**: "UserProfile.user-email" → "UserProfile.user_email"

## Language Support

The generated proto files include language-specific options for seamless integration:

### Java Support
- **java_multiple_files = true**: Generates separate .java files for each message
- **java_package**: Automatically generates Java package name from proto package
- **java_outer_classname**: Creates appropriate outer class name
- **Enhanced Types**: Support for boxed primitives (Integer, Long, Boolean, etc.)
- **Binary Data**: `byte[]` maps to proto `bytes` type

### Go Support
- **go_package**: Properly formatted Go package declaration
- **Path Management**: Source-relative path generation
- **Type Compatibility**: All Java types map cleanly to Go equivalents

### Compilation Ready
- Download includes both `.proto` file and `README.md` with compilation instructions
- Ready-to-use commands for both `protoc` compilation scenarios
- Dependency information for Maven, Gradle, and Go modules

## Technology Stack

- **React 19** - Frontend framework
- **TypeScript 5** - Type safety
- **Vite 5** - Build tool and development server
- **CSS3** - Custom styling with dark theme

## License

ISC License

## Contributing

This is a local development tool. Future enhancements may include:
- Server-side proto generation
- Multiple package support
- Proto validation
- Import/export of entity definitions
- Integration with proto registries
