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

    return Response.json(
      result.map((doc) => {
        const { userEmail, ...commentWithoutEmail } = doc.toJSON();
        console.log(commentWithoutEmail);
        const { email, ...userWithoutEmail } = commentWithoutEmail.user;
        commentWithoutEmail.user = userWithoutEmail;
        return commentWithoutEmail;
      })
    );
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
