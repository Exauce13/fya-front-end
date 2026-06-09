import { useRef, useState } from "react";
import { Check, Download, Mic, Pause, Play, X } from "lucide-react";
import profileAvatar from "../../assets/images/profile-avatar.svg";

export default function MessageBubble({ message }) {
  const isMine = message.sender === "me";
  const [selectedImage, setSelectedImage] = useState(null);
  const hasText = Boolean(message.text);
  const mediaItems = message.images ?? [];
  const isAudioOnly =
    !hasText && mediaItems.length === 1 && mediaItems[0].type === "audio";

  return (
    <>
      <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
        <div
          className={`rounded-2xl text-sm font-semibold leading-6 shadow-sm ${
            isAudioOnly ? "w-fit max-w-[92%] p-0" : "max-w-[78%] px-4 py-3"
          } ${
            isMine
              ? "rounded-br-sm bg-[#d9ecfb] text-[#182433]"
              : "rounded-bl-sm bg-[#f1f1ef] text-[#182433]"
          }`}
        >
          {hasText && <p>{message.text}</p>}
          {mediaItems.length > 0 && (
            <div
              className={
                isAudioOnly
                  ? ""
                  : `${hasText ? "mt-3" : ""} grid gap-2 sm:grid-cols-3`
              }
            >
              {mediaItems.map((media) => (
                <MediaAttachment
                  key={media.src}
                  media={media}
                  isMine={isMine}
                  onOpenImage={setSelectedImage}
                />
              ))}
            </div>
          )}
          {!isAudioOnly && (
            <p className="mt-2 text-right text-[11px] font-bold text-gray-400">{message.time}</p>
          )}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4">
          <div className="absolute right-4 top-4 flex gap-2">
            <a
              href={selectedImage.src}
              download={selectedImage.name}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#182433]"
              title="Télécharger la photo"
            >
              <Download size={20} />
            </a>
            <button
              onClick={() => setSelectedImage(null)}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#182433]"
              title="Fermer"
            >
              <X size={20} />
            </button>
          </div>
          <img
            src={selectedImage.src}
            alt={selectedImage.name}
            className="max-h-[88vh] max-w-[94vw] rounded-xl object-contain"
          />
        </div>
      )}
    </>
  );
}

function MediaAttachment({ media, isMine, onOpenImage }) {
  return (
    <figure
      className={
        media.type === "audio"
          ? "overflow-visible rounded-2xl"
          : "overflow-hidden rounded-lg bg-white"
      }
    >
      {media.type === "video" ? (
        <video src={media.src} controls className="h-40 w-full object-cover" />
      ) : media.type === "audio" ? (
        <AudioAttachment media={media} isMine={isMine} />
      ) : (
        <button
          type="button"
          onClick={() => onOpenImage(media)}
          className="block w-full"
        >
          <img src={media.src} alt={media.name} className="h-40 w-full object-cover" />
        </button>
      )}
      {media.type === "video" && (
        <figcaption className="px-2 py-1 text-[11px] font-extrabold text-[#145DA0]">
          <a href={media.src} download={media.name}>
            Télécharger la vidéo
          </a>
        </figcaption>
      )}
    </figure>
  );
}

function AudioAttachment({ media, isMine }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const bars = Array.from({ length: 34 });
  const bubbleTone = isMine
    ? "bg-[#c6e4fb] text-[#15354f]"
    : "bg-[#e7e7e4] text-[#2d343b]";
  const ringTone = isMine ? "ring-[#c6e4fb]" : "ring-[#e7e7e4]";
  const barTone = isMine ? "bg-[#6aa7ce]" : "bg-[#a9aaa6]";

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
    <div className={`w-[330px] max-w-[calc(100vw-48px)] rounded-2xl px-3 py-2 shadow-sm ${bubbleTone}`}>
      <div className="flex items-center gap-3">
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#d7e3ec]">
          <img
            src={profileAvatar}
            alt=""
            className="h-full w-full object-cover"
          />
          <span className={`absolute bottom-0 right-0 grid h-5 w-5 place-items-center rounded-full bg-[#145DA0] text-white ring-2 ${ringTone}`}>
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
                  className={`w-[3px] rounded-full ${barTone}`}
                  style={{ height: `${8 + ((index * 7) % 22)}px` }}
                />
              ))}
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between text-xs font-semibold opacity-75">
            <span>{formatTime(currentTime)}</span>
            <span className="inline-flex items-center gap-1">
              {media.time ?? formatTime(duration)}
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
