import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: "Session ID is required." });
    }

    try {
      // Retrieve the session details
      const session = await stripe.checkout.sessions.retrieve(session_id);

      // Retrieve line items for the session
      const lineItems = await stripe.checkout.sessions.listLineItems(session_id);

      res.status(200).json({
        session,
        lineItems: lineItems.data, // Include line items in the response
      });
    } catch (error) {
      console.error("Error retrieving session or line items:", error);
      res.status(500).json({ error: "Failed to retrieve session details." });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
}
