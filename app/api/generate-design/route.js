import OpenAI, { toFile } from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const image = formData.get("image");
    const style = formData.get("style");
    const description = formData.get("description") || "";

    if (!image || typeof image === "string") {
      return Response.json(
        { error: "Please upload an e-bike image." },
        { status: 400 }
      );
    }

    if (!style) {
      return Response.json(
        { error: "Please choose a design style." },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return Response.json(
        { error: "The uploaded file must be an image." },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer());

    const uploadedImage = await toFile(
      imageBuffer,
      image.name || "ebike.png",
      {
        type: image.type || "image/png",
      }
    );

    const prompt = `
Edit the uploaded photograph into a professional custom e-bike paint concept.

Preserve:
- The exact e-bike model and frame geometry
- The wheels, tires, motor, battery, seat, handlebars and components
- The original camera angle and overall background
- A realistic photographic appearance

Change only:
- The frame paint
- Decorative graphics
- Color accents
- Appropriate branding-style details

Selected design style: ${style}

Customer request:
${description || "Create a clean premium custom paint design."}

The result must look like the same real e-bike after receiving a professional custom paint job.
Do not change the bicycle into a different model.
Do not add extra wheels, frames, handlebars or components.
Do not include readable brand names, logos or watermarks.
`;

    const result = await openai.images.edit({
      model: "gpt-image-2",
      image: uploadedImage,
      prompt,
      size: "1024x1024",
      quality: "medium",
      input_fidelity: "high",
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      return Response.json(
        { error: "OpenAI did not return a generated image." },
        { status: 502 }
      );
    }

    return Response.json({
      image: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error("AI design generation failed:", error);

    return Response.json(
      {
        error:
          error?.message ||
          "The AI design could not be generated. Please try again.",
      },
      { status: 500 }
    );
  }
}
