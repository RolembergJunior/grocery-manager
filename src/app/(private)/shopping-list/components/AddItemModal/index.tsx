"use client";

import { useState, useMemo } from "react";
import { Plus, Package, ShoppingBag, ListPlus } from "lucide-react";
import { useAtomValue } from "jotai";
import { OptionsType, Product } from "@/app/type";
import { toast } from "sonner";
import RenderWhen from "@/components/RenderWhen";
import Modal from "@/components/Modal";
import FieldForm from "@/components/FieldForm";
import { unitOptions } from "@/app/utils";
import { useList } from "@/hooks/use-list";
import { productsAtom } from "@/lib/atoms/products";
import { categoriesAtom } from "@/lib/atoms/categories";
import { addItemFromInventory, addItemManual } from "@/services/list-manager";
import { Button } from "@/components/ui/button";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
}

type ViewMode = "inventory" | "new";

interface NewItemForm {
  name: string;
  category: string;
  neededQuantity: number;
  unit: string;
  observation: string | null;
}

export default function AddItemModal({
  isOpen,
  onClose,
  listId,
}: AddItemModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("inventory");
  const [categoryMode, setCategoryMode] = useState<"select" | "create">(
    "select"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [neededQuantity, setNeededQuantity] = useState(1);
  const [newItemForm, setNewItemForm] = useState<NewItemForm>({
    name: "",
    category: "",
    neededQuantity: 1,
    unit: unitOptions[0].value,
    observation: null,
  });

  const products = useAtomValue(productsAtom);
  const categories = useAtomValue(categoriesAtom);

  const { items } = useList(listId!);

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
        handleClearStates();
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
      toast.error("Adicione uma categoria");
      return;
    }

    if (
      !categories.some(
        (category) =>
          category.name.toLowerCase() === newItemForm.category.toLowerCase()
      )
    ) {
      toast.error("Categoria já existente");
      return;
    }

    toast.promise(addItemManual(listId, newItemForm), {
      loading: "Criando item...",
      success: () => {
        handleClearStates();
        return "Item criado e adicionado à lista!";
      },
      error: "Erro ao criar item",
    });
  }

  function handleChangeCategoryMode(mode: "select" | "create") {
    setCategoryMode(mode);
    setNewItemForm({
      ...newItemForm,
      category: "",
    });
  }

  function handleClearStates() {
    setSearchTerm("");
    setSelectedProduct(null);
    setNeededQuantity(1);
    setNewItemForm({
      name: "",
      category: "",
      neededQuantity: 1,
      unit: unitOptions[0].value,
      observation: null,
    });
  }

  function handleClose() {
    setViewMode("inventory");
    setCategoryMode("select");
    handleClearStates();
    onClose();
  }

  const filteredProducts = useMemo(() => {
    const existingItemIds = new Set(items.flatMap((item) => item.itemId));

    return products.filter(
      (product) =>
        !existingItemIds.has(product.id) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, items, searchTerm]);

  const categoryOptions = useMemo(
    () =>
      items.reduce((acc, item) => {
        const alredyExists = acc.some(
          (itemAcc) => itemAcc.value === item.category
        );

        if (!alredyExists) {
          const refferedCategory = categories.find(
            (category) => category.id === item.category
          );

          if (!refferedCategory) {
            acc.push({
              value: item.category,
              label: item.category,
            });
          } else {
            acc.push({
              value: refferedCategory.id,
              label: refferedCategory.name,
            });
          }
        }

        return acc;
      }, [] as OptionsType[]),
    [items, categories]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Adicionar Item à Lista"
      iconTitle={<ShoppingBag className="w-6 h-6" />}
    >
      <div className="space-y-4">
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

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Categoria <span className="text-red-500">*</span>
                </label>

                <div className="flex gap-1 p-0.5 bg-gray-100 rounded-md">
                  <button
                    type="button"
                    onClick={() => handleChangeCategoryMode("select")}
                    className={`flex-1 px-3 py-1.5 text-sm rounded font-medium transition-all duration-200 ${
                      categoryMode === "select"
                        ? "bg-white text-[var(--color-blue)] shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Selecionar existente
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChangeCategoryMode("create")}
                    className={`flex-1 px-3 py-1.5 text-sm rounded font-medium transition-all duration-200 ${
                      categoryMode === "create"
                        ? "bg-white text-[var(--color-blue)] shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Criar nova
                  </button>
                </div>

                <RenderWhen
                  isTrue={categoryMode === "select"}
                  elseElement={
                    <FieldForm
                      type="text"
                      value={newItemForm.category}
                      onChange={(value) =>
                        setNewItemForm({
                          ...newItemForm,
                          category: value as string,
                        })
                      }
                      placeholder="Digite o nome da nova categoria"
                      maxLength={30}
                    />
                  }
                >
                  <FieldForm
                    type="select"
                    value={newItemForm.category}
                    onChange={(value) =>
                      setNewItemForm({
                        ...newItemForm,
                        category: value as string,
                      })
                    }
                    options={categoryOptions}
                    placeholder="Selecione uma categoria"
                  />
                </RenderWhen>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FieldForm
                  type="number"
                  label="Quantidade"
                  value={newItemForm.neededQuantity}
                  onChange={(value) =>
                    setNewItemForm({
                      ...newItemForm,
                      neededQuantity: value as number,
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

              <FieldForm
                type="textarea"
                label="Observação"
                value={newItemForm.observation}
                onChange={(value) =>
                  setNewItemForm({
                    ...newItemForm,
                    observation: value as string,
                  })
                }
                placeholder="Adicione alguma observação"
              />
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
                        {getCategoryName(selectedProduct?.category || "")}
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
          <Button onClick={handleClose} className="flex-1" variant="outline">
            Cancelar
          </Button>
          <Button
            onClick={
              viewMode === "inventory" ? handleAddItem : handleAddNewItem
            }
            disabled={
              viewMode === "inventory"
                ? !selectedProduct
                : !newItemForm.name.trim() || !newItemForm.category
            }
            className="flex-1 "
          >
            {viewMode === "inventory" ? "Adicionar Item" : "Criar e Adicionar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
