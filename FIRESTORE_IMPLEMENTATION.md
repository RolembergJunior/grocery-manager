# Firestore Implementation Documentation

This document describes the implementation of the Firestore structure as defined in `firestore-structure-plano.md`.

## 📋 Overview

The implementation follows the plan to create a proper Firestore structure with separate collections for:
- **profiles**: User profile information
- **products**: Individual product documents
- **categories**: Product categories
- **lists**: Shopping lists
- **list_items**: Items within shopping lists

## 🗂️ Files Created/Modified

### Type Definitions
- **`src/app/type.ts`**: Added TypeScript interfaces for all Firestore collections
  - `Profile`: User profile data
  - `Product`: Product documents with proper fields
  - `Category`: Category documents
  - `List`: Shopping list documents
  - `ListItem`: List item documents

### Firestore Helpers
- **`src/lib/firestore-helpers.ts`**: Comprehensive CRUD functions for all collections
  - Create, Read, Update, Delete operations
  - Soft delete support (using `isRemoved` field)
  - Batch operations for products
  - Transaction support for atomic updates
  - Automatic timestamp management

### API Routes
- **`src/app/api/products/route.ts`**: Updated to use new Firestore structure
- **`src/app/api/update-or-create/route.ts`**: Updated for individual product documents
- **`src/app/api/categories/route.ts`**: NEW - Category management endpoints
- **`src/app/api/lists/route.ts`**: NEW - List management endpoints
- **`src/app/api/list-items/route.ts`**: NEW - List items management endpoints

### Services
- **`src/services/products.ts`**: Existing service (compatible with new structure)
- **`src/services/categories.ts`**: NEW - Category service functions
- **`src/services/lists.ts`**: NEW - List service functions
- **`src/services/list-items.ts`**: NEW - List items service functions

### State Management
- **`src/lib/atoms.ts`**: Updated with new atoms for categories, lists, and list_items
  - `categoriesAtom`, `fetchCategoriesAtom`
  - `listsAtom`, `fetchListsAtom`, `selectedListAtom`
  - `listItemsAtom`, `fetchListItemsAtom`
  - Helper atoms for toggling and removing list items

### Migration
- **`src/lib/migration-helper.ts`**: NEW - Helper functions to migrate from old to new structure
  - `migrateUserProducts()`: Migrate user's products from old array structure
  - `isUserMigrated()`: Check if user has been migrated
  - `getMigrationStatus()`: Get detailed migration status

## 🔧 Implementation Details

### Collection Structure

#### profiles
```typescript
{
  // Document ID: userId
  name: string;
  email: string;
  name_app: string;
  image_path: string;
  created_at: Date;
  updated_at: Date;
}
```

#### products
```typescript
{
  id: string; // Auto-generated
  name: string;
  currentQuantity: number;
  neededQuantity: number;
  unit: string;
  category: string; // Reference to category ID
  observation: string;
  statusCompra: number;
  isRemoved: number; // 0 or 1 for soft delete
  userId: string; // Reference to profile
  reccurency: number | null;
}
```

#### categories
```typescript
{
  id: string; // Auto-generated
  name: string;
  color_id: number;
  isRemoved: boolean;
  userId: string; // Reference to profile
}
```

#### lists
```typescript
{
  id: string; // Auto-generated
  name: string;
  description: string;
  reset_at: Date;
  isRemoved: boolean;
  userId: string; // Reference to profile
  item_id: string[]; // Array of product IDs
  created_at: Date;
  updated_at: Date;
}
```

#### list_items
```typescript
{
  id: string; // Auto-generated
  list_id: string; // Reference to list
  item_id: string[]; // Array of product IDs
  needed_quantity: number;
  checked: boolean;
  isRemoved: boolean;
  userId: string; // Reference to profile
  created_at: Date;
  updated_at: Date;
}
```

### Soft Delete Pattern

All collections use soft delete to preserve data:
- **Products**: `isRemoved: 0 | 1`
- **Categories**: `isRemoved: boolean`
- **Lists**: `isRemoved: boolean`
- **List Items**: `isRemoved: boolean`

Query functions accept an `includeRemoved` parameter to optionally include soft-deleted items.

### Timestamp Management

Lists and list_items automatically manage timestamps:
- `created_at`: Set on creation
- `updated_at`: Updated on every modification

The `withTimestamps()` helper function in `firestore-helpers.ts` handles this automatically.

## 🔄 Migration Guide

### Automatic Migration

To migrate a user's data from the old structure to the new one:

```typescript
import { migrateUserProducts } from "@/lib/migration-helper";

const result = await migrateUserProducts(userId);
if (result.success) {
  console.log(`Migrated ${result.migratedCount} products`);
} else {
  console.error("Migration errors:", result.errors);
}
```

### Check Migration Status

```typescript
import { getMigrationStatus } from "@/lib/migration-helper";

const status = await getMigrationStatus(userId);
console.log({
  isMigrated: status.isMigrated,
  oldCount: status.oldProductsCount,
  newCount: status.newProductsCount,
});
```

## 📡 API Endpoints

### Products
- `GET /api/products?userId={userId}` - Get all products for user
- `PUT /api/products?userId={userId}` - Batch update products
- `DELETE /api/products?userId={userId}` - Soft delete a product

### Update or Create
- `PUT /api/update-or-create?userId={userId}` - Create or update a single product

### Categories
- `GET /api/categories?userId={userId}` - Get all categories
- `POST /api/categories?userId={userId}` - Create a category
- `PUT /api/categories?userId={userId}` - Update a category
- `DELETE /api/categories?userId={userId}` - Soft delete a category

### Lists
- `GET /api/lists?userId={userId}` - Get all lists
- `POST /api/lists?userId={userId}` - Create a list
- `PUT /api/lists?userId={userId}` - Update a list
- `DELETE /api/lists?userId={userId}` - Soft delete a list

### List Items
- `GET /api/list-items?userId={userId}&listId={listId}` - Get list items
- `POST /api/list-items?userId={userId}` - Create a list item
- `PUT /api/list-items?userId={userId}` - Update a list item
- `DELETE /api/list-items?userId={userId}` - Soft delete a list item

## 🎯 Usage Examples

### Fetching Products
```typescript
import { useAtom } from "jotai";
import { productsAtom, fetchProductsAtom } from "@/lib/atoms";

function MyComponent() {
  const [products] = useAtom(productsAtom);
  const [, fetchProducts] = useAtom(fetchProductsAtom);

  useEffect(() => {
    fetchProducts();
  }, []);

  return <div>{/* Render products */}</div>;
}
```

### Creating a Category
```typescript
import { createCategory } from "@/services/categories";

const newCategory = await createCategory("Frutas", 1);
```

### Managing Lists
```typescript
import { useAtom } from "jotai";
import { listsAtom, fetchListsAtom } from "@/lib/atoms";

function ListsComponent() {
  const [lists] = useAtom(listsAtom);
  const [, fetchLists] = useAtom(fetchListsAtom);

  useEffect(() => {
    fetchLists();
  }, []);

  return <div>{/* Render lists */}</div>;
}
```

## ✅ Best Practices Implemented

1. **Plural Collection Names**: All collections use plural names (products, categories, lists)
2. **camelCase Fields**: All field names use camelCase
3. **Unique IDs**: Auto-generated unique IDs for all documents
4. **CRUD Functions**: Complete CRUD operations for all collections
5. **Soft Delete**: Logical deletion preserves data
6. **Transactions**: Atomic operations for related updates
7. **Batch Operations**: Efficient bulk updates
8. **Type Safety**: Full TypeScript type definitions
9. **Error Handling**: Comprehensive error handling in all operations
10. **Backward Compatibility**: Legacy `Item` type maintained for existing code

## 🔒 Security Considerations

- All API routes should validate `userId` matches the authenticated session
- Firestore security rules should be configured to enforce user isolation
- Soft delete prevents accidental data loss
- Transactions ensure data consistency

## 📝 Next Steps

1. **Configure Firestore Security Rules**: Set up proper security rules in Firebase Console
2. **Run Migration**: Execute migration for existing users
3. **Update UI Components**: Update components to use new atoms and services
4. **Add Indexes**: Create composite indexes for common queries
5. **Monitor Performance**: Track query performance and optimize as needed

## 🐛 Troubleshooting

### Products not showing up
- Check if migration has been run for the user
- Verify `isRemoved` field is set correctly
- Check Firestore security rules

### Timestamp errors
- Ensure dates are properly serialized when sending to API
- Check that `created_at` and `updated_at` are Date objects

### Type errors
- Verify all imports use the correct types from `@/app/type`
- Check that Product IDs are strings, not numbers

## 📚 References

- Original plan: `firestore-structure-plano.md`
- Firebase Firestore docs: https://firebase.google.com/docs/firestore
- Jotai state management: https://jotai.org/
