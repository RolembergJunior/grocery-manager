"use client";

import { useState, useMemo } from "react";
import { Plus, Package, ShoppingBag, ListPlus } from "lucide-react";
import { useAtomValue } from "jotai";
import { Product } from "@/app/type";
import { toast } from "sonner";
import RenderWhen from "@/components/RenderWhen";
import Modal from "@/components/Modal";
import FieldForm from "@/components/FieldForm";
import { unitOptions } from "@/app/utils";
import { useList } from "@/hooks/use-list";
import { productsAtom } from "@/lib/atoms/products";
import { categoriesAtom } from "@/lib/atoms/categories";
import { addItemFromInventory, addItemManual } from "@/services/list-manager";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
}

type ViewMode = "inventory" | "new";

interface NewItemForm {
  name: string;
  category: string;
  quantity: number;
  unit: string;
}

export default function AddItemModal({
  isOpen,
  onClose,
  listId,
}: AddItemModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [neededQuantity, setNeededQuantity] = useState(1);
  const [newItemForm, setNewItemForm] = useState<NewItemForm>({
    name: "",
    category: "",
    quantity: 1,
    unit: "und",
  });

  const products = useAtomValue(productsAtom);
  const categories = useAtomValue(categoriesAtom);

  const { items } = useList(listId!);

  const filteredProducts = useMemo(() => {
    const existingItemIds = new Set(items.flatMap((item) => item.itemId));

    return products.filter(
      (product) =>
        !existingItemIds.has(product.id) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, items, searchTerm]);

  function getCategoryName(categoryId: string) {
    return categories.find((category) => category.id === categoryId)?.name;
  }

  function handleSelectProduct(product: Product) {
    setSelectedProduct(product);
    setNeededQuantity(product.neededQuantity || 1);
  }

  function handleAddItem() {
    if (!selectedProduct) return;

    toast.promise(addItemFromInventory(listId, selectedProduct), {
      loading: "Adicionando item...",
      success: () => {
        handleClose();
        return "Item adicionado à lista!";
      },
      error: "Erro ao adicionar item",
    });
  }

  function handleAddNewItem() {
    if (!newItemForm.name.trim()) {
      toast.error("Digite o nome do item");
      return;
    }

    if (!newItemForm.category) {
      toast.error("Selecione uma categoria");
      return;
    }

    toast.promise(addItemManual(listId, newItemForm), {
      loading: "Criando item...",
      success: () => {
        handleClose();
        return "Item criado e adicionado à lista!";
      },
      error: "Erro ao criar item",
    });
  }

  function handleClose() {
    setViewMode("inventory");
    setSearchTerm("");
    setSelectedProduct(null);
    setNeededQuantity(1);
    setNewItemForm({
      name: "",
      category: "",
      quantity: 1,
      unit: "unidade",
    });
    onClose();
  }

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Adicionar Item à Lista"
      iconTitle={<ShoppingBag className="w-6 h-6" />}
    >
      <div className="space-y-4">
        {/* Toggle between inventory and new item */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setViewMode("inventory")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all duration-200 ${
              viewMode === "inventory"
                ? "bg-white text-[var(--color-blue)] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Package className="w-4 h-4" />
            Do Inventário
          </button>
          <button
            onClick={() => setViewMode("new")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all duration-200 ${
              viewMode === "new"
                ? "bg-white text-[var(--color-blue)] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ListPlus className="w-4 h-4" />
            Criar Novo
          </button>
        </div>

        <RenderWhen
          isTrue={viewMode === "inventory"}
          elseElement={
            <div className="space-y-4">
              <FieldForm
                type="text"
                label="Nome do Item"
                value={newItemForm.name}
                onChange={(value) =>
                  setNewItemForm({ ...newItemForm, name: value as string })
                }
                required
                placeholder="Ex: Arroz, Feijão, Macarrão..."
                maxLength={50}
              />

              <FieldForm
                type="select"
                label="Categoria"
                value={newItemForm.category}
                onChange={(value) =>
                  setNewItemForm({ ...newItemForm, category: value as string })
                }
                options={categoryOptions}
                placeholder="Selecione uma categoria"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FieldForm
                  type="number"
                  label="Quantidade"
                  value={newItemForm.quantity}
                  onChange={(value) =>
                    setNewItemForm({
                      ...newItemForm,
                      quantity: value as number,
                    })
                  }
                  min={0}
                  required
                />

                <FieldForm
                  type="select"
                  label="Unidade"
                  value={newItemForm.unit}
                  onChange={(value) =>
                    setNewItemForm({ ...newItemForm, unit: value as string })
                  }
                  options={unitOptions}
                  required
                />
              </div>
            </div>
          }
        >
          <RenderWhen
            isTrue={!selectedProduct}
            elseElement={
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedProduct?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getCategoryName(selectedProduct?.category)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Trocar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade necessária
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={neededQuantity}
                      onChange={(e) =>
                        setNeededQuantity(parseFloat(e.target.value) || 0)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.1"
                    />
                    <span className="text-sm text-gray-600 font-medium px-4 py-2 bg-gray-100 rounded-lg">
                      {selectedProduct?.unit}
                    </span>
                  </div>
                </div>
              </div>
            }
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar produto do inventário
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite o nome do produto..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                <RenderWhen
                  isTrue={filteredProducts.length > 0}
                  elseElement={
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>Nenhum produto encontrado</p>
                      <p className="text-sm mt-1">
                        {searchTerm
                          ? "Tente outro termo de busca"
                          : "Todos os produtos já estão na lista"}
                      </p>
                    </div>
                  }
                >
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {getCategoryName(product.category)} • {product.unit}
                          </p>
                        </div>
                        <Plus className="w-5 h-5 text-blue-600" />
                      </div>
                    </button>
                  ))}
                </RenderWhen>
              </div>
            </div>
          </RenderWhen>
        </RenderWhen>

        <div className="flex gap-3 pt-4 mt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="flex-1 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={
              viewMode === "inventory" ? handleAddItem : handleAddNewItem
            }
            disabled={
              viewMode === "inventory"
                ? !selectedProduct
                : !newItemForm.name.trim() || !newItemForm.category
            }
            className="flex-1 p-3 bg-[var(--color-blue)] text-white rounded-lg hover:opacity-90 font-medium transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {viewMode === "inventory" ? "Adicionar Item" : "Criar e Adicionar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
