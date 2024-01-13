import AttachmentIcon from "./icons/AttachmentIcon";
import TrashIcon from "./icons/TrashIcon";

export default function Attachment({
  link,
  showRemoveButton = false,
  handleRemoveAttachmentButtonClick,
  i,
}) {
  return (
    <a href={link} target="_blank" className="relative h-16" key={i}>
      {showRemoveButton && (
        <button
          onClick={(e) => handleRemoveAttachmentButtonClick(e, link)}
          className="absolute p-1 text-white bg-red-400 rounded-md -top-2 -right-2"
        >
          <TrashIcon />
        </button>
      )}
      {/.(.jpg|.jpeg|.png)$/.test(link) ? (
        <div>
          <img src={link} alt="link" className="w-auto h-16 rounded-md" />
        </div>
      ) : (
        <div className="flex items-center h-16 p-2 bg-gray-200 rounded-md">
          <AttachmentIcon className="w-4 h-4" />
          {link.split("/")[3].substring(13)}
        </div>
      )}
    </a>
  );
}
