import { Feedback } from "@/app/models/Feedback";
import mongoose from "mongoose";

export async function GET() {
  return Response.json(await Feedback.find());
}

export async function POST(request) {
  const jsonBody = await request.json();
  const { title, description, uploads } = jsonBody;

  const mongoUrl = process.env.DB_URL;
  mongoose.connect(mongoUrl);
  await Feedback.create({ title, description, uploads });

  return Response.json(jsonBody);
}
