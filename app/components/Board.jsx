"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { RingLoader } from "react-spinners";
import axios from "axios";
import FeedbackItem from "./FeedbackItem";
import FeedbackFormPopup from "./FeedbackFormPopup";
import Button from "./Button";
import FeedbackItemPopup from "./FeedbackItemPopup";
import SearchIcon from "./icons/SearchIcon";
import { debounce } from "lodash";

export default function Board() {
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [votes, setVotes] = useState([]);
  const [votesLoading, setVotesLoading] = useState(false);
  const [sort, setSort] = useState("votes");
  const [fetchingFeedbacks, setFetchingFeedbacks] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [waiting, setWaiting] = useState(false);

  const searchTermRef = useRef("");
  const loadedAllRecordsRef = useRef(false);
  const fetchingFeedbacksRef = useRef(false);
  const loadedRows = useRef(0);
  const sortRef = useRef("votes");
  const waitingRef = useRef(false);
  const debouncedFetchFeedbacksRef = useRef(debounce(fetchFeedbacks, 300));
  const { data: session } = useSession();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    fetchVotes();
  }, [feedbacks]);

  useEffect(() => {
    loadedRows.current = 0;
    sortRef.current = sort;
    loadedAllRecordsRef.current = false;
    searchTermRef.current = searchTerm;
    if (feedbacks?.length > 0) {
      setFeedbacks([]);
    }
    setWaiting(true);
    waitingRef.current = true;
    debouncedFetchFeedbacksRef.current();
  }, [sort, searchTerm]);

  useEffect(() => {
    if (session?.user?.email) {
      const feedbackToVote = localStorage.getItem("vote_after_login");
      if (feedbackToVote) {
        axios.post("/api/vote", { feedbackId: feedbackToVote }).then(() => {
          localStorage.removeItem("vote_after_login");
          fetchVotes();
        });
      }
      const feedbackToPost = localStorage.getItem("post_after_login");
      if (feedbackToPost) {
        const feedbackData = JSON.parse(feedbackToPost);
        axios.post("/api/feedback", feedbackData).then(async (res) => {
          await fetchFeedbacks();
          setShowFeedbackPopupItem(res.data);
          localStorage.removeItem("post_after_login");
        });
      }
      const commentToPost = localStorage.getItem("comment_after_login");
      if (commentToPost) {
        const commentData = JSON.parse(commentToPost);
        axios.post("/api/comment", commentData).then(async () => {
          axios
            .get("/api/feedback?id=" + commentData.feedbackId)
            .then((res) => {
              setShowFeedbackPopupItem(res.data);
              localStorage.removeItem("comment_after_login");
            });
        });
      }
    }
  }, [session?.user?.email]);

  function handleScroll() {
    const html = window.document.querySelector("html");
    const howMuchIsScrolled = html.scrollTop;
    const howMuchIsToScroll = html.scrollHeight;
    const howMuchIsLeftToScroll =
      howMuchIsToScroll - howMuchIsScrolled - html.clientHeight;

    if (howMuchIsLeftToScroll <= 100) {
      fetchFeedbacks(true);
    }
  }

  function registerScrollListerner() {
    window.addEventListener("scroll", handleScroll);
  }

  function unregisterScrollListerner() {
    window.removeEventListener("scroll", handleScroll);
  }

  useEffect(() => {
    registerScrollListerner();
    return () => unregisterScrollListerner();
  }, []);

  async function fetchFeedbacks(append = false) {
    if (fetchingFeedbacksRef.current) return;
    if (loadedAllRecordsRef.current) return;
    fetchingFeedbacksRef.current = true;
    setFetchingFeedbacks(true);
    axios
      .get(
        `/api/feedback?sort=${sortRef.current}&loadedRows=${loadedRows.current}&search=${searchTermRef.current}`
      )
      .then((res) => {
        if (append) {
          setFeedbacks((prev) => [...prev, ...res.data]);
        } else {
          setFeedbacks(res.data);
        }
        if (res.data?.length > 0) {
          loadedRows.current += res.data.length;
        }
        if (res.data?.length === 0) {
          loadedAllRecordsRef.current = true;
        }
        fetchingFeedbacksRef.current = false;
        setFetchingFeedbacks(false);
        waitingRef.current = false;
        setWaiting(false);
      });
  }

  async function fetchVotes() {
    setVotesLoading(true);
    const ids = feedbacks.map((f) => f._id);
    const res = await axios.get("/api/vote?feedbackIds=" + ids.join(","));
    setVotes(res.data);
    setVotesLoading(false);
  }

  function openFeedbackPopupForm() {
    setShowFeedbackPopupForm(true);
  }

  function openFeedbackPopupItem(feedback) {
    setShowFeedbackPopupItem(feedback);
  }

  async function handleFeedbackUpdate(newData) {
    setShowFeedbackPopupItem((prev) => ({ ...prev, ...newData }));
    await fetchFeedbacks();
  }

  return (
    <main className="max-w-2xl mx-auto overflow-hidden bg-white shadow-lg md:rounded-lg md:mt-4 md:mb-8">
      <div className="p-8 bg-gradient-to-r from-cyan-400 to-blue-400">
        <h1 className="text-xl font-bold">Feedback Board</h1>
        <p className="text-opacity-90 text-slate-700">
          Help me decide what should I build next or improve.
        </p>
      </div>
      <div className="flex items-center px-8 py-4 bg-gray-100 border-b">
        <div className="flex items-center gap-4 text-gray-400 grow">
          <select
            className="py-2 bg-transparent"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="votes">Most Voted</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
          <div className="relative">
            <SearchIcon className="absolute w-4 h-4 pointer-events-none top-3 left-2" />
            <input
              type="text"
              placeholder="Search"
              className="p-2 bg-transparent pl-7"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="">
          <Button primary="true" onClick={openFeedbackPopupForm}>
            Make a suggestion!
          </Button>
        </div>
      </div>
      <div className="px-8">
        {feedbacks.length === 0 && !fetchingFeedbacks && !waiting && (
          <div className="py-8 text-4xl text-gray-200">
            No Feedbacks Found :(
          </div>
        )}
        {feedbacks.map((feedback, idx) => (
          <FeedbackItem
            {...feedback}
            onVotesChange={fetchVotes}
            votes={votes.filter(
              (v) => v.feedbackId.toString() === feedback._id.toString()
            )}
            onOpen={() => openFeedbackPopupItem(feedback)}
            isParentLoadingVotes={votesLoading}
            key={idx}
          />
        ))}
        {(fetchingFeedbacks || waiting) && (
          <div className="p-4">
            <RingLoader size={24} />
          </div>
        )}
      </div>
      {showFeedbackPopupForm && (
        <FeedbackFormPopup
          setShow={setShowFeedbackPopupForm}
          onFeedbackCreate={fetchFeedbacks}
        />
      )}
      {showFeedbackPopupItem && (
        <FeedbackItemPopup
          {...showFeedbackPopupItem}
          setShow={setShowFeedbackPopupItem}
          onVotesChange={fetchVotes}
          votes={votes.filter(
            (v) =>
              v.feedbackId.toString() === showFeedbackPopupItem._id.toString()
          )}
          onUpdate={handleFeedbackUpdate}
        />
      )}
    </main>
  );
}
