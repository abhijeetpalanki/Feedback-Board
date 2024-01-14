"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import FeedbackItem from "./FeedbackItem";
import FeedbackFormPopup from "./FeedbackFormPopup";
import Button from "./Button";
import FeedbackItemPopup from "./FeedbackItemPopup";
import axios from "axios";

export default function Board() {
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [votes, setVotes] = useState([]);
  const [votesLoading, setVotesLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    fetchVotes();
  }, [feedbacks]);

  useEffect(() => {
    if (session?.user?.email) {
      const feedbackToVote = localStorage.getItem("vote_after_login");
      if (feedbackToVote) {
        axios.post("/api/vote", { feedbackId: feedbackToVote }).then(() => {
          localStorage.removeItem("vote_after_login");
          fetchVotes();
        });
      }
      const feedbackToPost = localStorage.getItem("post_after_login");
      if (feedbackToPost) {
        const feedbackData = JSON.parse(feedbackToPost);
        axios.post("/api/feedback", feedbackData).then(async (res) => {
          await fetchFeedbacks();
          setShowFeedbackPopupItem(res.data);
          localStorage.removeItem("post_after_login");
        });
      }
      const commentToPost = localStorage.getItem("comment_after_login");
      if (commentToPost) {
        const commentData = JSON.parse(commentToPost);
        axios.post("/api/comment", commentData).then(async () => {
          axios
            .get("/api/feedback?id=" + commentData.feedbackId)
            .then((res) => {
              setShowFeedbackPopupItem(res.data);
              localStorage.removeItem("comment_after_login");
            });
        });
      }
    }
  }, [session?.user?.email]);

  async function fetchFeedbacks() {
    axios.get("/api/feedback").then((res) => {
      setFeedbacks(res.data);
    });
  }

  async function fetchVotes() {
    setVotesLoading(true);
    const ids = feedbacks.map((f) => f._id);
    const res = await axios.get("/api/vote?feedbackIds=" + ids.join(","));
    setVotes(res.data);
    setVotesLoading(false);
  }

  function openFeedbackPopupForm() {
    setShowFeedbackPopupForm(true);
  }

  function openFeedbackPopupItem(feedback) {
    setShowFeedbackPopupItem(feedback);
  }

  return (
    <main className="max-w-2xl mx-auto overflow-hidden bg-white shadow-lg md:rounded-lg md:mt-8">
      <div className="p-8 bg-gradient-to-r from-cyan-400 to-blue-400">
        <h1 className="text-xl font-bold">Feedback Board</h1>
        <p className="text-opacity-90 text-slate-700">
          Help me decide what should I build next or improve.
        </p>
      </div>
      <div className="flex px-8 py-4 bg-gray-100 border-b">
        <div className="grow"></div>
        <div className="">
          <Button primary="true" onClick={openFeedbackPopupForm}>
            Make a suggestion!
          </Button>
        </div>
      </div>
      <div className="px-8">
        {feedbacks.map((feedback, idx) => (
          <FeedbackItem
            {...feedback}
            onVotesChange={fetchVotes}
            votes={votes.filter(
              (v) => v.feedbackId.toString() === feedback._id.toString()
            )}
            onOpen={() => openFeedbackPopupItem(feedback)}
            isParentLoadingVotes={votesLoading}
            key={idx}
          />
        ))}
      </div>
      {showFeedbackPopupForm && (
        <FeedbackFormPopup
          setShow={setShowFeedbackPopupForm}
          onFeedbackCreate={fetchFeedbacks}
        />
      )}
      {showFeedbackPopupItem && (
        <FeedbackItemPopup
          {...showFeedbackPopupItem}
          setShow={setShowFeedbackPopupItem}
          onVotesChange={fetchVotes}
          votes={votes.filter(
            (v) =>
              v.feedbackId.toString() === showFeedbackPopupItem._id.toString()
          )}
        />
      )}
    </main>
  );
}
