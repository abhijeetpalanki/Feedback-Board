import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import CommentsForm from "./CommentsForm";
import axios from "axios";
import Attachment from "./Attachment";
import TimeAgo from "timeago-react";
import { useSession } from "next-auth/react";
import AttachFilesButton from "./AttachFilesButton";

export default function FeedbackItemPopupComments({ feedbackId }) {
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [newUploads, setNewUploads] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetchComments();
  }, []);

  function fetchComments() {
    axios.get("/api/comment?feedbackId=" + feedbackId).then((res) => {
      setComments(res.data);
    });
  }

  function handleEditButtonClick(comment) {
    setEditingComment(comment);
    setNewCommentText(comment.text);
    setNewUploads(comment.uploads);
  }

  function handleCancelButtonClick() {
    setNewCommentText("");
    setNewUploads([]);
    setEditingComment(null);
  }

  function handleRemoveAttachmentButtonClick(e, linkToRemove) {
    e.preventDefault();
    setNewUploads((prev) => prev.filter((l) => l !== linkToRemove));
  }

  function handleNewLinks(newLinks) {
    setNewUploads((prev) => [...prev, ...newLinks]);
  }

  async function handleSaveButtonClick() {
    const newData = {
      text: newCommentText,
      uploads: newUploads,
    };
    await axios.put("/api/comment", {
      id: editingComment._id,
      ...newData,
    });
    setComments((existingComments) => {
      return existingComments.map((comment) => {
        if (comment._id === editingComment._id) {
          return {
            ...comment,
            ...newData,
          };
        } else {
          return comment;
        }
      });
    });
    setEditingComment(null);
  }

  return (
    <div className="p-8">
      {comments.length > 0 &&
        comments.map((comment, idx) => {
          const isEditing = editingComment?._id === comment._id;
          const isAuthor =
            !!comment.user.email && comment.user.email === session?.user?.email;

          return (
            <div className="mb-8" key={idx}>
              <div className="flex gap-4">
                <Avatar url={comment.user.image} />
                <div className="">
                  {isEditing && (
                    <textarea
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="block w-full p-2 border"
                    />
                  )}
                  {!isEditing && (
                    <p className="text-gray-600">{comment.text}</p>
                  )}
                  <div className="mt-2 text-sm text-gray-400">
                    {comment.user.name} &nbsp;&middot;&nbsp;
                    <TimeAgo datetime={comment.createdAt} locale="en_US" />
                    {!isEditing && isAuthor && (
                      <>
                        &nbsp;&middot;&nbsp;
                        <span
                          onClick={() => handleEditButtonClick(comment)}
                          className="cursor-pointer hover:underline"
                        >
                          Edit
                        </span>
                      </>
                    )}
                    {isEditing && (
                      <>
                        &nbsp;&middot;&nbsp;
                        <span
                          onClick={handleCancelButtonClick}
                          className="cursor-pointer hover:underline"
                        >
                          Cancel
                        </span>
                        &nbsp;&middot;&nbsp;
                        <span
                          onClick={handleSaveButtonClick}
                          className="cursor-pointer hover:underline"
                        >
                          Save Changes
                        </span>
                      </>
                    )}
                  </div>
                  {(isEditing ? newUploads : comment.uploads)?.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {(isEditing ? newUploads : comment.uploads).map(
                        (link, i) => (
                          <div key={i}>
                            <Attachment
                              handleRemoveAttachmentButtonClick={
                                handleRemoveAttachmentButtonClick
                              }
                              showRemoveButton={isEditing}
                              link={link}
                              i={i}
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}
                  {isEditing && (
                    <div className="mt-2">
                      <AttachFilesButton onUploadNewFiles={handleNewLinks} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      {!editingComment && (
        <CommentsForm feedbackId={feedbackId} onPost={fetchComments} />
      )}
    </div>
  );
}
