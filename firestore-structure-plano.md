# 📦 Firebase Firestore — Estrutura de Collections e Fluxo de Criação

Este documento define a estrutura de dados, collections, campos e regras de criação no **Firebase Firestore**.  
O agente de IA deve seguir este planejamento para garantir consistência e boas práticas no banco.

---

## 🧱 Estrutura das Collections

### 1. `profiles`
**Doc ID:** `userId`  
**Campos:**
- `name`: string(50)
- `email`: string
- `name_app`: string(50)
- `image_path`: string
- `created_at`: timestamp
- `updated_at`: timestamp

---

### 2. `products`
**Doc ID:** `id`  
**Campos:**
- `name`: string(20)
- `currentQuantity`: number
- `neededQuantity`: number
- `unit`: string
- `category`: string (ID da categoria)
- `observation`: string
- `statusCompra`: number
- `isRemoved`: number (0 ou 1)
- `userId`: string (referência ao `profiles`)
- `reccurency`: number ou null

---

### 3. `categories`
**Doc ID:** `id`  
**Campos:**
- `name`: string(20)
- `color_id`: number
- `isRemoved`: boolean
- `userId`: string (referência ao `profiles`)

---

### 4. `lists`
**Doc ID:** `id`  
**Campos:**
- `name`: string(20)
- `description`: string(50)
- `reset_at`: timestamp
- `isRemoved`: boolean
- `userId`: string (referência ao `profiles`)
- `item_id`: array JSON (lista de IDs dos produtos)
- `created_at`: timestamp
- `updated_at`: timestamp

---

### 5. `list_items`
**Doc ID:** `id`  
**Campos:**
- `list_id`: string (referência ao `lists`)
- `item_id`: array JSON (IDs dos produtos)
- `needed_quantity`: number
- `checked`: boolean
- `isRemoved`: boolean
- `userId`: string (referência ao `profiles`)
- `created_at`: timestamp
- `updated_at`: timestamp

---

## 🔁 Regras e Fluxo de Criação

1. Quando um usuário criar uma conta, gerar um documento em `profiles` com `userId` como chave.
2. Todos os documentos de `products`, `categories`, `lists` e `list_items` devem conter `userId`.
3. O campo `item_id` deve armazenar IDs dos produtos como **array JSON**.
4. Os campos `created_at` e `updated_at` devem ser preenchidos automaticamente.
5. Utilizar `isRemoved` para **soft delete** (não apagar documentos fisicamente).
6. Manter os tipos e nomes de campos exatamente como definidos.

---

## 🧪 Exemplo de Documento — `products`

```json
{
  "id": "prd_123",
  "name": "Leite",
  "currentQuantity": 2,
  "neededQuantity": 5,
  "unit": "litro",
  "category": "cat_abc",
  "observation": "Integral",
  "statusCompra": 0,
  "isRemoved": 0,
  "userId": "usr_001",
  "reccurency": null
}
```

---

## 📌 Boas Práticas

- Usar nomes de collections no **plural** e campos em **camelCase**.  
- Garantir que os IDs sejam únicos e consistentes.  
- Criar funções auxiliares para **CRUD (create, read, update, soft delete)**.  
- Relacionar dados usando IDs (sem duplicar objetos).  
- Utilizar **transações ou atomic batches** quando múltiplas collections forem afetadas.

---

## 🧭 Objetivo do Agente de IA

- Configurar automaticamente a estrutura de dados no Firestore.  
- Manter consistência entre collections relacionadas.  
- Automatizar a criação, atualização e remoção lógica dos dados.  
- Seguir fielmente este planejamento.
