import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST() {
  try {
    // List existing products
    const products = await stripe.products.list({ limit: 5 });
    
    let product;
    if (products.data.length > 0) {
      product = products.data[0];
    } else {
      // Create a product if none exists
      product = await stripe.products.create({
        name: "ListaAi Premium",
        description: "Assinatura Premium do ListaAi",
      });
    }

    // Create a recurring price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2000, // R$ 20.00 in cents
      currency: "brl",
      recurring: {
        interval: "month",
      },
    });

    return NextResponse.json({
      success: true,
      price: {
        id: price.id,
        amount: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval,
        product: product.id,
        productName: product.name,
        livemode: price.livemode,
      },
    });
  } catch (error: any) {
    console.error("Error creating price:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
