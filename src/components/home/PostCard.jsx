import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";

import { defaultPost, getPostUrl } from "../../data/postsData";
import { useUserMode } from "../../context/useUserMode";

export default function PostCard({ post }) {
  const data = post || defaultPost;
  const [liked, setLiked] = useState(false);
  const { isVisitor } = useUserMode();
  const navigate = useNavigate();
  const likesCount = data.likes + (liked ? 1 : 0);

  return (
    <article className="mt-4 rounded-lg border border-[#eadfd3] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={data.avatar}
            alt={data.author}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-sm font-extrabold">{data.author}</h3>
            <p className="text-xs text-gray-500">{data.meta}</p>
          </div>
        </div>
        <button className="text-gray-400">...</button>
      </div>
      <p className="mt-4 text-sm leading-6 text-gray-700">{data.text}</p>
      {data.images.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {data.images.map((image) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.name}
              className="w-full rounded-md"
            />
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between border-b border-[#eee3d7] pb-3 text-xs font-semibold text-gray-500">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-red-500">
            <Heart size={15} className="fill-red-500" /> {likesCount}
          </span>
        </span>
        <span>{data.comments} commentaires</span>
      </div>
      <div className="grid grid-cols-2 pt-3 text-sm font-semibold text-gray-600">
        <button
          type="button"
          onClick={() => {
            if (isVisitor) {
              navigate("/login");
              return;
            }
            setLiked((current) => !current);
          }}
          className={`flex items-center justify-center gap-2 py-2 ${
            liked ? "text-red-500" : ""
          }`}
        >
          <Heart size={16} className={liked ? "fill-red-500" : ""} /> J'aime
        </button>
        <Link
          to={isVisitor ? "/login" : getPostUrl(data)}
          state={{ post: data }}
          className="flex items-center justify-center gap-2 py-2"
        >
          <MessageCircle size={16} /> Commenter
        </Link>
      </div>
    </article>
  );
}
