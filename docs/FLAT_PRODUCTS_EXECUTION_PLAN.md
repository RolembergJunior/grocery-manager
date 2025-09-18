# Flat Products Execution Plan

This plan guides verification and operation after refactoring the product model from a category-keyed object to a flat array of items (`Products = Item[]`).

## Overview
- Each `Item` includes a required `category` string and optional `checked` flag.
- API `/api/products` GET migrates legacy object-shaped data to a flat array at read time.
- API `/api/products` PUT stores a flat array.
- UI, services, and atoms now expect `Products` to be an array.

## Affected Files (key updates)
- `src/app/type.ts` — `Products = Item[]`; `Item.category` required.
- `src/services/products.ts` — returns `[]` by default, validates responses.
- `src/lib/atoms.ts` — `productsAtom` defaults to `[]`; emptiness via `length`.
- `src/app/api/products/route.ts` — GET migrates, PUT stores array.
- `src/app/api/update-or-create/route.ts` — updates quantity by `id` in array.
- `src/app/utils.ts` — statistics and sorting over arrays.
- `src/components/ProductList/utils.ts` — derive categories from items; filter by `item.category`.
- `src/app/shopping-list/utils.ts` — filter-group and item handlers on array.
- `src/app/shopping-list/page.tsx` — renders grouped `Record<category, Item[]>` from utils.
- `src/components/AddNewItemForm/index.tsx` — add/update in flat array with `category` set.
- `src/app/page.tsx` — emptiness and stats use array semantics.

## Local Development
1. Install deps (if needed):
   - `npm ci` or `npm install`
2. Run dev:
   - `npm run dev`
3. Open: http://localhost:3000

## API Verification
- GET products
  - Request: `GET /api/products?userId=<USER_ID>`
  - Expected 200 body: `{ "products": Item[] }` (empty array if none)
  - Legacy data (object map) should be migrated to array in the response.
- PUT products (save all)
  - Request: `PUT /api/products?userId=<USER_ID>`
  - Body: `{ "products": Item[] }`
  - Expected 200 body: `{ "ok": true }`
- Update or create (quantity-only update)
  - Request: `PUT /api/update-or-create?userId=<USER_ID>`
  - Body: `{ "id": number, "quantity": string }`
  - Expected: item in stored array updated with `currentQuantity`.

## Frontend E2E Checklist
- Initial load
  - Authenticated user loads products via `subscribeProducts()`.
  - Empty state renders when `products.length === 0`.
- Adding items
  - Add item with name, category, quantities, unit.
  - Item appears under its category group.
  - Re-adding same name+category updates existing item quantities.
- Editing items (Shopping List page)
  - Toggle `checked` on an item.
  - Change `currentQuantity` — UI updates.
  - Remove an item — removed from list and group.
- Saving
  - Trigger a save (e.g., via `Controls` flow); confirm success toast.
  - Reload page; items persist and group correctly.

## Data Shape Examples
- Item
```json
{
  "id": 1734523452345,
  "name": "Milk",
  "currentQuantity": 1,
  "neededQuantity": 2,
  "unit": "l",
  "category": "dairy",
  "checked": false
}
```
- Products (array)
```json
[
  { "id": 1, "name": "Apple", "currentQuantity": 0, "neededQuantity": 6, "unit": "pcs", "category": "fruits" },
  { "id": 2, "name": "Milk", "currentQuantity": 1, "neededQuantity": 2, "unit": "l", "category": "dairy" }
]
```

## Migration Notes
- No destructive migration: GET returns migrated array for legacy users.
- PUT will store the array going forward.
- If you need one-time backend migration, export all users, transform map→array, and write back; otherwise, lazy migration on read is sufficient.

## Test Scenarios
- New user (no data): GET returns `[]`; can add and save.
- Legacy user (object data): GET returns array with `category` injected per item.
- Edge cases: invalid bodies, missing `userId`, empty arrays, duplicate names in different categories.

## Troubleshooting
- If UI errors reference `products[category]` or `Object.keys(products)`, update the offending component to use the array model.
- Ensure `productsAtom` default is `[]` and emptiness checks are via `length`.
- Verify environment/auth for API requests; ensure userId passed.

## Next Steps
- Performance: memoize derived groupings on large lists.
- Validation: enforce category enum or mapping.
- Optional: background migrate stored legacy data to arrays.
