/**
 * Helpers de número para quantidades.
 *
 * UI em português (vírgula), storage em formato americano (número JS com ponto).
 * Precisão de até 3 casas decimais; trailing zeros são removidos na exibição.
 */

const MAX_DECIMALS = 3;

function roundTo3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/**
 * Limpa o texto durante a digitação, mantendo a string crua editável.
 * Aceita "." como atalho para vírgula. Mantém só dígitos + 1 separador,
 * limitando a 3 casas decimais. Ex: "1.2.3ab" -> "1,23".
 */
export function sanitizeDecimalInput(input: string): string {
  if (!input) return "";

  const normalized = input.replace(/\./g, ",").replace(/[^\d,]/g, "");
  const firstComma = normalized.indexOf(",");

  if (firstComma === -1) return normalized;

  const intPart = normalized.slice(0, firstComma).replace(/,/g, "");
  const decPart = normalized
    .slice(firstComma + 1)
    .replace(/,/g, "")
    .slice(0, MAX_DECIMALS);

  return `${intPart},${decPart}`;
}

/**
 * Converte a entrada do usuário ("1,5" ou "1.5") em número US (1.5).
 * Vazio/inválido -> 0. Arredonda a 3 casas.
 */
export function parseDecimalInput(input: string): number {
  if (typeof input !== "string") return 0;

  const normalized = input.replace(/\./g, ",");
  const firstComma = normalized.indexOf(",");

  let cleaned: string;
  if (firstComma === -1) {
    cleaned = normalized.replace(/\D/g, "");
  } else {
    const intPart = normalized.slice(0, firstComma).replace(/\D/g, "");
    const decPart = normalized
      .slice(firstComma + 1)
      .replace(/\D/g, "")
      .slice(0, MAX_DECIMALS);
    cleaned = `${intPart}.${decPart}`;
  }

  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? roundTo3(n) : 0;
}

function stripTrailingZeros(fixed: string): string {
  return fixed.replace(/\.?0+$/, "");
}

/** Número US (1.5) -> string BR ("1,5"), sem trailing zeros. */
export function formatDecimalBR(value: number): string {
  if (value == null || !Number.isFinite(value)) return "0";
  const fixed = roundTo3(value).toFixed(MAX_DECIMALS);
  return stripTrailingZeros(fixed).replace(".", ",");
}

/** Número US (1.5) -> string US ("1.5"), sem trailing zeros. */
export function formatDecimalUS(value: number): string {
  if (value == null || !Number.isFinite(value)) return "0";
  const fixed = roundTo3(value).toFixed(MAX_DECIMALS);
  return stripTrailingZeros(fixed);
}
