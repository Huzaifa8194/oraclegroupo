import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === "POST") {
      try {
        const { cartItems, email, billingDetails } = req.body;
  
        const lineItems = cartItems.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: [item.imageUrl],
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        }));
  
       
  
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card", "us_bank_account"],
          mode: "payment",
          line_items: lineItems,
          customer_email: email,
          success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/cancel`,
          metadata: { ...billingDetails }, // Include billing details as metadata
        });
  
        res.status(200).json({ id: session.id });
      } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  }
  