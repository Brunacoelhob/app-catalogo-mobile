/** Valor em dólar com vírgula decimal (a API DummyJSON usa USD). Ex.: 12.5 → "US$ 12,50". */
export function formatarPreco(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return '—';
  return `US$ ${numero.toFixed(2).replace('.', ',')}`;
}

/** Preço depois do desconto, arredondado para centavos. Percentual inválido ou fora de 0–100 é ignorado. */
export function precoComDesconto(preco, percentual) {
  const base = Number(preco);
  const desconto = Number(percentual);
  if (!Number.isFinite(base)) return NaN;
  if (!Number.isFinite(desconto) || desconto <= 0 || desconto > 100) return base;
  return Math.round(base * (100 - desconto)) / 100;
}

export function formatarPercentual(percentual) {
  const numero = Number(percentual);
  return Number.isFinite(numero) && numero > 0 ? `${Math.round(numero)}% OFF` : '';
}
