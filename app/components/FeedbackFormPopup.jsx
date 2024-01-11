import Button from "./Button";
import Popup from "./Popup";

export default function FeedbackFormPopup({ setShow }) {
  return (
    <Popup setShow={setShow} heading={"Make a Suggestion"}>
      <form className="p-8">
        <label className="mt-4 mb-1 block text-slate-700">Title</label>
        <input
          type="text"
          placeholder="A short, descriptive title"
          className="w-full border p-2 rounded-md"
        />
        <label className="mt-4 mb-1 block text-slate-700">Details</label>
        <textarea
          className="w-full border p-2 rounded-md"
          placeholder="Describe your suggestion"
        />
        <div className="flex gap-2 mt-2 justify-end">
          <Button>Attach Files</Button>
          <Button primary={"true"}>Create Post</Button>
        </div>
      </form>
    </Popup>
  );
}
