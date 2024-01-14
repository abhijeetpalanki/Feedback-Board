import { Feedback } from "@/app/models/Feedback";
import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(request) {
  const mongoUrl = process.env.DB_URL;
  mongoose.connect(mongoUrl);

  const url = new URL(request.url);
  if (url.searchParams.get("id")) {
    return Response.json(await Feedback.findById(url.searchParams.get("id")));
  } else {
    return Response.json(await Feedback.find());
  }
}

export async function POST(request) {
  const jsonBody = await request.json();
  const { title, description, uploads } = jsonBody;

  const mongoUrl = process.env.DB_URL;
  mongoose.connect(mongoUrl);

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const feedbackDoc = await Feedback.create({
    title,
    description,
    uploads,
    userEmail,
  });

  return Response.json(feedbackDoc);
}
