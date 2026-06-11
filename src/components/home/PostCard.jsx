import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, X } from "lucide-react";

import { getPostUrl } from "../../data/postsData";
import { useUserMode } from "../../context/useUserMode";
import UserNameLink from "../ui/UserNameLink";
import { createComment, likePost } from "../../services/postsService";
import { setPostLiked } from "../../utils/likedPostsStorage";
import { getApiMessage } from "../../services/apiClient";
import profileAvatar from "../../assets/images/profile-avatar.svg";

export default function PostCard({ post, onPostUpdate }) {
  const [localReaction, setLocalReaction] = useState(null);
  const [likePending, setLikePending] = useState(false);
  const [commentsCount, setCommentsCount] = useState(Number(post?.comments || 0));
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [activeMediaIndex, setActiveMediaIndex] = useState(null);
  const { isVisitor, user } = useUserMode();
  const navigate = useNavigate();

  if (!post) return null;

  const data = post;
  const displayedLiked = localReaction?.liked ?? Boolean(data.likedByCurrentUser);
  const displayedLikes = localReaction?.count ?? Number(data.likes || 0);
  const activeMedia = activeMediaIndex === null ? null : data.images[activeMediaIndex];

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
            src={data.avatar || profileAvatar}
            alt={data.author}
            onError={(event) => {
              event.currentTarget.src = profileAvatar;
            }}
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
        <PostMediaGrid
          images={data.images}
          onOpenImage={(index) => setActiveMediaIndex(index)}
        />
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

      {activeMedia && (
        <MediaLightbox
          media={activeMedia}
          currentIndex={activeMediaIndex}
          total={data.images.length}
          onClose={() => setActiveMediaIndex(null)}
          onPrevious={() =>
            setActiveMediaIndex((current) => (current === 0 ? data.images.length - 1 : current - 1))
          }
          onNext={() =>
            setActiveMediaIndex((current) => (current === data.images.length - 1 ? 0 : current + 1))
          }
        />
      )}
    </article>
  );
}

function PostMediaGrid({ images, onOpenImage }) {
  const visibleImages = images.slice(0, 4);
  const remainingCount = Math.max(images.length - visibleImages.length, 0);
  const count = images.length;

  if (count === 1) {
    return (
      <div className="mt-4 overflow-hidden rounded-lg border border-[#eadfd3] bg-[#f6f2ed]">
        <MediaTile
          image={images[0]}
          index={0}
          onOpenImage={onOpenImage}
          className="max-h-[420px] w-full sm:max-h-[560px]"
          mediaClassName="max-h-[420px] w-full object-contain sm:max-h-[560px]"
        />
      </div>
    );
  }

  const gridClass =
    count === 2
      ? "grid-cols-2"
      : "grid-cols-2 grid-rows-2";
  const containerClass =
    count === 2
      ? "h-[260px] sm:h-[360px]"
      : "h-[340px] sm:h-[440px]";

  return (
    <div className={`mt-4 grid ${containerClass} ${gridClass} gap-1 overflow-hidden rounded-lg border border-[#eadfd3] bg-[#eadfd3]`}>
      {visibleImages.map((image, index) => {
        const isHero = count === 3 && index === 0;

        return (
          <MediaTile
            key={`${image.src}-${index}`}
            image={image}
            index={index}
            onOpenImage={onOpenImage}
            overlayCount={index === visibleImages.length - 1 ? remainingCount : 0}
            className={isHero ? "row-span-2" : ""}
            mediaClassName="h-full w-full object-cover"
          />
        );
      })}
    </div>
  );
}

function MediaTile({
  image,
  index,
  onOpenImage,
  overlayCount = 0,
  className = "",
  mediaClassName = "",
}) {
  if (image.type === "video") {
    return (
      <div className={`relative min-h-0 bg-black ${className}`}>
        <video
          src={image.src}
          controls
          className={mediaClassName || "h-full w-full object-cover"}
        />
        {overlayCount > 0 && <MediaOverlay count={overlayCount} />}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpenImage(index)}
      className={`group relative min-h-0 bg-[#f6f2ed] ${className}`}
      aria-label="Agrandir la photo"
    >
      <img
        src={image.src}
        alt={image.name}
        className={`${mediaClassName} transition duration-200 group-hover:scale-[1.015]`}
      />
      {overlayCount > 0 && <MediaOverlay count={overlayCount} />}
    </button>
  );
}

function MediaOverlay({ count }) {
  return (
    <span className="absolute inset-0 grid place-items-center bg-[#182433]/60 text-3xl font-extrabold text-white">
      +{count}
    </span>
  );
}

function MediaLightbox({
  media,
  currentIndex,
  total,
  onClose,
  onPrevious,
  onNext,
}) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-[#111827]/85 p-3 sm:p-6">
      <div className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-[#fbfaf8] shadow-2xl">
        <header className="flex items-center justify-between gap-3 border-b border-[#eadfd3] bg-white px-4 py-3">
          <p className="truncate text-sm font-extrabold text-[#182433]">
            {currentIndex + 1} / {total} {media.name ? `- ${media.name}` : ""}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#eadfd3] text-gray-600 transition hover:bg-[#fbfaf8]"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </header>

        <div className="relative grid min-h-0 flex-1 place-items-center bg-[#f6f2ed] p-3 sm:p-5">
          {media.type === "video" ? (
            <video
              src={media.src}
              controls
              className="max-h-full max-w-full rounded-lg bg-black object-contain shadow-sm"
            />
          ) : (
            <img
              src={media.src}
              alt={media.name}
              className="max-h-full max-w-full rounded-lg bg-white object-contain shadow-sm"
            />
          )}

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={onPrevious}
                className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#182433] shadow-md transition hover:bg-white"
                aria-label="Media precedent"
              >
                <ChevronLeft size={21} />
              </button>
              <button
                type="button"
                onClick={onNext}
                className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#182433] shadow-md transition hover:bg-white"
                aria-label="Media suivant"
              >
                <ChevronRight size={21} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
