"use client";
import { useState } from "react";
import FeedbackItem from "./components/FeedbackItem";
import FeedbackFormPopup from "./components/FeedbackFormPopup";
import Button from "./components/Button";
import FeedbackItemPopup from "./components/FeedbackItemPopup";

export default function Home() {
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState(null);

  function openFeedbackPopupForm() {
    setShowFeedbackPopupForm(true);
  }

  function openFeedbackPopupItem(feedback) {
    setShowFeedbackPopupItem(feedback);
  }

  const feedbacks = [
    {
      title: "Create more projects",
      description: "I would like to see more projects in github",
      votesCount: 80,
    },
    {
      title: "Create more projects 2",
      description: "I would like to see more projects in github 2",
      votesCount: 112,
    },
  ];

  return (
    <main className="bg-white max-w-2xl mx-auto shadow-lg md:rounded-lg md:mt-8 overflow-hidden">
      <div className="p-8 bg-gradient-to-r from-cyan-400 to-blue-400">
        <h1 className="font-bold text-xl">Feedback Board</h1>
        <p className="text-opacity-90 text-slate-700">
          Help me decide what should I build next or improve.
        </p>
      </div>
      <div className="bg-gray-100 px-8 py-4 flex border-b">
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
