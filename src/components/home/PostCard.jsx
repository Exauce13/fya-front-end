import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";

import { getPostUrl } from "../../data/postsData";
import { useUserMode } from "../../context/useUserMode";
import UserNameLink from "../ui/UserNameLink";
import { createComment, likePost } from "../../services/postsService";
import { setPostLiked } from "../../utils/likedPostsStorage";
import { getApiMessage } from "../../services/apiClient";

export default function PostCard({ post, onPostUpdate }) {
  const [localReaction, setLocalReaction] = useState(null);
  const [likePending, setLikePending] = useState(false);
  const [commentsCount, setCommentsCount] = useState(Number(post?.comments || 0));
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { isVisitor, user } = useUserMode();
  const navigate = useNavigate();

  if (!post) return null;

  const data = post;
  const displayedLiked = localReaction?.liked ?? Boolean(data.likedByCurrentUser);
  const displayedLikes = localReaction?.count ?? Number(data.likes || 0);

  const openCommentForm = () => {
    if (isVisitor) {
      navigate("/login");
      return;
    }
    setShowCommentForm((current) => !current);
  };

  const submitComment = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;

    try {
      await createComment({ postId: data.id, text: commentText.trim() });
    } catch (error) {
      alert(error.response?.data?.message || "Impossible d'ajouter le commentaire.");
      return;
    }

    const nextCommentsCount = commentsCount + 1;
    setCommentsCount(nextCommentsCount);
    onPostUpdate?.(data.id, { comments: nextCommentsCount });
    setCommentText("");
    setShowCommentForm(false);
  };

  const toggleLike = async () => {
    if (isVisitor) {
      navigate("/login");
      return;
    }
    if (likePending) return;

    const previousReaction = {
      liked: displayedLiked,
      count: displayedLikes,
    };
    const optimisticReaction = {
      liked: !previousReaction.liked,
      count: Math.max(0, previousReaction.count + (!previousReaction.liked ? 1 : -1)),
    };

    setLikePending(true);
    setLocalReaction(optimisticReaction);
    onPostUpdate?.(data.id, {
      likedByCurrentUser: optimisticReaction.liked,
      likes: optimisticReaction.count,
    });
    setPostLiked(user?.id, data.id, optimisticReaction.liked);

    try {
      await likePost(data.id);
    } catch (error) {
      setLocalReaction(previousReaction);
      onPostUpdate?.(data.id, {
        likedByCurrentUser: previousReaction.liked,
        likes: previousReaction.count,
      });
      setPostLiked(user?.id, data.id, previousReaction.liked);
      alert(getApiMessage(error, "Impossible d'enregistrer le like."));
    } finally {
      setLikePending(false);
    }
  };

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
            <h3 className="text-sm font-extrabold">
              <UserNameLink
                name={data.author}
                id={data.authorId}
                type={data.authorType}
                state={data.authorState}
              >
                {data.author}
              </UserNameLink>
            </h3>
            <p className="text-xs text-gray-500">{data.meta}</p>
          </div>
        </div>
        <button className="text-gray-400">...</button>
      </div>
      <p className="mt-4 text-sm leading-6 text-gray-700">{data.text}</p>
      {data.images.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {data.images.map((image) => (
            image.type === "video" ? (
              <video key={image.src} src={image.src} controls className="w-full rounded-md" />
            ) : (
              <img
                key={image.src}
                src={image.src}
                alt={image.name}
                className="w-full rounded-md"
              />
            )
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between border-b border-[#eee3d7] pb-3 text-xs font-semibold text-gray-500">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-red-500">
            <Heart size={15} className="fill-red-500" /> {displayedLikes}
          </span>
        </span>
        <Link
          to={isVisitor ? "/login" : getPostUrl(data)}
          state={{ post: data }}
          className="transition hover:text-[#145DA0]"
        >
          {commentsCount} commentaires
        </Link>
      </div>
      <div className="grid grid-cols-2 pt-3 text-sm font-semibold text-gray-600">
        <button
          type="button"
          onClick={toggleLike}
          disabled={likePending}
          className={`flex items-center justify-center gap-2 py-2 ${
            displayedLiked ? "text-red-500" : ""
          }`}
        >
          <Heart size={16} className={displayedLiked ? "fill-red-500" : ""} /> {displayedLiked ? "Je n'aime plus" : "J'aime"}
        </button>
        <button
          type="button"
          onClick={openCommentForm}
          className="flex items-center justify-center gap-2 py-2"
        >
          <MessageCircle size={16} /> Commenter
        </button>
      </div>

      {showCommentForm && (
        <form onSubmit={submitComment} className="mt-3 rounded-lg border border-[#eadfd3] bg-[#fbfaf8] p-3">
          <label className="block">
            <span className="sr-only">Votre commentaire</span>
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-[#eadfd3] bg-white px-3 py-2 text-sm font-semibold text-[#182433] outline-none focus:border-[#145DA0]"
              placeholder="Écrire un commentaire..."
            />
          </label>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowCommentForm(false);
                setCommentText("");
              }}
              className="min-h-10 rounded-md border border-[#eadfd3] px-4 text-sm font-extrabold text-[#182433]"
            >
              Annuler
            </button>
            <button className="min-h-10 rounded-md bg-[#145DA0] px-4 text-sm font-extrabold text-white">
              Publier
            </button>
          </div>
        </form>
      )}
    </article>
  );
}
