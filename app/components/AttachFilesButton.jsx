import axios from "axios";
import { useState } from "react";
import { RingLoader } from "react-spinners";
import UploadIcon from "./icons/UploadIcon";

export default function AttachFilesButton({ onUploadNewFiles }) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleAttachFilesInputChange(e) {
    const files = [...e.target.files];

    setIsUploading(true);

    const data = new FormData();

    for (const file of files) {
      data.append("file", file);
    }

    const res = await axios.post("/api/upload", data);
    onUploadNewFiles(res.data);

    setIsUploading(false);
  }

  return (
    <label className="flex items-center gap-2 px-4 py-2 cursor-pointer">
      {isUploading && <RingLoader size={18} />}
      {!isUploading && <UploadIcon className="w-4 h-4" />}
      <span className={isUploading ? "text-gray-300" : "text-gray-600"}>
        {isUploading ? "Uploading..." : "Attach Files"}
      </span>
      <input
        multiple
        onChange={handleAttachFilesInputChange}
        type="file"
        className="hidden"
      />
    </label>
  );
}
