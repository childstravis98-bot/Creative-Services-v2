import Stripe from "stripe";

export const runtime = "nodejs";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "Stripe is not configured. Add STRIPE_SECRET_KEY in Vercel."
    );
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(request) {
  try {
    const stripe = getStripe();

    const body = await request.json();

    const style = String(
      body?.style || "Custom E-Bike Design"
    ).slice(0, 120);

    const origin = new URL(request.url).origin;

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: [
          {
            price_data: {
              currency: "usd",

              product_data: {
                name:
                  "Beach House Creatives — Full E-Bike Design",

                description:
                  `${style} custom AI e-bike design`,
              },

              unit_amount: 1000,
            },

            quantity: 1,
          },
        ],

        success_url:
          `${origin}/studio?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/studio?checkout=cancelled`,

        metadata: {
          product: "ebike-design",
        },
      });

    return Response.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Stripe checkout error:",
      error
    );

    return Response.json(
      {
        error:
          error?.message ||
          "Could not start checkout.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const stripe = getStripe();

    const sessionId =
      new URL(request.url).searchParams.get(
        "session_id"
      );

    if (!sessionId) {
      return Response.json(
        {
          error:
            "Missing checkout session.",
        },
        {
          status: 400,
        }
      );
    }

    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId
      );

    const paid =
      session.payment_status === "paid" &&
      session.amount_total === 1000 &&
      session.currency === "usd" &&
      session.metadata?.product ===
        "ebike-design";

    if (!paid) {
      return Response.json(
        {
          error:
            "Payment has not been confirmed.",
        },
        {
          status: 402,
        }
      );
    }

    return Response.json({
      paid: true,

      customerEmail:
        session.customer_details?.email || "",
    });
  } catch (error) {
    console.error(
      "Stripe verification error:",
      error
    );

    return Response.json(
      {
        error:
          error?.message ||
          "Could not verify payment.",
      },
      {
        status: 500,
      }
    );
  }
}
