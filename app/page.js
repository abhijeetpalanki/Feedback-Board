"use client";
import { useState } from "react";
import FeedbackItem from "./components/FeedbackItem";
import FeedbackFormPopup from "./components/FeedbackFormPopup";
import Button from "./components/Button";

export default function Home() {
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  function openFeedbackPopup() {
    setShowFeedbackPopup(true);
  }

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
          <Button primary onClick={openFeedbackPopup}>
            Make a suggestion!
          </Button>
        </div>
      </div>
      <div className="px-8">
        <FeedbackItem />
        <FeedbackItem />
        <FeedbackItem />
        <FeedbackItem />
      </div>
      {showFeedbackPopup && (
        <FeedbackFormPopup setShow={setShowFeedbackPopup} />
      )}
    </main>
  );
}
