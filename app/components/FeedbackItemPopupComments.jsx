import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import CommentsForm from "./CommentsForm";
import axios from "axios";
import Attachment from "./Attachment";
import TimeAgo from "timeago-react";

export default function FeedbackItemPopupComments({ feedbackId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  function fetchComments() {
    axios.get("/api/comment?feedbackId=" + feedbackId).then((res) => {
      setComments(res.data);
    });
  }

  return (
    <div className="p-8">
      {comments.length > 0 &&
        comments.map((comment, idx) => (
          <div className="mb-8" key={idx}>
            <div className="flex gap-4">
              <Avatar url={comment.user.image} />
              <div className="">
                <p className="text-gray-600">{comment.text}</p>
                <div className="mt-2 text-sm text-gray-400">
                  {comment.user.name} &middot;
                  <TimeAgo datetime={comment.createdAt} locale="en_US" />
                </div>
                {comment.uploads.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {comment.uploads.map((link, i) => (
                      <div className="" key={i}>
                        <Attachment link={link} i={i} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      <CommentsForm feedbackId={feedbackId} onPost={fetchComments} />
    </div>
  );
}
