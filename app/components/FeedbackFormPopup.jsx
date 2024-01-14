import { useState } from "react";
import Button from "./Button";
import Popup from "./Popup";
import axios from "axios";
import Attachment from "./Attachment";
import AttachFilesButton from "./AttachFilesButton";
import { signIn, useSession } from "next-auth/react";

export default function FeedbackFormPopup({ setShow, onFeedbackCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState([]);
  const { data: session } = useSession();

  async function handleCreatePostButtonClick(e) {
    e.preventDefault();
    if (session) {
      axios.post("/api/feedback", { title, description, uploads }).then(() => {
        setShow(false);
        onFeedbackCreate();
      });
    } else {
      localStorage.setItem(
        "post_after_login",
        JSON.stringify({ title, description, uploads })
      );
      await signIn("google");
    }
  }

  function handleRemoveAttachmentButtonClick(e, link) {
    e.preventDefault();
    setUploads((prev) => {
      return prev.filter((item) => item !== link);
    });
  }

  function addNewUploads(newLinks) {
    setUploads((prev) => [...prev, ...newLinks]);
  }

  return (
    <Popup setShow={setShow} heading={"Make a Suggestion"}>
      <form className="p-8">
        <label className="block mt-4 mb-1 text-slate-700">Title</label>
        <input
          type="text"
          placeholder="A short, descriptive title"
          className="w-full p-2 border rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="block mt-4 mb-1 text-slate-700">Details</label>
        <textarea
          className="w-full p-2 border rounded-md"
          placeholder="Describe your suggestion"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {uploads.length > 0 && (
          <div>
            <label className="block mt-2 mb-1 text-slate-700">
              Attachments
            </label>
            <div className="flex gap-3">
              {uploads.map((link, i) => (
                <Attachment
                  key={i}
                  i={i}
                  link={link}
                  showRemoveButton="true"
                  handleRemoveAttachmentButtonClick={(e, link) =>
                    handleRemoveAttachmentButtonClick(e, link)
                  }
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-2">
          <AttachFilesButton onUploadNewFiles={addNewUploads} />
          <Button primary="true" onClick={handleCreatePostButtonClick}>
            {session ? "Create Post" : "Login & Post"}
          </Button>
        </div>
      </form>
    </Popup>
  );
}
