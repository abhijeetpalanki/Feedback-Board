"use client";
import { useState } from "react";
import Popup from "./Popup";
import Button from "./Button";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { RingLoader } from "react-spinners";

export default function FeedbackItem({
  _id,
  title,
  description,
  votes,
  onOpen,
  onVotesChange,
  isParentLoadingVotes = true,
}) {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.email;

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isVotesLoading, setIsVotesLoading] = useState(false);

  function handleVoteButtonClick(e) {
    e.stopPropagation();
    e.preventDefault();

    if (!isLoggedIn) {
      localStorage.setItem("vote_after_login", _id);
      setShowLoginPopup(true);
    } else {
      setIsVotesLoading(true);
      axios.post("/api/vote", { feedbackId: _id }).then(async () => {
        await onVotesChange();
        setIsVotesLoading(false);
      });
    }
  }

  async function handleGoogleLoginButtonClick(e) {
    e.stopPropagation();
    e.preventDefault();

    await signIn("google");
  }

  const iVoted = votes?.find((v) => v.userEmail === session?.user?.email);

  return (
    <a
      href=""
      onClick={(e) => {
        e.preventDefault();
        onOpen();
      }}
      className="flex items-center gap-8 my-8"
    >
      <div className="flex-grow">
        <h2 className="font-bold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="">
        {showLoginPopup && (
          <Popup
            narrow="true"
            heading={"Confirm your vote?"}
            setShow={setShowLoginPopup}
          >
            <div className="p-4">
              <Button onClick={handleGoogleLoginButtonClick} primary="true">
                Login with Google
              </Button>
            </div>
          </Popup>
        )}
        <Button
          primary={iVoted}
          onClick={handleVoteButtonClick}
          className="border shadow-sm"
        >
          {!isVotesLoading && (
            <>
              <span className="traingle-vote-up"></span>
              {votes?.length || 0}
            </>
          )}
          {isVotesLoading && <RingLoader size={18} />}
        </Button>
      </div>
    </a>
  );
}
