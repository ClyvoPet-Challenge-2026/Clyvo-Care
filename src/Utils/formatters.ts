export function formatCpf(text: string) {
  const cleaned = text.replace(/\D/g, "").slice(0, 11);
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
}

export function formatPhone(text: string) {
  const cleaned = text.replace(/\D/g, "").slice(0, 11);
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  const prefixEnd = cleaned.length === 11 ? 7 : 6;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, prefixEnd)}-${cleaned.slice(prefixEnd)}`;
}
