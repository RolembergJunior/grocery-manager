export default function MockupCategoryModal() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome da Categoria *
        </label>
        <input
          type="text"
          placeholder="Digite o nome da categoria"
          value="Frutas"
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cor da Categoria *
        </label>
        <select
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
        >
          <option>🟠 Laranja</option>
        </select>
      </div>
    </div>
  );
}
