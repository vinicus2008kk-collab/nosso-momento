export function isMercadoPagoConfigured(): boolean {
  return Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim());
}
