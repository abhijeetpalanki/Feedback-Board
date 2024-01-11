import { useState } from "react";
import Button from "./Button";
import Popup from "./Popup";
import axios from "axios";

export default function FeedbackFormPopup({ setShow }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleCreatePostButtonClick(e) {
    e.preventDefault();
    axios.post("/api/feedback", { title, description }).then(() => {
      setShow(false);
    });
  }

  return (
    <Popup setShow={setShow} heading={"Make a Suggestion"}>
      <form className="p-8">
        <label className="mt-4 mb-1 block text-slate-700">Title</label>
        <input
          type="text"
          placeholder="A short, descriptive title"
          className="w-full border p-2 rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="mt-4 mb-1 block text-slate-700">Details</label>
        <textarea
          className="w-full border p-2 rounded-md"
          placeholder="Describe your suggestion"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-2 mt-2 justify-end">
          <Button>Attach Files</Button>
          <Button primary={"true"} onClick={handleCreatePostButtonClick}>
            Create Post
          </Button>
        </div>
      </form>
    </Popup>
  );
}
