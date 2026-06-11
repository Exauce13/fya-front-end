import { ImagePlus, Mic, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ImagePreview from "./ImagePreview";

export default function ChatInput({ text, images, onTextChange, onImagesChange, onRemoveImage, onSend, onSendVoice }) {
  const [recording, setRecording] = useState(false);
  const [sendingVoice, setSendingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recordingStreamRef = useRef(null);

  const getAudioExtension = (mimeType) => {
    if (mimeType.includes("ogg")) return "ogg";
    if (mimeType.includes("wav")) return "wav";
    if (mimeType.includes("mpeg") || mimeType.includes("mp3")) return "mp3";
    if (mimeType.includes("mp4") || mimeType.includes("m4a")) return "m4a";
    return "webm";
  };

  useEffect(() => {
    if (!recording) return undefined;

    const interval = setInterval(() => {
      setRecordingSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [recording]);

  const attachMedia = (files) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const type = file.type.startsWith("video/") ? "video" : "image";
        onImagesChange((current) => [...current, { name: file.name, src: reader.result, type, file }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const startRecording = async () => {
    if (recording || sendingVoice) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      alert("L'enregistrement audio nécessite un navigateur compatible et une connexion sécurisée.");
      return;
    }

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      alert("Impossible d'accéder au micro.");
      return;
    }

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "";
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    chunksRef.current = [];
    recorderRef.current = recorder;
    recordingStreamRef.current = stream;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = async () => {
      const type = recorder.mimeType || mimeType || chunksRef.current[0]?.type || "audio/webm";
      const blob = new Blob(chunksRef.current, { type });
      stream.getTracks().forEach((track) => track.stop());
      recordingStreamRef.current = null;
      recorderRef.current = null;

      if (blob.size === 0) {
        setSendingVoice(false);
        alert("Aucun son n'a été enregistré. Réessayez.");
        return;
      }

      const fileName = `audio-${Date.now()}.${getAudioExtension(type)}`;
      const file = new File([blob], fileName, { type });
      const src = URL.createObjectURL(blob);

      try {
        await onSendVoice({ file, name: fileName, src, type: "audio", mimeType: type });
      } catch {
        // L'erreur est déjà affichée par la page de messagerie.
      } finally {
        setSendingVoice(false);
      }
    };

    recorder.start(250);
    setRecordingSeconds(0);
    setRecording(true);
  };

  const sendRecording = () => {
    if (!recorderRef.current || sendingVoice) return;
    setSendingVoice(true);
    recorderRef.current.requestData?.();
    recorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="border-t border-[#eadfd3] bg-white">
      <ImagePreview images={images} onRemove={onRemoveImage} />
      {recording && (
        <div className="border-t border-red-100 bg-red-50 px-5 py-3">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-red-600 text-white">
              <span className="absolute h-full w-full animate-ping rounded-full bg-red-400 opacity-40" />
              <Mic size={18} />
            </span>
            <div className="flex flex-1 items-center gap-1">
              {Array.from({ length: 28 }).map((_, index) => (
                <span
                  key={index}
                  className="w-1 rounded-full bg-red-400"
                  style={{ height: `${8 + ((index * 5 + recordingSeconds * 3) % 24)}px` }}
                />
              ))}
            </div>
            <span className="text-sm font-extrabold text-red-600">
              {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:
              {String(recordingSeconds % 60).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}
      <div className="flex items-center gap-3 p-5">
        <input
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSend();
          }}
          className="min-h-12 flex-1 rounded-xl border border-[#eadfd3] px-4 text-sm font-semibold outline-none focus:border-[#C96B2C]"
          placeholder="Écrivez votre message..."
        />
        <label className="grid h-12 w-12 cursor-pointer place-items-center rounded-xl border border-[#eadfd3] text-gray-600 transition hover:bg-[#fbfaf8]">
          <ImagePlus size={20} />
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(event) => attachMedia(event.target.files)}
          />
        </label>
        <button
          type="button"
          onClick={recording ? sendRecording : startRecording}
          disabled={sendingVoice}
          className={`grid h-12 w-12 place-items-center rounded-xl border transition ${
            recording
              ? "border-[#C96B2C] bg-[#C96B2C] text-white disabled:opacity-60"
              : "border-[#eadfd3] text-gray-600 hover:bg-[#fbfaf8] disabled:opacity-60"
          }`}
          aria-label={recording ? "Envoyer la note vocale" : "Enregistrer un audio"}
        >
          {recording ? <Send size={19} /> : <Mic size={20} />}
        </button>
        {!recording && !sendingVoice && (
          <button
            type="button"
            onClick={() => onSend()}
            className="grid h-12 w-12 place-items-center rounded-xl bg-[#C96B2C] text-white transition hover:bg-[#b65e23]"
          >
            <Send size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
