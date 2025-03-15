import Stripe from "stripe";

// ✅ Load Stripe Secret Key (use environment variables in production)
const STRIPE_SECRET_KEY = 'sk_test_51R1i0dJCKwEQ6buBmFCsLDGkInJoKRNALUKcc0KsaUzJqiS694geTgVItlP9Hmgvg61LyVV49mogqRKRKRV8UOiI007HsYAgyo';

if (!STRIPE_SECRET_KEY) {
  throw new Error("❌ Missing STRIPE_SECRET_KEY in environment variables.");
}

console.log("🔑 Stripe API Key Loaded:", STRIPE_SECRET_KEY ? "Yes" : "No");

const stripe = new Stripe(STRIPE_SECRET_KEY);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const handler = async (event: { httpMethod: string; body?: string }) => {
  console.log("🔍 HTTP Method Received:", event.httpMethod);
  console.log("🔍 Request Body:", event.body);

  // ✅ Handle CORS Preflight Requests
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    if (!event.body) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing request body" }) };
    }

    const { price, listingId } = JSON.parse(event.body) as { price: number; listingId: string };

    if (!price || !listingId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    // ✅ Ensure price is in cents (Stripe requires amounts in cents)
    const priceInCents = Math.round(price * 100);

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Energy Listing #${listingId}` },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:5173/success?listingId=${listingId}`,
      cancel_url: `https://your-app-url.com/cancel`,
    });

    console.log("✅ Stripe Session Created:", session);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ id: session.id, url: session.url }),
    };

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error creating Stripe session:", errMsg);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: errMsg }),
    };
  }
};
