import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: "Reserva de Alojamiento",
              description: "Pago de reserva en Airbnb Clone",
            },
            unit_amount: 19900, // $199.00 MXN (Stripe usa centavos)
          },
          quantity: 1,
        },
      ],
      // Redireccion
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pago-exitoso`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pago-cancelado`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}