export function isActive(path: string, pathname: string) {
  return pathname === path
    ? "text-blue hover:text-blue"
    : "text-gray-500 hover:text-gray-700";
}
