import { useState } from "react";
import Button from "./Button";
import Popup from "./Popup";
import axios from "axios";
import { RingLoader } from "react-spinners";
import Attachment from "./Attachment";

export default function FeedbackFormPopup({ setShow, onFeedbackCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  function handleCreatePostButtonClick(e) {
    e.preventDefault();
    axios.post("/api/feedback", { title, description, uploads }).then(() => {
      setShow(false);
      onFeedbackCreate();
    });
  }

  async function handleAttachFilesInputChange(e) {
    const files = [...e.target.files];

    setIsUploading(true);

    const data = new FormData();

    for (const file of files) {
      data.append("file", file);
    }

    const res = await axios.post("/api/upload", data);
    setUploads([...uploads, ...res.data]);

    setIsUploading(false);
  }

  function handleRemoveAttachmentButtonClick(e, link) {
    e.preventDefault();
    setUploads((prev) => {
      return prev.filter((item) => item !== link);
    });
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
          <label className="flex px-4 py-2 cursor-pointer">
            {isUploading && <RingLoader size={18} />}
            <span className={isUploading ? "text-gray-300" : "text-gray-600"}>
              {isUploading ? "Uploading..." : "Attach Files"}
            </span>
            <input
              multiple
              onChange={handleAttachFilesInputChange}
              type="file"
              className="hidden"
            />
          </label>
          <Button primary="true" onClick={handleCreatePostButtonClick}>
            Create Post
          </Button>
        </div>
      </form>
    </Popup>
  );
}
