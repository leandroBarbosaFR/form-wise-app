export function generateSchoolCode(name: string): string {
  const cleaned = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

  const prefix = cleaned.slice(0, 3) || "eco";
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${random}`;
}
