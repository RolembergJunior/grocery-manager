### Search and Filter Controls Plan

#### Overview

Add a styled search input and a select-based status filter accessible from the filter button, and wire both to filter the product list.

#### Goals

- Improve the text input styles in `Controls`.
- Add a dropdown `SelectFilter` tied to the filter button.
- Filter products by search term and by status.
- Hide categories with no matching items.

#### Affected files

- `src/app/page.tsx` (add local state and pass props)
- `src/components/Controls/index.tsx` (style input, add filter dropdown)
- `src/components/ProductList/index.tsx` (apply filters to items)
- New: `src/components/SelectFilter/index.tsx` (dropdown component using `Select`)

#### Status values

Use existing status utilities from `src/components/ProductList/utils.ts`:

- `needs-shopping`: Precisa comprar
- `almost-empty`: Quase sem estoque
- `in-stock`: Em estoque
- Pseudo-option: `all` to disable status filtering

#### Component contracts

- `Controls` props:

  - `searchTerm: string`
  - `onSearchChange: (value: string) => void`
  - `filterValue: string` (one of `all | needs-shopping | almost-empty | in-stock`)
  - `onFilterChange: (value: string) => void`
  - existing: `saveData`, `products`

- `ProductList` props:

  - `searchTerm: string`
  - `statusFilter: string`
  - existing: `products`, `updateItem`, `deleteItem`

- `SelectFilter` (new):
  - `value: string`
  - `onChange: (value: string) => void`
  - Uses `src/components/Select` internally.

#### Implementation steps

1. `page.tsx`

- Add local state:
  - `searchTerm` (default `""`)
  - `statusFilter` (default `"all"`)
- Pass to `Controls`:
  - `searchTerm`, `onSearchChange={setSearchTerm}`
  - `filterValue={statusFilter}`, `onFilterChange={setStatusFilter}`
- Pass to `ProductList`:
  - `searchTerm`, `statusFilter`

2. `Controls/index.tsx`

- Style the input:
  - Add a left-aligned search icon.
  - Use padding, rounded corners, subtle border, focus ring.
  - Placeholder: "Buscar produtos..."
- Add a filter button that toggles a dropdown.
- Render `SelectFilter` positioned below/right of the button.
- Keep existing Add button/modal.

3. `SelectFilter/index.tsx` (new)

- Wrap existing `Select` component with options:
  - `Todos (all)`, `Precisa comprar (needs-shopping)`, `Quase sem estoque (almost-empty)`, `Em estoque (in-stock)`
- Basic card styling: white background, rounded, border, shadow, padding.

4. `ProductList/index.tsx`

- For each category’s items:
  - Filter by `searchTerm` (case-insensitive `includes` on `item.name`).
  - Filter by `statusFilter`:
    - If `"all"`, allow all.
    - Else match `getItemStatus(item) === statusFilter`.
- Skip rendering a category if `filteredItems.length === 0`.
- Category counts shown should reflect filtered items (can change later if needed).

#### UX details

- Search input:
  - Classes: `w-full pl-10 pr-4 py-3 rounded-lg bg-white/90 border border-gray-200 shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black`
- Filter button:
  - Classes: `px-4 py-3 rounded-lg bg-white/90 border border-gray-200 shadow-lg hover:bg-gray-50`
- Select dropdown container:
  - Classes: `w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4`

#### Testing checklist

- Typing in search filters items by name across all categories.
- Changing status filter updates the list accordingly.
- Categories with zero matching items are hidden.
- Counts in category headers update to reflect visible items.
- Dropdown toggles reliably and closes when re-clicked.
- No regression to add modal and existing actions.

#### Future enhancements (optional)

- Close dropdown on outside click or Escape.
- Persist `searchTerm` and `statusFilter` in URL/query or atom.
- Add clear buttons for search and filter.
- Keyboard navigation for the dropdown.
