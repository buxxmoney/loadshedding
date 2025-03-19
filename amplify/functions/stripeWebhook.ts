import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing Stripe environment variables.");
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const handler = async (event: { headers: { [key: string]: string }; body?: string }) => {
  if (!event.body) {
    return { statusCode: 400, body: "Missing request body" };
  }

  let stripeEvent: Stripe.Event;

  try {
    const signature = event.headers["stripe-signature"];
    if (!signature) {
      throw new Error("Missing Stripe signature header.");
    }

    stripeEvent = stripe.webhooks.constructEvent(event.body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("⚠️ Webhook signature verification failed:", errMsg);
    return { statusCode: 400, body: `Webhook Error: ${errMsg}` };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;
    const listingId = session.metadata?.listingId;

    if (!listingId) {
      console.error("❌ Webhook error: listingId is missing.");
      return { statusCode: 400, body: "Missing listingId in metadata" };
    }

    console.log(`✅ [Webhook] Listing ${listingId} would be marked as purchased.`);
  }

  return { statusCode: 200, body: "Success" };
};
