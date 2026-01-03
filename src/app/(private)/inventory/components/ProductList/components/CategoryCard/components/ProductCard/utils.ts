export function getStatusClassName(status: string): string {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold min-w-fit";

  switch (status) {
    case "needs-shopping":
      return `${baseClasses} bg-gradient-to-r from-red-400 to-red-500 text-white`;
    case "almost-empty":
      return `${baseClasses} bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-800`;
    default:
      return `${baseClasses} bg-gradient-to-r from-blue-300 to-blue-400 text-white`;
  }
}
