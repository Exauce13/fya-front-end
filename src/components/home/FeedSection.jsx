import { useState } from "react";
import { ImagePlus } from "lucide-react";

import PostCard from "./PostCard";
import { artisans } from "./homeData";
import { useUserMode } from "../../context/useUserMode";

export default function FeedSection() {
  const { isArtisan } = useUserMode();
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);

  const attachImages = (files) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((current) => [...current, { name: file.name, src: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const publishPost = () => {
    if (!text.trim() && images.length === 0) return;

    setPosts((current) => [
      {
        id: `post-${Date.now()}`,
        author: "Grace C. Couturière",
        avatar: artisans[1].image,
        meta: "Porto-Novo · maintenant",
        text: text.trim() || "Nouvelle publication",
        images,
        likes: 0,
        comments: 0,
      },
      ...current,
    ]);
    setText("");
    setImages([]);
  };

  return (
    <section className="mt-8">
      <h2 className="px-4 text-xl font-extrabold text-[#182433] sm:px-0">Fil d'actualité</h2>
      {isArtisan && (
      <div className="mt-4 rounded-none border-y border-[#eadfd3] bg-white p-3 shadow-sm sm:rounded-lg sm:border sm:p-4">
        <div className="flex flex-wrap items-center gap-3">
          <img
            src={artisans[1].image}
            alt="Grace C."
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="min-h-11 min-w-0 flex-[1_1_190px] rounded-full bg-[#f6f2ed] px-4 text-sm text-gray-700 outline-none sm:px-5"
            placeholder="Quoi de neuf aujourd'hui ?"
          />
          <div className="flex w-full justify-end gap-2 sm:w-auto">
            <label className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#eadfd3] text-[#145DA0] transition hover:bg-[#eef6ff]">
              <ImagePlus size={20} />
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => attachImages(event.target.files)}
              />
            </label>
            <button onClick={publishPost} className="min-h-11 rounded-md bg-[#2563EB] px-5 text-sm font-bold text-white">
              Publier
            </button>
          </div>
        </div>
        {images.length > 0 && (
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {images.map((image) => (
              <figure key={image.src} className="overflow-hidden rounded-md border border-[#eadfd3] bg-white">
                <img src={image.src} alt={image.name} className="h-56 w-full bg-[#f6f2ed] object-contain" />
              </figure>
            ))}
          </div>
        )}
      </div>
      )}
      {posts.map((post) => (
        <PostCard key={`${post.meta}-${post.text}`} post={post} />
      ))}
      <PostCard />
    </section>
  );
}
