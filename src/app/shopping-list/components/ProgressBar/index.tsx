export default function ProgressBar({
  progressPercentage,
  completedCount,
  totalCount,
}: {
  progressPercentage: number;
  completedCount: number;
  totalCount: number;
}) {
  return (
    <div className="bg-gray-100 rounded-xl p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-center font-semibold">Progresso da compra</h2>
        <div className="text-right">
          <div className="text-lg font-bold">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-xs opacity-75">
            {completedCount} of {totalCount}
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-amber-500 h-full transition-all duration-500 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>
        {progressPercentage > 0 && (
          <div
            className="absolute top-0 h-3 w-1 bg-amber-300 rounded-full transition-all duration-500"
            style={{ left: `${Math.max(progressPercentage - 1, 0)}%` }}
          ></div>
        )}
      </div>
      {progressPercentage === 100 && (
        <div className="mt-2 text-center">
          <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full font-medium">
            🎉 All Done!
          </span>
        </div>
      )}
    </div>
  );
}
