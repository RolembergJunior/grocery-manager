# Novo Fluxo de Listas — Estrutura, Hooks e Services

Este documento apresenta a arquitetura recomendada, incluindo **ListManager**, **hooks**, **atoms** e **estruturas de sincronização**, totalmente detalhados. Ele foi criado para servir como referência para outra IA ou desenvolvedor implementar o sistema.

---

# 1. Arquitetura Geral

O fluxo foi reorganizado em três pilares principais:

1. **ListManager**: Centro de todas as regras de negócio e operações de lista.
2. **Hook `useList(listId)`**: API reativa para componentes consumirem itens da lista.
3. **Atoms organizados**: Produtos, listas e itens separados em camadas claras.

---

# 2. Estrutura de Pastas

```
src/
  lib/
    atoms/
      products.atom.ts
      list-items.atom.ts
      lists.atom.ts
  services/
    list-manager.ts
  hooks/
    use-list.ts
```

---

# 3. Tipagens

```ts
export interface ListItem {
  id: string;
  listId: string;
  name: string;
  category: string;
  unit: string;
  neededQuantity: number;
  boughtQuantity: number;
  observation: string | null;
  checked: boolean;
  isRemoved: boolean;
  fromList: "inventory" | "created";
  itemId: string | null; // Simplicado
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

---

# 4. Atoms

## 4.1 productsAtom
```ts
import { atom } from "jotai";

export const productsAtom = atom([] as Product[]);
```

## 4.2 listItemsAtom
```ts
import { atomFamily } from "jotai/utils";

export const listItemsAtom = atomFamily((listId: string) => atom([] as ListItem[]));
```

---

# 5. ListManager (service principal)

O ListManager centraliza toda regra de negócio, removendo lógica dos componentes.

```ts
import { getListItems, createListItem, updateListItem, batchUpdateItems } from "@/services/list-items-api";
import { syncInventoryListAPI, updateInventoryFromListAPI } from "@/services/inventory-api";
import { listItemsAtom, productsAtom } from "@/lib/atoms";
import { getDefaultStore } from "jotai";

const store = getDefaultStore();

export const ListManager = {
  async loadList(listId: string) {
    const items = await getListItems(listId);
    store.set(listItemsAtom(listId), items);
  },

  async addItemFromInventory(listId: string, product: Product) {
    const item = await createListItem({
      listId,
      name: product.name,
      category: product.category,
      unit: product.unit,
      neededQuantity: 1,
      boughtQuantity: 0,
      itemId: product.id,
      checked: false,
      isRemoved: false,
      fromList: "inventory",
    });

    store.set(listItemsAtom(listId), (prev) => [...prev, item]);
  },

  async addItemManual(listId: string, data: Partial<ListItem>) {
    const item = await createListItem({
      ...data,
      itemId: null,
      listId,
      fromList: "created",
      checked: false,
      isRemoved: false,
    });

    store.set(listItemsAtom(listId), (prev) => [...prev, item]);
  },

  async updateItem(listId: string, id: string, data: Partial<ListItem>) {
    const updated = await updateListItem(id, data);

    store.set(listItemsAtom(listId), (prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
  },

  async syncWithInventory(listId: string, products: Product[]) {
    const items = await syncInventoryListAPI(listId, products);
    store.set(listItemsAtom(listId), items);
  },

  async completeList(listId: string) {
    const items = store.get(listItemsAtom(listId));
    const reset = items.map((i) => ({ ...i, checked: false }));

    await batchUpdateItems(reset);
    store.set(listItemsAtom(listId), reset);

    await updateInventoryFromListAPI(items);

    const products = store.get(productsAtom);
    const updatedProducts = products.map((p) => {
      const li = items.find((i) => i.itemId === p.id && i.checked);
      if (!li) return p;

      return {
        ...p,
        statusCompra: 2,
        currentQuantity: li.boughtQuantity,
      };
    });

    store.set(productsAtom, updatedProducts);
  },
};
```

---

# 6. Hook: `useList(listId)`

```ts
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { listItemsAtom, productsAtom } from "@/lib/atoms";
import { ListManager } from "@/services/list-manager";

export function useList(listId: string) {
  const items = useAtomValue(listItemsAtom(listId));
  const products = useAtomValue(productsAtom);

  useEffect(() => {
    ListManager.loadList(listId);
  }, [listId]);

  useEffect(() => {
    ListManager.syncWithInventory(listId, products);
  }, [products]);

  return {
    items,
    addItemFromInventory: (product: Product) =>
      ListManager.addItemFromInventory(listId, product),

    addItemManual: (data: Partial<ListItem>) =>
      ListManager.addItemManual(listId, data),

    updateItem: (id: string, data: Partial<ListItem>) =>
      ListManager.updateItem(listId, id, data),

    syncWithInventory: () =>
      ListManager.syncWithInventory(listId, products),

    completeList: () => ListManager.completeList(listId),
  };
}
```

---

# 7. Como usar no componente

```tsx
const { items, updateItem, addItemFromInventory, completeList } = useList(listId);
```

---

# 8. Regras de Negócio Embutidas

- Itens com `fromList="inventory"` **sempre** têm `itemId != null`.
- Itens com `fromList="created"` **sempre** têm `itemId == null`.
- Ao finalizar:
  - `checked` é resetado
  - inventário é atualizado
  - atoms permanecem sincronizados

---

# 9. O que outra LLM pode fazer com este documento

- Implementar todos os arquivos diretamente
- Ajustar API routes conforme necessidade
- Criar UI consumindo `useList`
- Estender regras de negócio dentro do ListManager

---

# 10. Conclusão

Este arquivo define uma estrutura clara, organizada e pronta para implementação, com responsabilidades muito bem separadas e componentes leves. O ListManager garante previsibilidade e manutenção simples no projeto.

