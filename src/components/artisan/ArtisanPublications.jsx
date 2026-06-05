import { useState } from "react";
import { ImagePlus } from "lucide-react";

import PostCard from "../home/PostCard";

export default function ArtisanPublications({ artisan, initialPosts, visitorMode }) {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState(initialPosts);

  const attachImages = (files) => {
    Array.from(files || []).forEach((file) => {
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
        id: `artisan-post-${Date.now()}`,
        author: `${artisan.prenom} ${artisan.nom} ${artisan.metier}`,
        avatar: artisan.photo,
        meta: `${artisan.ville} · maintenant`,
        text: text.trim() || "Nouvelle réalisation publiée depuis mon profil.",
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
    <section className="rounded-none border-y border-[#eadfd3] bg-white p-3 shadow-sm sm:rounded-lg sm:border sm:p-6">
      <h2 className="text-xl font-extrabold text-[#182433]">Publications</h2>

      {!visitorMode && (
        <div className="mt-5 rounded-lg border border-[#eadfd3] bg-[#fbfaf8] p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <img
              src={artisan.photo}
              alt={`${artisan.prenom} ${artisan.nom}`}
              className="h-12 w-12 shrink-0 rounded-full object-cover"
            />
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="min-h-11 w-full min-w-0 rounded-full bg-white px-4 text-sm font-semibold text-gray-700 outline-none sm:flex-1 sm:px-5"
              placeholder="Publier une réalisation, une astuce ou une annonce..."
            />
            <div className="flex justify-end gap-2 sm:justify-start">
              <label className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#d7e3f1] bg-white text-[#145DA0] transition hover:bg-[#eef6ff]">
                <ImagePlus size={20} />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => attachImages(event.target.files)}
                />
              </label>
              <button
                type="button"
                onClick={publishPost}
                className="rounded-md bg-[#145DA0] px-5 text-sm font-extrabold text-white transition hover:bg-[#0f4b82]"
              >
                Publier
              </button>
            </div>
          </div>

          {images.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {images.map((image) => (
                <figure key={image.src} className="overflow-hidden rounded-md border border-[#eadfd3] bg-white">
                  <img src={image.src} alt={image.name} className="h-56 w-full bg-[#f6f2ed] object-contain" />
                </figure>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-5">
        {posts.map((post) => (
          <PostCard key={`${post.meta}-${post.text}`} post={post} />
        ))}
      </div>
    </section>
  );
}
