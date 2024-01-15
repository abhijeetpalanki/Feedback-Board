import { Comment } from "@/app/models/Comment";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  const mongoUrl = process.env.DB_URL;
  mongoose.connect(mongoUrl);
  const url = new URL(request.url);
  if (url.searchParams.get("feedbackId")) {
    const result = await Comment.find({
      feedbackId: url.searchParams.get("feedbackId"),
    }).populate("user");

    return Response.json(result);
  }
  return Response.json([]);
}

export async function POST(request) {
  const jsonBody = await request.json();
  const { text, uploads, feedbackId } = jsonBody;

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mongoUrl = process.env.DB_URL;
  mongoose.connect(mongoUrl);
  const commentDoc = await Comment.create({
    text,
    uploads,
    userEmail: session.user.email,
    feedbackId,
  });

  return Response.json(commentDoc);
}

export async function PUT(request) {
  const mongoUrl = process.env.DB_URL;
  mongoose.connect(mongoUrl);

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jsonBody = await request.json();
  const { id, text, uploads } = jsonBody;
  const commentDoc = await Comment.findOneAndUpdate(
    { _id: id, userEmail: session.user.email },
    { text, uploads }
  );

  return Response.json(commentDoc);
}
