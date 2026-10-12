import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

        if (!token || token.trim() === "") {
            return NextResponse.json(
                { status: 400 }
            );
        }

        const client = new MercadoPagoConfig({ accessToken: token });
        const body = await request.json().catch(() => ({}));
        const { title = "Reserva de Alojamiento", price = 100 } = body;

        const preference = new Preference(client);

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const respuesta = await preference.create({
            body: {
                items: [
                    {
                        id: "reserva-propiedad",
                        title: String(title),
                        quantity: 1,
                        currency_id: "MXN",
                        unit_price: Number(price),
                    },
                ],
                backUrls: {
                    success: `${baseUrl}/pago-exitoso`,
                    failure: `${baseUrl}/pago-cancelado`,
                    pending: `${baseUrl}/pago-cancelado`,
                },
                autoReturn: "approved",
            },
        });

        return NextResponse.json({ url: respuesta.init_point });s
    } catch (error: any) {
        console.error("Error Mercado Pago API:", error);
        return NextResponse.json(
            { error: error?.message || "Error al procesar el pago con Mercado Pago" },
            { status: 500 }
        );
    }
}