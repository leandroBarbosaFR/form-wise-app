export function getInitials(name: string, surname: string) {
  return `${name[0] ?? ""}${surname[0] ?? ""}`.toUpperCase();
}
