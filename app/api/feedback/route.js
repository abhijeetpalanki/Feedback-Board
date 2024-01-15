import { Feedback } from "@/app/models/Feedback";
import { Comment } from "@/app/models/Comment";
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
    const loadedRows = url.searchParams.get("loadedRows");
    const searchTerm = url.searchParams.get("search");

    const sortParam = url.searchParams.get("sort");
    let sortDef;
    if (sortParam === "latest") {
      sortDef = { createdAt: -1 };
    }
    if (sortParam === "oldest") {
      sortDef = { createdAt: 1 };
    }
    if (sortParam === "votes") {
      sortDef = { votesCountCached: -1 };
    }

    let filter = null;
    if (searchTerm) {
      const comments = await Comment.find(
        { text: { $regex: ".*" + searchTerm + ".*" } },
        "feedbackId",
        {
          limit: 20,
        }
      );
      filter = {
        $or: [
          { title: { $regex: ".*" + searchTerm + ".*" } },
          { description: { $regex: ".*" + searchTerm + ".*" } },
          { _id: { $in: comments.map((comment) => comment.feedbackId) } },
        ],
      };
    }

    return Response.json(
      await Feedback.find(filter, null, {
        sort: sortDef,
        skip: loadedRows,
        limit: 10,
      }).populate("user")
    );
  }
}

export async function POST(request) {
  const jsonBody = await request.json();
  const { title, description, uploads } = jsonBody;

  const mongoUrl = process.env.DB_URL;
  mongoose.connect(mongoUrl);

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;
  const feedbackDoc = await Feedback.create({
    title,
    description,
    uploads,
    userEmail,
  });

  return Response.json(feedbackDoc);
}

export async function PUT(request) {
  const jsonBody = await request.json();
  const { id, title, description, uploads } = jsonBody;

  const mongoUrl = process.env.DB_URL;
  mongoose.connect(mongoUrl);

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const newFeedbackDoc = await Feedback.updateOne(
    { _id: id, userEmail: session.user.email },
    {
      title,
      description,
      uploads,
    }
  );

  return Response.json(newFeedbackDoc);
}
