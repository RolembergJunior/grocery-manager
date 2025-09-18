export function isActive(path: string, pathname: string) {
  return pathname === path
    ? "text-primary-orange hover:text-primary-orange"
    : "text-gray-500 hover:text-gray-700";
}
