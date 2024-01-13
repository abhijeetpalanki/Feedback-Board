export default function Avatar({ url = null }) {
  return (
    <div>
      <div className="w-12 h-12 overflow-hidden bg-blue-300 rounded-full">
        {!!url && <img src={url} alt="avatar" className="rounded-full" />}
      </div>
    </div>
  );
}
