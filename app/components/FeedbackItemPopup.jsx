import Button from "./Button";
import FeedbackItemPopupComments from "./FeedbackItemPopupComments";
import Popup from "./Popup";

export default function FeedbackItemPopup({
  title,
  description,
  votesCount,
  setShow,
}) {
  return (
    <Popup setShow={setShow} heading={""}>
      <div className="p-8 pb-2">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex justify-end border-b px-8 py-2">
        <Button primary={"true"}>
          <span className="traingle-vote-up"></span>Upvote {votesCount}
        </Button>
      </div>
      <div className="">
        <FeedbackItemPopupComments />
      </div>
    </Popup>
  );
}
