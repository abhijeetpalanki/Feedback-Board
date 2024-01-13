import axios from "axios";
import Button from "./Button";
import FeedbackItemPopupComments from "./FeedbackItemPopupComments";
import Popup from "./Popup";
import { useState } from "react";
import { RingLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import TickIcon from "./icons/TickIcon";
import Attachment from "./Attachment";

export default function FeedbackItemPopup({
  _id,
  title,
  description,
  votes,
  uploads,
  setShow,
  onVotesChange,
}) {
  const { data: session } = useSession();
  const [isVotesLoading, setIsVotesLoading] = useState(false);
  const iVoted = votes?.find((v) => v.userEmail === session?.user?.email);

  function handleVoteButtonClick() {
    setIsVotesLoading(true);
    axios.post("/api/vote", { feedbackId: _id }).then(async (res) => {
      await onVotesChange();
      setIsVotesLoading(false);
    });
  }

  return (
    <Popup setShow={setShow} heading={""}>
      <div className="p-8 pb-2">
        <h2 className="mb-2 text-lg font-bold">{title}</h2>
        <p className="text-gray-600">{description}</p>
        {uploads?.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-gray-600">Attachments:</span>
            <div className="flex gap-2">
              {uploads.map((link, i) => (
                <Attachment key={i} link={link} i={i} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end px-8 py-2 border-b">
        <Button primary="true" onClick={handleVoteButtonClick}>
          {isVotesLoading && <RingLoader size={18} />}
          {!isVotesLoading && (
            <>
              {iVoted && (
                <>
                  <TickIcon className="w-4 h-4" />
                  Upvoted {votes?.length || 0}
                </>
              )}
              {!iVoted && (
                <>
                  <span className="traingle-vote-up"></span>
                  Upvote {votes?.length || 0}
                </>
              )}
            </>
          )}
        </Button>
      </div>
      <div className="">
        <FeedbackItemPopupComments />
      </div>
    </Popup>
  );
}
