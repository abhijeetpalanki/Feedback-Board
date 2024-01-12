"use client";
import { useEffect, useState } from "react";
import FeedbackItem from "./components/FeedbackItem";
import FeedbackFormPopup from "./components/FeedbackFormPopup";
import Button from "./components/Button";
import FeedbackItemPopup from "./components/FeedbackItemPopup";
import axios from "axios";

export default function Home() {
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get("/api/feedback").then((res) => {
      setFeedbacks(res.data);
    });
  }, []);

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
          <Button primary={"true"} onClick={openFeedbackPopupForm}>
            Make a suggestion!
          </Button>
        </div>
      </div>
      <div className="px-8">
        {feedbacks.map((feedback, idx) => (
          <FeedbackItem
            {...feedback}
            onOpen={() => openFeedbackPopupItem(feedback)}
            key={idx}
          />
        ))}
      </div>
      {showFeedbackPopupForm && (
        <FeedbackFormPopup setShow={setShowFeedbackPopupForm} />
      )}
      {showFeedbackPopupItem && (
        <FeedbackItemPopup
          {...showFeedbackPopupItem}
          setShow={setShowFeedbackPopupItem}
        />
      )}
    </main>
  );
}
