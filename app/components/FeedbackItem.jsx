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
      className="flex items-center gap-8 my-8"
    >
      <div className="flex-grow">
        <h2 className="font-bold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="">
        <button className="flex items-center gap-1 px-4 py-1 text-gray-600 border rounded-md shadow-sm shadow-gray-200">
          <span className="traingle-vote-up"></span>
          {votesCount || 0}
        </button>
      </div>
    </a>
  );
}
