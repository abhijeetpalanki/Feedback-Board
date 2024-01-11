export default function FeedbackItem({
  title,
  description,
  votesCount,
  onOpen,
}) {
  return (
    <a
      href=""
      onClick={(e) => {
        e.preventDefault();
        onOpen();
      }}
      className="flex gap-8 items-center justify-between my-8"
    >
      <div className="">
        <h2 className="font-bold">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <div className="">
        <button className="shadow-sm shadow-gray-200 border rounded-md py-1 px-4 flex items-center gap-1 text-gray-600">
          <span className="traingle-vote-up"></span>
          {votesCount}
        </button>
      </div>
    </a>
  );
}
