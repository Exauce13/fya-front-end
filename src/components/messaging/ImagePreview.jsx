import { useRef, useState } from "react";
import { Check, Mic, Pause, Play } from "lucide-react";
import profileAvatar from "../../assets/images/profile-avatar.svg";

export default function ImagePreview({ images, onRemove }) {
  if (!images.length) return null;

  return (
    <div className="grid gap-2 border-t border-[#eadfd3] bg-white px-4 py-3 sm:grid-cols-4">
      {images.map((media) => (
        <figure
          key={media.src}
          className={
            media.type === "audio"
              ? "overflow-hidden rounded-2xl bg-transparent sm:col-span-2"
              : "overflow-hidden rounded-lg border border-[#eadfd3] bg-[#f6f2ed]"
          }
        >
          <MediaPreview media={media} />
          <figcaption className="flex items-center justify-between gap-2 px-2 py-1 text-xs font-semibold text-gray-600">
            <span className="truncate">{media.name}</span>
            <button type="button" onClick={() => onRemove(media.src)} className="text-red-500">
              Retirer
            </button>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function MediaPreview({ media }) {
  if (media.type === "audio") {
    return <AudioPreview media={media} />;
  }

  if (media.type === "video") {
    return <video src={media.src} controls className="h-28 w-full object-contain" />;
  }

  return <img src={media.src} alt={media.name} className="h-28 w-full object-contain" />;
}

function AudioPreview({ media }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const bars = Array.from({ length: 20 });

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    audioRef.current.play();
    setPlaying(true);
  };

  const updateProgress = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const audioDuration = audio.duration || 0;
    setCurrentTime(audio.currentTime || 0);
    setDuration(audioDuration);
    setProgress(audioDuration ? audio.currentTime / audioDuration : 0);
  };

  const formatTime = (value) => {
    if (!Number.isFinite(value) || value <= 0) return "0:00";

    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="w-full rounded-2xl bg-[#c6e4fb] px-3 py-2 text-[#15354f] shadow-sm">
      <div className="flex items-center gap-3">
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#d7e3ec]">
          <img
            src={profileAvatar}
            alt=""
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-0 right-0 grid h-5 w-5 place-items-center rounded-full bg-[#145DA0] text-white ring-2 ring-[#c6e4fb]">
            <Mic size={12} />
          </span>
        </span>

        <button
          type="button"
          onClick={togglePlayback}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-current transition hover:bg-white/30"
          aria-label={playing ? "Mettre l'audio en pause" : "Lire l'audio"}
        >
          {playing ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="relative flex h-8 flex-1 items-center gap-[3px] overflow-hidden pl-1">
              <span
                className="absolute top-1/2 z-10 h-3 w-3 -translate-y-1/2 rounded-full bg-[#45b5ef] shadow-sm transition-[left] duration-150"
                style={{ left: `calc(${Math.min(progress, 1) * 100}% - 6px)` }}
              />
              {bars.map((_, index) => (
                <span
                  key={index}
                  className="w-[3px] rounded-full bg-[#6aa7ce]"
                  style={{ height: `${8 + ((index * 7) % 22)}px` }}
                />
              ))}
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between text-xs font-semibold opacity-75">
            <span>{formatTime(currentTime)}</span>
            <span className="inline-flex items-center gap-1">
              {formatTime(duration)}
              <Check size={13} />
            </span>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={media.src}
          onLoadedMetadata={updateProgress}
          onTimeUpdate={updateProgress}
          onEnded={() => {
            setPlaying(false);
            updateProgress();
          }}
          className="hidden"
          aria-label="Lecteur audio"
        />
      </div>
    </div>
  );
}
