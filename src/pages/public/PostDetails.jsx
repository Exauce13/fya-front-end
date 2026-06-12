import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Send } from "lucide-react";

import UserNameLink from "../../components/ui/UserNameLink";
import { createComment, getPostComments, likePost } from "../../services/postsService";
import { getApiMessage, getStorageUrl } from "../../services/apiClient";
import { useUserMode } from "../../context/useUserMode";
import profileAvatar from "../../assets/images/profile-avatar.svg";
import { isPostLiked, setPostLiked } from "../../utils/likedPostsStorage";

const normalizeComment = (comment) => ({
  id: comment.id,
  author: comment.user?.name || "Utilisateur",
  authorId: comment.user?.artisan?.id || comment.user?.artisan_p?.id || comment.user?.client?.id || comment.user_id,
  authorType: comment.user?.statut || comment.user?.role || "client",
  avatar: getStorageUrl(comment.user?.photo) || profileAvatar,
  date: comment.created_at ? new Date(comment.created_at).toLocaleDateString("fr-FR") : "",
  text: comment.comments || comment.commentaire || comment.content || comment.text || "",
});

export default function PostDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isVisitor } = useUserMode();
  const post = location.state?.post;
  const [likeState, setLikeState] = useState(() => ({
    liked: Boolean(post?.likedByCurrentUser) || isPostLiked(user?.id, post?.id),
    count: Number(post?.likes || 0),
  }));
  const likeStateRef = useRef(likeState);
  const [likePending, setLikePending] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!post?.id) return undefined;
    let active = true;

    async function loadComments() {
      try {
        const payload = await getPostComments(post.id);
        const items = Array.isArray(payload) ? payload : payload?.data || payload?.commentaires || [];
        if (active) setComments(items.map(normalizeComment));
      } catch {
        if (active) setComments([]);
      }
    }

    loadComments();

    return () => {
      active = false;
    };
  }, [post?.id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] px-4 pb-10 pt-24 text-[#182433] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-[#eadfd3] bg-white p-6 shadow-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#eadfd3] bg-white px-4 text-sm font-extrabold text-[#182433] transition hover:bg-[#fff3ea]"
          >
            <ArrowLeft size={17} />
            Retour
          </button>
          <p className="mt-5 text-sm font-bold text-gray-500">Publication introuvable.</p>
        </div>
      </div>
    );
  }

  const addComment = async (event) => {
    event.preventDefault();
    if (isVisitor) {
      navigate("/login");
      return;
    }
    const text = commentText.trim();
    if (!text) return;

    let createdComment = null;
    try {
      const payload = await createComment({ postId: post.id, text });
      createdComment = payload?.commentaire || payload?.data?.commentaire;
    } catch (error) {
      alert(error.response?.data?.message || "Impossible d'ajouter le commentaire.");
      return;
    }

    setComments((current) => [
      createdComment
        ? normalizeComment(createdComment)
        : {
            id: Date.now(),
            author: user?.name || "Utilisateur",
            authorId: user?.artisan?.id || user?.artisan_p?.id || user?.client?.id || user?.id,
            authorType: user?.role || user?.statut,
            avatar: user?.avatar || profileAvatar,
            date: "maintenant",
            text,
          },
      ...current,
    ]);
    setCommentText("");
  };

  const toggleLike = async () => {
    if (isVisitor) {
      navigate("/login");
      return;
    }
    if (likePending) return;

    const previousLikeState = likeStateRef.current;
    const optimisticLikeState = {
      liked: !previousLikeState.liked,
      count: Math.max(0, previousLikeState.count + (!previousLikeState.liked ? 1 : -1)),
    };

    likeStateRef.current = optimisticLikeState;
    setLikePending(true);
    setLikeState(optimisticLikeState);
    setPostLiked(user?.id, post.id, optimisticLikeState.liked);

    try {
      await likePost(post.id);
    } catch (error) {
      likeStateRef.current = previousLikeState;
      setLikeState(previousLikeState);
      setPostLiked(user?.id, post.id, previousLikeState.liked);
      alert(getApiMessage(error, "Impossible d'enregistrer le like."));
    } finally {
      setLikePending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-4 pb-10 pt-24 text-[#182433] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#eadfd3] bg-white px-4 text-sm font-extrabold text-[#182433] transition hover:bg-[#fff3ea]"
        >
          <ArrowLeft size={17} />
          Retour
        </button>

        <article className="mt-5 rounded-lg border border-[#eadfd3] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.avatar || profileAvatar}
                alt={post.author}
                onError={(event) => {
                  event.currentTarget.src = profileAvatar;
                }}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-base font-extrabold">
                  <UserNameLink
                    name={post.author}
                    id={post.authorId}
                    type={post.authorType}
                    state={post.authorState}
                  >
                    {post.author}
                  </UserNameLink>
                </h1>
                <p className="text-xs text-gray-500">{post.meta}</p>
              </div>
            </div>
            <button className="text-gray-400">...</button>
          </div>

          <p className="mt-4 text-sm leading-7 text-gray-700">{post.text}</p>

          {post.images?.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {post.images.map((image) => (
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
            <span className="flex items-center gap-1 text-red-500">
              <Heart size={15} className="fill-red-500" />
              {likeState.count}
            </span>
            <span>{comments.length} commentaires</span>
          </div>

          <div className="grid grid-cols-2 pt-3 text-sm font-semibold text-gray-600">
            <button
              type="button"
              onClick={toggleLike}
              disabled={likePending}
              className={`flex items-center justify-center gap-2 py-2 ${
                likeState.liked ? "text-red-500" : ""
              }`}
            >
              <Heart size={16} className={likeState.liked ? "fill-red-500" : ""} />
              {likeState.liked ? "Je n'aime plus" : "J'aime"}
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
              src={user?.avatar || profileAvatar}
              onError={(event) => {
                event.currentTarget.src = profileAvatar;
              }}
              alt={user?.name || "Utilisateur"}
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
                  src={comment.avatar || profileAvatar}
                  alt={comment.author}
                  onError={(event) => {
                    event.currentTarget.src = profileAvatar;
                  }}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex-1 rounded-lg bg-[#fbfaf8] px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-extrabold">
                      <UserNameLink
                        name={comment.author}
                        id={comment.authorId}
                        type={comment.authorType}
                      >
                        {comment.author}
                      </UserNameLink>
                    </h3>
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
