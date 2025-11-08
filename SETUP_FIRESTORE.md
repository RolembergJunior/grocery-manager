# Firestore Setup Guide

This guide will help you set up and deploy the new Firestore structure for the Grocery Manager app.

## 📋 Prerequisites

- Firebase project already configured
- Firebase Admin SDK credentials in `.env.local`
- Existing user data in the old structure (optional, for migration)

## 🚀 Step-by-Step Setup

### 1. Deploy Firestore Security Rules

The security rules are defined in `firestore.rules`. Deploy them to Firebase:

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done already)
firebase init firestore

# Deploy the security rules
firebase deploy --only firestore:rules
```

**Important**: The rules file includes a temporary rule for the `users` collection to support migration. Remove this after migration is complete.

### 2. Create Firestore Indexes

Some queries require composite indexes. Create these in the Firebase Console:

#### Products Collection
- **Index 1**: `userId` (Ascending) + `isRemoved` (Ascending)
- **Index 2**: `userId` (Ascending) + `category` (Ascending) + `isRemoved` (Ascending)

#### Categories Collection
- **Index**: `userId` (Ascending) + `isRemoved` (Ascending)

#### Lists Collection
- **Index**: `userId` (Ascending) + `isRemoved` (Ascending)

#### List Items Collection
- **Index 1**: `userId` (Ascending) + `isRemoved` (Ascending)
- **Index 2**: `list_id` (Ascending) + `isRemoved` (Ascending)

**To create indexes:**
1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Create Index"
3. Add the fields and directions as specified above
4. Click "Create"

### 3. Run Data Migration (If Needed)

If you have existing users with data in the old structure, you need to migrate them.

#### Option A: Create a Migration API Endpoint

Create a new API route for migration:

```typescript
// src/app/api/migrate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { migrateUserProducts, getMigrationStatus } from "@/lib/migration-helper";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Check if already migrated
    const status = await getMigrationStatus(userId);
    if (status.isMigrated && status.newProductsCount > 0) {
      return NextResponse.json({
        message: "Already migrated",
        status,
      });
    }

    // Run migration
    const result = await migrateUserProducts(userId);
    
    return NextResponse.json({
      success: result.success,
      migratedCount: result.migratedCount,
      errors: result.errors,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Migration failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = await getMigrationStatus(session.user.id);
    return NextResponse.json(status);
  } catch (error) {
    console.error("Error getting migration status:", error);
    return NextResponse.json(
      { error: "Failed to get status" },
      { status: 500 }
    );
  }
}
```

#### Option B: Automatic Migration on First Load

Add migration check to your main page or layout:

```typescript
// In your main page component
useEffect(() => {
  async function checkAndMigrate() {
    try {
      const response = await fetch('/api/migrate');
      const status = await response.json();
      
      if (!status.isMigrated) {
        // Show migration UI or run automatically
        const migrateResponse = await fetch('/api/migrate', {
          method: 'POST',
        });
        const result = await migrateResponse.json();
        console.log('Migration result:', result);
      }
    } catch (error) {
      console.error('Migration check failed:', error);
    }
  }
  
  checkAndMigrate();
}, []);
```

### 4. Update Environment Variables

Ensure your `.env.local` has all required Firebase credentials:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
```

### 5. Test the Implementation

#### Test Products API
```bash
# Get products
curl -X GET "http://localhost:3000/api/products?userId=test-user-id"

# Create product (requires authentication)
curl -X POST "http://localhost:3000/api/update-or-create?userId=test-user-id" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","currentQuantity":1,"neededQuantity":5,"unit":"kg","category":"cat1","statusCompra":0}'
```

#### Test Categories API
```bash
# Get categories
curl -X GET "http://localhost:3000/api/categories?userId=test-user-id"

# Create category
curl -X POST "http://localhost:3000/api/categories?userId=test-user-id" \
  -H "Content-Type: application/json" \
  -d '{"name":"Frutas","color_id":1}'
```

### 6. Monitor and Verify

1. **Check Firestore Console**: Verify that documents are being created in the correct collections
2. **Check Logs**: Monitor application logs for any errors
3. **Test UI**: Ensure all features work correctly with the new structure
4. **Verify Queries**: Check that filtering and searching work as expected

## 🔧 Troubleshooting

### Issue: "Missing or insufficient permissions"
**Solution**: Deploy the Firestore security rules using `firebase deploy --only firestore:rules`

### Issue: "The query requires an index"
**Solution**: Click the link in the error message to create the required index, or manually create it in Firebase Console

### Issue: Products not showing after migration
**Solution**: 
1. Check migration status: `GET /api/migrate`
2. Verify `isRemoved` field is set to `0` for products
3. Check Firestore security rules are deployed

### Issue: Timestamp serialization errors
**Solution**: Ensure dates are properly converted when sending to/from API. The API routes handle Date objects correctly.

## 📊 Monitoring Migration Progress

You can track migration progress for all users:

```typescript
// Create an admin endpoint to check migration status for all users
// This should be protected and only accessible to admins

import { adminDb } from "@/lib/firebaseAdmin";

async function getAllMigrationStatus() {
  const usersSnapshot = await adminDb.collection("users").get();
  const statuses = [];
  
  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const status = await getMigrationStatus(userId);
    statuses.push({ userId, ...status });
  }
  
  return statuses;
}
```

## ✅ Post-Migration Cleanup

After confirming all users have been successfully migrated:

1. **Remove legacy users collection rule** from `firestore.rules`:
   ```
   // Remove this entire block:
   match /users/{userId} {
     allow read, write: if isOwner(userId);
   }
   ```

2. **Deploy updated rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Optional: Archive old data**:
   - Export old user documents for backup
   - Consider removing the `products` array from user documents

## 🎯 Next Steps

1. Update UI components to use new atoms and services
2. Implement category management UI
3. Implement shopping list management UI
4. Add data validation and error handling in forms
5. Implement offline support with Firestore caching
6. Add analytics to track usage

## 📚 Additional Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Indexes Documentation](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- Implementation details: `FIRESTORE_IMPLEMENTATION.md`
