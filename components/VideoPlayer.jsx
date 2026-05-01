export default function VideoPlayer({ url, title }) {
  return (
    <div className="rounded-xl overflow-hidden bg-black border border-white/[0.06] aspect-video">
      <iframe
        src={url}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}