import axios from "axios";
import Button from "./Button";
import FeedbackItemPopupComments from "./FeedbackItemPopupComments";
import Popup from "./Popup";
import { useState } from "react";
import { RingLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import TickIcon from "./icons/TickIcon";
import Attachment from "./Attachment";
import EditIcon from "./icons/EditIcon";
import AttachFilesButton from "./AttachFilesButton";
import TrashIcon from "./icons/TrashIcon";

export default function FeedbackItemPopup({
  _id,
  title,
  description,
  votes,
  uploads,
  user,
  setShow,
  onVotesChange,
  onUpdate,
}) {
  const { data: session } = useSession();
  const [isVotesLoading, setIsVotesLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newUploads, setNewUploads] = useState(uploads);

  const iVoted = votes?.find((v) => v.userEmail === session?.user?.email);

  function handleVoteButtonClick() {
    setIsVotesLoading(true);
    axios.post("/api/vote", { feedbackId: _id }).then(async (res) => {
      await onVotesChange();
      setIsVotesLoading(false);
    });
  }

  function handleEditButtonClick() {
    setIsEditMode(true);
  }

  function handleRemoveAttachmentButtonClick(e, linkToRemove) {
    e.preventDefault();
    setNewUploads((prev) => prev.filter((l) => l !== linkToRemove));
  }

  function handleCancelButtonClick() {
    setIsEditMode(false);
    setNewTitle(title);
    setNewDescription(description);
    setNewUploads(uploads);
  }

  function handleNewUploads(newLinks) {
    setNewUploads((prev) => [...prev, ...newLinks]);
  }

  function handleSaveButtonClick() {
    setIsEditMode(false);
    axios
      .put("/api/feedback", {
        id: _id,
        title: newTitle,
        description: newDescription,
        uploads: newUploads,
      })
      .then(() => {
        onUpdate({
          title: newTitle,
          description: newDescription,
          uploads: newUploads,
        });
      });
  }

  return (
    <Popup setShow={setShow} heading={""}>
      <div className="p-8 pb-2">
        {isEditMode && (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="block w-full p-2 mb-2 border rounded-md"
          />
        )}
        {!isEditMode && <h2 className="mb-2 text-lg font-bold">{title}</h2>}
        {isEditMode && (
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="block w-full p-2 mb-2 border rounded-md"
          />
        )}
        {!isEditMode && <p className="text-gray-600">{description}</p>}

        {uploads?.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-gray-600">Attachments:</span>
            <div className="flex gap-2">
              {(isEditMode ? newUploads : uploads).map((link, i) => (
                <Attachment
                  key={i}
                  link={link}
                  i={i}
                  showRemoveButton={isEditMode}
                  handleRemoveAttachmentButtonClick={
                    handleRemoveAttachmentButtonClick
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 px-8 py-2 border-b">
        {isEditMode && (
          <>
            <AttachFilesButton onUploadNewFiles={handleNewUploads} />
            <Button onClick={handleCancelButtonClick}>
              <TrashIcon className="w-4 h-4" />
              Cancel
            </Button>
            <Button primary="true" onClick={handleSaveButtonClick}>
              Save Changes
            </Button>
          </>
        )}
        {!isEditMode && user?.email && session?.user?.email === user?.email && (
          <Button onClick={handleEditButtonClick}>
            <EditIcon className="w-4 h-4" />
            Edit
          </Button>
        )}
        {!isEditMode && (
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
        )}
      </div>
      <div className="">
        <FeedbackItemPopupComments feedbackId={_id} />
      </div>
    </Popup>
  );
}
