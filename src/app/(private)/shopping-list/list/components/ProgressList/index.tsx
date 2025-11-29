export default function ProgressList({
  checkedCount,
  totalCount,
  progressPercentage,
}: {
  checkedCount: number;
  totalCount: number;
  progressPercentage: number;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text-dark)]">
            Progresso da Lista
          </h3>
          <p className="text-sm text-[var(--color-text-gray)]">
            {checkedCount} de {totalCount} itens marcados
          </p>
        </div>
        <div className="text-3xl font-bold text-[var(--color-blue)]">
          {progressPercentage.toFixed(0)}%
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-[var(--color-blue)] h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
