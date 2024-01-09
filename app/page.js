import FeedbackItem from "./components/FeedbackItem";

export default function Home() {
  return (
    <main className="bg-white max-w-2xl mx-auto shadow-lg md:rounded-lg md:mt-8 overflow-hidden">
      <div className="p-8 bg-gradient-to-r from-cyan-400 to-blue-400">
        <h1 className="font-bold text-xl">Feedback Board</h1>
        <p className="text-opacity-90 text-slate-700">
          Help me decide what should I build next or improve.
        </p>
      </div>
      <div className="bg-gray-100 px-8 py-4 flex border-b">
        <div className="grow"></div>
        <div className="">
          <button className="bg-blue-500 py-1 px-4 rounded-md text-white text-opacity-90">
            Make a suggestion!
          </button>
        </div>
      </div>
      <div className="px-8">
        <FeedbackItem />
        <FeedbackItem />
        <FeedbackItem />
        <FeedbackItem />
        <FeedbackItem />
        <FeedbackItem />
      </div>
    </main>
  );
}
