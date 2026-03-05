export default function MockupProductForm() {
  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do item *
        </label>
        <input
          type="text"
          placeholder="Digite o nome do produto"
          value="Leite Integral"
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Unidade *
        </label>
        <select
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
        >
          <option>Litro (L)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status da compra *
        </label>
        <select
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
        >
          <option>Precisa comprar</option>
        </select>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button
          disabled
          className="w-full px-6 py-3 bg-blue text-white rounded-xl text-lg font-medium cursor-not-allowed opacity-60"
        >
          Adicionar Produto
        </button>
      </div>
    </div>
  );
}
