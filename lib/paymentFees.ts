export type PaymentMethod = "gcash" | "maya" | "card";

// PayMongo fee rules (based on your data)
export const calculatePaymentFee = (
  amount: number,
  method: PaymentMethod
): number => {
  let fee = 0;

  switch (method) {
    // QR wallets (GCash / Maya / QRPH)
    case "gcash":
    case "maya":
      fee = amount * 0.0137;
      break;

    // Cards (Visa / Mastercard)
    case "card":
      fee = amount * 0.03125 + 13.39;
      break;

    default:
      fee = 0;
  }

  return Math.round(fee * 100) / 100; // round to 2 decimals
};