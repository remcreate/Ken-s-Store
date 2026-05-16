import { NextRequest, NextResponse } from "next/server";

type CheckoutItem = {
  name: string;
  amount: number;
  quantity: number;
};

const paymentMethodMap = {
  gcash: "gcash",
  maya: "paymaya",
  card: "card",
} as const;

export async function POST(request: NextRequest) {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      {
        error:
          "PayMongo is not configured. Add PAYMONGO_SECRET_KEY to your environment variables.",
      },
      { status: 500 }
    );
  }

  const body = await request.json();
  const items = Array.isArray(body.items) ? (body.items as CheckoutItem[]) : [];
  const shippingFee = Number(body.shippingFee || 0);
  const paymentMethod =
    paymentMethodMap[body.paymentMethod as keyof typeof paymentMethodMap];

  if (!items.length || !paymentMethod) {
    return NextResponse.json(
      { error: "Missing checkout items or payment method." },
      { status: 400 }
    );
  }

  const origin = request.nextUrl.origin;
  const lineItems = [
    ...items.map((item) => ({
      name: item.name,
      amount: Math.round(Number(item.amount) * 100),
      currency: "PHP",
      quantity: Math.max(1, Math.round(Number(item.quantity))),
    })),
    {
      name: "Standard Shipping",
      amount: Math.round(shippingFee * 100),
      currency: "PHP",
      quantity: 1,
    },
  ];

  const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          billing: {
            name: body.customer?.name,
            email: body.customer?.email,
            phone: body.customer?.phone,
            address: {
              line1: body.customer?.address,
              country: "PH",
            },
          },
          cancel_url: `${origin}/checkout/cancel`,
          description: `Order ${body.orderId || ""}`.trim(),
          line_items: lineItems,
          metadata: {
            order_id: body.orderId || "",
          },
          payment_method_types: [paymentMethod],
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          success_url: `${origin}/checkout/success`,
        },
      },
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      {
        error:
          payload.errors?.[0]?.detail ||
          payload.errors?.[0]?.code ||
          "PayMongo checkout failed.",
      },
      { status: response.status }
    );
  }

  return NextResponse.json({
    checkoutUrl: payload.data?.attributes?.checkout_url,
    sessionId: payload.data?.id,
  });
}
