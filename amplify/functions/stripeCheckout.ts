import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment variables.");
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const handler = async (event: { httpMethod: string; body?: string }) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    if (!event.body) {
      return { statusCode: 400, body: "Missing request body" };
    }

    const { price, listingId } = JSON.parse(event.body) as { price: number; listingId: string };

    if (!price || !listingId) {
      return { statusCode: 400, body: "Missing required fields" };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Energy Listing #${listingId}` },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `https://your-app-url.com/success?listingId=${listingId}`,
      cancel_url: `https://your-app-url.com/cancel`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating Stripe session:", errMsg);
    return { statusCode: 500, body: JSON.stringify({ error: errMsg }) };
  }
};
