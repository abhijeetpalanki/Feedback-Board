export default function Popup({ setShow, heading, narrow, children }) {
  function close(e) {
    e.preventDefault();
    e.stopPropagation();
    setShow(false);
  }

  return (
    <div
      onClick={close}
      className="fixed inset-0 flex bg-white md:bg-black/80 md:items-center"
    >
      <button
        onClick={close}
        className="fixed hidden text-white md:block top-4 right-4"
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
      <div className="w-full h-full overflow-y-scroll">
        <div
          className={
            (narrow ? "md:max-w-sm" : "md:max-w-2xl") +
            " overflow-hidden bg-white md:my-8 md:mx-auto md:rounded-lg"
          }
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative min-h-10 md:min-h-0">
            <button
              onClick={close}
              className="absolute text-gray-600 top-4 left-8 md:hidden"
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
            {!!heading && (
              <h2 className="py-4 text-center border-b">{heading}</h2>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
