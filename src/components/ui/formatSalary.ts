export function formatSalary(v: string | number): string {
  return v ? Number(v).toLocaleString('en-US') : '';
}
