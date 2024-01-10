import Button from "./Button";

export default function FeedbackFormPopup({ setShow }) {
  return (
    <div className="fixed inset-0 bg-white md:bg-black/80 flex  md:items-center">
      <button
        onClick={() => setShow(false)}
        className="hidden md:block fixed top-4 right-4 text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="w-full">
        <div className="bg-white md:max-w-2xl md:mx-auto md:rounded-lg overflow-hidden">
          <div className="relative">
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 left-8 md:hidden text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <h2 className="py-4 text-center border-b">Make a Suggestion</h2>
          </div>
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
              <Button primary>Create Post</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
