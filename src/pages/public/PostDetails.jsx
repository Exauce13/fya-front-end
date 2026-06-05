import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Send } from "lucide-react";

import { defaultComments, defaultPost } from "../../data/postsData";

export default function PostDetails() {
  const location = useLocation();
  const post = location.state?.post || defaultPost;
  const initialComments = useMemo(() => {
    if (post.id === defaultPost.id) return defaultComments;
    return [];
  }, [post.id]);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(initialComments);
  const likesCount = post.likes + (liked ? 1 : 0);

  const addComment = (event) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text) return;

    setComments((current) => [
      {
        id: Date.now(),
        author: "John Doe",
        avatar: "https://i.pravatar.cc/120?img=3",
        date: "maintenant",
        text,
      },
      ...current,
    ]);
    setCommentText("");
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-4 pb-10 pt-24 text-[#182433] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#eadfd3] bg-white px-4 text-sm font-extrabold text-[#182433] transition hover:bg-[#fff3ea]"
        >
          <ArrowLeft size={17} />
          Retour
        </Link>

        <article className="mt-5 rounded-lg border border-[#eadfd3] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.avatar}
                alt={post.author}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-base font-extrabold">{post.author}</h1>
                <p className="text-xs text-gray-500">{post.meta}</p>
              </div>
            </div>
            <button className="text-gray-400">...</button>
          </div>

          <p className="mt-4 text-sm leading-7 text-gray-700">{post.text}</p>

          {post.images?.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {post.images.map((image) => (
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
            <span className="flex items-center gap-1 text-red-500">
              <Heart size={15} className="fill-red-500" />
              {likesCount}
            </span>
            <span>{comments.length} commentaires</span>
          </div>

          <div className="grid grid-cols-2 pt-3 text-sm font-semibold text-gray-600">
            <button
              type="button"
              onClick={() => setLiked((current) => !current)}
              className={`flex items-center justify-center gap-2 py-2 ${
                liked ? "text-red-500" : ""
              }`}
            >
              <Heart size={16} className={liked ? "fill-red-500" : ""} />
              J'aime
            </button>
            <span className="flex items-center justify-center gap-2 py-2 text-[#145DA0]">
              <MessageCircle size={16} />
              Commentaires
            </span>
          </div>
        </article>

        <section className="mt-5 rounded-lg border border-[#eadfd3] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#182433]">Commentaires</h2>

          <form onSubmit={addComment} className="mt-4 flex gap-3">
            <img
              src="https://i.pravatar.cc/120?img=3"
              alt="John Doe"
              className="h-11 w-11 rounded-full object-cover"
            />
            <div className="flex flex-1 items-center gap-2 rounded-full bg-[#f6f2ed] px-4">
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                className="min-h-12 flex-1 bg-transparent text-sm font-semibold text-[#182433] outline-none placeholder:text-gray-500"
                placeholder="Ajouter un commentaire..."
              />
              <button
                type="submit"
                className="grid h-9 w-9 place-items-center rounded-full bg-[#145DA0] text-white transition hover:bg-[#0f4b82]"
                aria-label="Ajouter le commentaire"
              >
                <Send size={16} />
              </button>
            </div>
          </form>

          <div className="mt-5 space-y-4">
            {comments.map((comment) => (
              <article key={comment.id} className="flex gap-3">
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex-1 rounded-lg bg-[#fbfaf8] px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-extrabold">{comment.author}</h3>
                    <span className="text-xs font-semibold text-gray-400">{comment.date}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold leading-6 text-gray-600">{comment.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
