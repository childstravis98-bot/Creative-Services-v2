import nodemailer from "nodemailer";
import twilio from "twilio";

const shops = [
  { name: "Ventura Custom Paint", email: "shop@example.com", phone: "+15555555555", lat: 34.2746, lng: -119.2290 },
  { name: "LA Moto Finish", email: "shop@example.com", phone: "+15555555555", lat: 34.0522, lng: -118.2437 }
];

function nearestShop(userLat, userLng) {
  if (!userLat || !userLng) return shops[0];
  return shops.reduce((best, shop) => {
    const shopDistance = Math.abs(userLat - shop.lat) + Math.abs(userLng - shop.lng);
    const bestDistance = Math.abs(userLat - best.lat) + Math.abs(userLng - best.lng);
    return shopDistance < bestDistance ? shop : best;
  }, shops[0]);
}

export async function POST(req) {
  const { image, prompt, userEmail, userLat, userLng } = await req.json();
  const shop = nearestShop(userLat, userLng);

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: shop.email,
      subject: "New Beach House Creatives Paint Lead",
      html: `<h2>New Paint Job Lead</h2><p>Customer: ${userEmail || "Not provided"}</p><p>Prompt: ${prompt}</p><p>Design: ${image}</p>`
    });

    if (userEmail) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Your e-bike design was sent",
        html: `<h2>Your design was sent to ${shop.name}</h2><p>A partner shop can contact you soon.</p>`
      });
    }
  }

  if (process.env.TWILIO_SID && process.env.TWILIO_AUTH && process.env.TWILIO_PHONE) {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
    await client.messages.create({
      body: `New Beach House Creatives paint lead from ${userEmail || "customer"}.`,
      from: process.env.TWILIO_PHONE,
      to: shop.phone
    });
  }

  return Response.json({ success: true, shop });
}