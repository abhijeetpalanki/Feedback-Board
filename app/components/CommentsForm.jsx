import { useState } from "react";
import Button from "./Button";
import AttachFilesButton from "./AttachFilesButton";
import Attachment from "./Attachment";
import axios from "axios";

export default function CommentsForm({ feedbackId, onPost }) {
  const [commentText, setCommentText] = useState("");
  const [uploads, setUploads] = useState([]);

  function addNewUploads(newLinks) {
    setUploads((prev) => [...prev, ...newLinks]);
  }

  function removeUpload(e, linkToRemove) {
    e.preventDefault();
    e.stopPropagation();
    setUploads((prev) => prev.filter((link) => link !== linkToRemove));
  }

  async function handleCommentButtonClick(e) {
    e.preventDefault();
    await axios.post("/api/comment", {
      text: commentText,
      uploads,
      feedbackId,
    });

    setCommentText("");
    setUploads([]);

    onPost();
  }

  return (
    <form>
      <textarea
        placeholder="Let us know what you think..."
        className="w-full p-2 border rounded-md"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      {uploads.length > 0 && (
        <div className="">
          <div className="mt-3 mb-2 text-sm text-gray-600">Files:</div>
          <div className="flex gap-3">
            {uploads.map((link, i) => (
              <div className="" key={i}>
                <Attachment
                  i={i}
                  link={link}
                  showRemoveButton={true}
                  handleRemoveAttachmentButtonClick={(e, link) =>
                    removeUpload(e, link)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2 mt-2">
        <AttachFilesButton onUploadNewFiles={addNewUploads} />
        <Button
          onClick={handleCommentButtonClick}
          primary={"true"}
          disabled={commentText === ""}
        >
          Comment
        </Button>
      </div>
    </form>
  );
}
