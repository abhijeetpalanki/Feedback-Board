export default function FeedbackItem() {
  return (
    <div className="flex gap-8 items-center my-8">
      <div className="">
        <h2 className="font-bold">
          Create more projects and post it in github
        </h2>
        <p className="text-gray-600 text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Exercitationem ut corrupti repellendus explicabo. Ratione et id
          officia, fugit omnis maxime repellendus nisi provident!
        </p>
      </div>
      <div className="">
        <button className="shadow-sm shadow-gray-200 border rounded-md py-1 px-4 flex items-center gap-1 text-gray-600">
          <span className="traingle-vote-up"></span>
          80
        </button>
      </div>
    </div>
  );
}
