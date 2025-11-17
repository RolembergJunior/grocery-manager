# Fluxo de Lista de Estoque e ListItems - Documentação

## Visão Geral

Este documento descreve o sistema de gerenciamento de listas de compras com foco na diferenciação entre itens que vêm do inventário e itens criados manualmente.

## Conceitos Principais

### ListItem.fromList

Cada `ListItem` possui uma propriedade `fromList` que indica sua origem:

- **`"inventory"`**: Item clonado do inventário (produtos)
- **`"created"`**: Item criado manualmente pelo usuário

### Tipos de Listas

1. **Lista de Estoque** (inventory-based)

   - Gerada automaticamente a partir dos produtos do inventário
   - Produtos com `statusCompra === 1` são clonados como ListItems
   - Sincronização bidirecional com o inventário

2. **Listas Criadas pelo Usuário**
   - Listas personalizadas
   - Podem conter itens do inventário E itens criados manualmente
   - Flexibilidade total

## Estrutura de Dados

### ListItem

```typescript
interface ListItem {
  id: string;
  name: string;
  listId: string;
  itemId: string[]; // IDs dos produtos do inventário (quando fromList === "inventory")
  category: string;
  neededQuantity: number;
  boughtQuantity: number;
  unit: string;
  observation: string | null;
  checked: boolean;
  isRemoved: boolean;
  fromList: "inventory" | "created"; // ⭐ Diferencia origem do item
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

## Fluxos Implementados

### 1. Adicionar Item do Inventário à Lista

**Arquivo**: `src/app/shopping-list/components/AddItemModal/index.tsx`

```typescript
// Quando usuário seleciona um produto do inventário
const params = {
  listId,
  itemId: [selectedProduct.id], // Referência ao produto
  name: selectedProduct.name,
  category: selectedProduct.category,
  unit: selectedProduct.unit,
  neededQuantity,
  checked: false,
  isRemoved: false,
  fromList: "inventory" as const, // ⭐ Marca como item do inventário
};

await createListItem(params);
```

**Resultado**:

- ListItem criado com `fromList: "inventory"`
- `itemId` contém o ID do produto original
- Vínculo mantido para sincronização futura

### 2. Criar Item Manualmente

**Arquivo**: `src/app/shopping-list/components/AddItemModal/index.tsx`

```typescript
// Quando usuário cria um item novo
await createListItem({
  listId,
  itemId: [], // Sem vínculo com inventário
  neededQuantity: newItemForm.quantity,
  name: newItemForm.name.trim(),
  category: newItemForm.category,
  unit: newItemForm.unit,
  checked: false,
  isRemoved: false,
  fromList: "created" as const, // ⭐ Marca como item criado
});
```

**Resultado**:

- ListItem criado com `fromList: "created"`
- `itemId` vazio (sem vínculo com inventário)
- Independente do inventário

### 3. Sincronizar Lista de Estoque

**Arquivo**: `src/services/inventory-list.ts`

```typescript
// Sincroniza produtos do inventário com ListItems
await syncInventoryList(products);
```

**API**: `POST /api/sync-inventory-list`

**Lógica**:

1. Filtra produtos com `statusCompra === 1` (precisam ser comprados)
2. Busca ListItems existentes da lista de estoque
3. Remove ListItems de produtos que não precisam mais ser comprados
4. Cria novos ListItems para produtos novos
5. Atualiza ListItems existentes com dados atualizados do produto

**Resultado**:

- Lista de estoque sempre sincronizada com inventário
- ListItems com `fromList: "inventory"`
- Vínculo mantido via `itemId`

### 4. Finalizar Lista

**Arquivo**: `src/app/shopping-list/list/page.tsx`

```typescript
// Ao finalizar lista
await updateManyListItems(currentItems as ListItem[], true);
//                                                      ↑
//                                              isCompleting=true
```

**API**: `PUT /api/update-many-items`

**Lógica**:

```typescript
if (isCompleting) {
  const now = new Date().toISOString();
  const resetItems = items.map((item) => ({
    ...item,
    checked: false, // ⭐ Reseta checked
    updatedAt: now, // ⭐ Atualiza timestamp
  }));
  await batchUpdateItems(resetItems);
}
```

**Resultado**:

- Todos os itens têm `checked` resetado para `false`
- `updatedAt` atualizado para timestamp atual
- Lista pronta para ser reutilizada

### 5. Atualizar Inventário a partir da Lista

**Arquivo**: `src/services/inventory-list.ts`

```typescript
// Sincroniza mudanças de volta para o inventário
await updateInventoryFromList(listItems);
```

**API**: `PUT /api/update-inventory-from-list`

**Lógica**:

```typescript
// Para cada ListItem com fromList === "inventory"
listItems
  .filter((item) => item.fromList === "inventory")
  .forEach(async (item) => {
    const productId = item.itemId[0];

    if (item.checked) {
      // Item comprado -> atualizar produto
      await updateProduct(productId, {
        statusCompra: 2, // ⭐ Marca como comprado
        currentQuantity: item.boughtQuantity,
        updatedAt: now,
      });
    } else {
      // Apenas atualizar quantidade
      await updateProduct(productId, {
        currentQuantity: item.boughtQuantity,
        updatedAt: now,
      });
    }
  });
```

**Resultado**:

- Produtos do inventário atualizados com base nos ListItems
- `statusCompra` atualizado quando item marcado como comprado
- Atoms do inventário sincronizados automaticamente

## Sincronização de Atoms

### Problema

Quando ListItems são atualizados, os Products (inventário) também precisam ser atualizados nos atoms para refletir mudanças em tempo real.

### Solução

A API `update-inventory-from-list` atualiza os produtos no Firestore. Os atoms são atualizados através de:

1. **Re-fetch automático**: Componentes que usam `productsAtom` re-buscam dados
2. **Atualização manual**: Após salvar, atualizar o atom diretamente

**Exemplo de atualização manual**:

```typescript
import { useSetAtom } from "jotai";
import { productsAtom } from "@/lib/atoms";

const setProducts = useSetAtom(productsAtom);

// Após salvar lista
await updateInventoryFromList(listItems);

// Atualizar atoms
setProducts((prevProducts) =>
  prevProducts.map((product) => {
    const listItem = listItems.find(
      (item) => item.fromList === "inventory" && item.itemId[0] === product.id
    );

    if (listItem && listItem.checked) {
      return {
        ...product,
        statusCompra: 2,
        currentQuantity: listItem.boughtQuantity,
      };
    }

    return product;
  })
);
```

## Arquivos Criados/Modificados

### Novos Arquivos

1. **`src/services/inventory-list.ts`**

   - `syncInventoryList()`: Sincroniza inventário → ListItems
   - `updateInventoryFromList()`: Sincroniza ListItems → inventário

2. **`src/app/api/sync-inventory-list/route.ts`**

   - POST endpoint para sincronizar lista de estoque
   - Clona produtos como ListItems
   - Remove itens obsoletos

3. **`src/app/api/update-inventory-from-list/route.ts`**
   - PUT endpoint para atualizar inventário
   - Sincroniza mudanças de ListItems para Products
   - Suporta finalização de lista

### Arquivos Modificados

1. **`src/app/type.ts`**

   - Adicionado `fromList: "inventory" | "created"` ao `ListItem`

2. **`src/services/list-items.ts`**

   - Adicionado `fromList` à interface `CreateListItemProps`
   - Adicionado parâmetro `isCompleting` ao `updateMany()`

3. **`src/app/shopping-list/components/AddItemModal/index.tsx`**

   - Adicionado `fromList: "inventory"` ao adicionar item do inventário
   - Adicionado `fromList: "created"` ao criar item manualmente

4. **`src/app/api/update-many-items/route.ts`**

   - Suporte para `isCompleting` flag
   - Reset de `checked` e atualização de `updatedAt` ao finalizar

5. **`src/app/shopping-list/list/page.tsx`**
   - Passa `isCompleting: true` ao finalizar lista

## Casos de Uso

### Caso 1: Compra Semanal com Lista de Estoque

1. Usuário acessa "Lista do Estoque"
2. Sistema sincroniza produtos (`syncInventoryList`)
3. Produtos com `statusCompra === 1` aparecem como ListItems
4. Usuário marca itens como comprados durante compra
5. Ao finalizar:
   - Produtos marcados recebem `statusCompra = 2`
   - Todos os `checked` resetam para `false`
   - Lista pronta para próxima semana

### Caso 2: Lista Personalizada com Mix de Itens

1. Usuário cria nova lista "Churrasco"
2. Adiciona itens do inventário (carne, cerveja)
   - `fromList: "inventory"`
   - Vinculados aos produtos
3. Adiciona itens novos (carvão, gelo)
   - `fromList: "created"`
   - Sem vínculo com inventário
4. Ao finalizar:
   - Itens do inventário atualizam produtos
   - Itens criados apenas resetam `checked`

### Caso 3: Sincronização em Tempo Real

1. Usuário está na lista de compras
2. Marca item como comprado
3. Sistema atualiza `boughtQuantity`
4. Ao salvar:
   - API atualiza produto no Firestore
   - Atom do inventário é atualizado
   - Tela de inventário reflete mudança sem reload

## Regras de Negócio

### ListItems com fromList: "inventory"

✅ **DEVE**:

- Ter `itemId` preenchido com ID do produto
- Sincronizar mudanças com produto do inventário
- Atualizar `statusCompra` do produto quando marcado como comprado

❌ **NÃO DEVE**:

- Ter `itemId` vazio
- Existir sem produto correspondente no inventário

### ListItems com fromList: "created"

✅ **DEVE**:

- Ter `itemId` vazio
- Ser independente do inventário
- Apenas resetar `checked` ao finalizar

❌ **NÃO DEVE**:

- Ter `itemId` preenchido
- Tentar sincronizar com inventário

### Finalização de Lista

✅ **SEMPRE**:

- Resetar `checked` para `false` em TODOS os itens
- Atualizar `updatedAt` para timestamp atual
- Manter `boughtQuantity` e outras propriedades

❌ **NUNCA**:

- Deletar itens ao finalizar
- Manter `checked: true` após finalização

## Testes Recomendados

### Teste 1: Adicionar Item do Inventário

- [ ] Selecionar produto do inventário
- [ ] Verificar `fromList === "inventory"`
- [ ] Verificar `itemId` contém ID do produto

### Teste 2: Criar Item Manualmente

- [ ] Criar item novo
- [ ] Verificar `fromList === "created"`
- [ ] Verificar `itemId` está vazio

### Teste 3: Sincronizar Lista de Estoque

- [ ] Produtos com `statusCompra === 1` aparecem
- [ ] Produtos com `statusCompra !== 1` não aparecem
- [ ] Mudanças no inventário refletem na lista

### Teste 4: Finalizar Lista

- [ ] Marcar alguns itens como comprados
- [ ] Finalizar lista
- [ ] Verificar todos `checked === false`
- [ ] Verificar `updatedAt` atualizado

### Teste 5: Sincronizar com Inventário

- [ ] Marcar item do inventário como comprado
- [ ] Salvar lista
- [ ] Verificar produto tem `statusCompra === 2`
- [ ] Verificar atom do inventário atualizado

### Teste 6: Mix de Itens

- [ ] Lista com itens do inventário E criados
- [ ] Finalizar lista
- [ ] Verificar apenas itens do inventário atualizam produtos
- [ ] Verificar todos os `checked` resetam

## Troubleshooting

### Problema: Item não sincroniza com inventário

**Causa**: `fromList` incorreto ou `itemId` vazio
**Solução**: Verificar que item do inventário tem `fromList: "inventory"` e `itemId` preenchido

### Problema: Checked não reseta ao finalizar

**Causa**: `isCompleting` não está sendo passado
**Solução**: Verificar que `updateMany(items, true)` está sendo chamado

### Problema: Atom não atualiza após salvar

**Causa**: Falta de sincronização manual
**Solução**: Atualizar atom após `updateInventoryFromList()`

### Problema: Lista de estoque vazia

**Causa**: Nenhum produto com `statusCompra === 1`
**Solução**: Verificar produtos no inventário

## Melhorias Futuras

1. **Sincronização Automática de Atoms**: Hook customizado para sincronizar automaticamente
2. **Histórico de Compras**: Manter histórico de quando itens foram comprados
3. **Sugestões Inteligentes**: Sugerir itens baseado em histórico
4. **Notificações**: Alertar quando produtos precisam ser repostos
5. **Compartilhamento**: Permitir compartilhar listas entre usuários

## Conclusão

O sistema de `fromList` nos ListItems permite:

- ✅ Diferenciar origem dos itens
- ✅ Sincronização bidirecional com inventário
- ✅ Flexibilidade para listas personalizadas
- ✅ Reset correto ao finalizar listas
- ✅ Atualização de atoms em tempo real

Mantém compatibilidade e segue os padrões do projeto.
