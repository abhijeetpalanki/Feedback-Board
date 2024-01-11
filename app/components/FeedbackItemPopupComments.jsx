import { useState } from "react";
import Button from "./Button";
import Avatar from "./Avatar";

export default function FeedbackItemPopupComments() {
  const [commentText, setCommentText] = useState("");

  return (
    <div className="p-8">
      <div className="flex gap-4 mb-8">
        <span className="">
          <Avatar url="https://i.pravatar.cc/300" />
        </span>
        <div className="">
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus,
            est sunt? Distinctio voluptatibus a quod repellendus corporis amet
            perspiciatis illum, blanditiis autem voluptas earum neque. Omnis
            sapiente corporis eos ut!
          </p>
          <div className="text-gray-400 mt-2 text-sm">
            Anonymous &middot; a few seconds ago
          </div>
        </div>
      </div>
      <form>
        <textarea
          placeholder="Let us know what you think..."
          className="border rounded-md w-full p-2"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button>Attach Files</Button>
          <Button primary={"true"} disabled={commentText === ""}>
            Comment
          </Button>
        </div>
      </form>
    </div>
  );
}
