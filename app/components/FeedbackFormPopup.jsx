import { useState } from "react";
import Button from "./Button";
import Popup from "./Popup";
import axios from "axios";
import Attachment from "./icons/Attachment";

export default function FeedbackFormPopup({ setShow }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState([]);

  function handleCreatePostButtonClick(e) {
    e.preventDefault();
    axios.post("/api/feedback", { title, description }).then(() => {
      setShow(false);
    });
  }

  async function handleAttachFilesInputChange(e) {
    const files = [...e.target.files];
    const data = new FormData();

    for (const file of files) {
      data.append("file", file);
    }

    const res = await axios.post("/api/upload", data);
    setUploads([...uploads, ...res.data]);
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
            <div className="flex gap-2">
              {uploads.map((link, i) => (
                <a href={link} target="_blank" className="h-16" key={i}>
                  {/(.jpg|.jpeg|.png)$/.test(link) ? (
                    <div className="">
                      <img
                        src={link}
                        alt="link"
                        className="w-auto h-16 rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center h-16 p-2 bg-gray-200 rounded-md">
                      <Attachment className="w-4 h-4" />
                      {link.split("/")[3].substring(13)}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-2">
          <label className="px-4 py-2 text-gray-600 cursor-pointer">
            <span>Attach Files</span>
            <input
              multiple
              onChange={handleAttachFilesInputChange}
              type="file"
              className="hidden"
            />
          </label>
          <Button primary={"true"} onClick={handleCreatePostButtonClick}>
            Create Post
          </Button>
        </div>
      </form>
    </Popup>
  );
}
