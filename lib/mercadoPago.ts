import { MercadoPagoConfig, Preference } from "mercadopago";

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (!accessToken) {
  // Allowed in build/dev; endpoints handle missing token with explicit errors.
  console.warn("MERCADO_PAGO_ACCESS_TOKEN is not configured.");
}

const client = new MercadoPagoConfig({
  accessToken: accessToken ?? "missing_token"
});

export const preferenceClient = new Preference(client);
