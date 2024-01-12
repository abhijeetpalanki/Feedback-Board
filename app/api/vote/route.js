import { authOptions } from "../auth/[...nextauth]/route";
import { Vote } from "@/app/models/Vote";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function GET(request) {
  const url = new URL(request.url);
  if (url.searchParams.get("feedbackIds")) {
    const feedbackIds = url.searchParams.get("feedbackIds").split(",");
    const voteDocs = await Vote.find({ feedbackId: feedbackIds });

    return Response.json(voteDocs);
  }

  return Response.json([]);
}

export async function POST(request) {
  const mongoUrl = process.env.DB_URL;
  mongoose.connect(mongoUrl);

  const jsonBody = await request.json();
  const { feedbackId } = jsonBody;
  const session = await getServerSession(authOptions);
  const { email: userEmail } = session.user;

  const existingVote = await Vote.findOne({ userEmail, feedbackId });
  if (existingVote) {
    await Vote.findByIdAndDelete(existingVote._id);
    return Response.json(existingVote);
  } else {
    const voteDoc = await Vote.create({ userEmail, feedbackId });
    return Response.json(voteDoc);
  }
}
