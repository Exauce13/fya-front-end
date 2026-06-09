import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";

import PostCard from "./PostCard";
import { useUserMode } from "../../context/useUserMode";
import { getFeedPosts } from "../../services/artisanService";
import { createPost } from "../../services/postsService";
import { getApiMessage, getPaginatedItems, getStorageUrl } from "../../services/apiClient";
import profileAvatar from "../../assets/images/profile-avatar.svg";
import { isPostLiked } from "../../utils/likedPostsStorage";

const getMediaType = (path) => {
  const value = String(path).toLowerCase();
  if (/\.(mp4|mov|webm|avi|mkv)(\?|$)/.test(value)) return "video";
  return "image";
};

const allowedMediaExtensions = /\.(jpe?g|png|webp|mp4|mov)$/i;

const resolveCurrentArtisanId = (user) =>
  user?.artisan?.id || user?.artisan_p?.id || user?.artisan_id || user?.artisanP?.id;

const normalizePost = (post, currentUser) => {
  const artisan = post.artisan_p || post.artisanP || post.artisan;
  const fallbackAuthor = currentUser || {};
  const author = artisan?.user || post.user || fallbackAuthor;
  const media = post.media_json || post.media || [];
  const likedByCurrentUser =
    Boolean(post.liked_by_current_user || post.is_liked || post.liked) ||
    isPostLiked(currentUser?.id, post.id);
  const artisanId = artisan?.id || post.artisan_id || author.artisan?.id || resolveCurrentArtisanId(currentUser);
  const authorPhoto = author.photo || author.avatar || fallbackAuthor.photo || fallbackAuthor.avatar;

  return {
    id: post.id,
    author: author.name || fallbackAuthor.name || "Artisan",
    authorId: artisanId,
    authorType: "artisan",
    authorState: artisan || fallbackAuthor
      ? {
          artisan: {
            id: artisanId,
            name: author.name || fallbackAuthor.name || "Artisan",
            job: artisan?.metier?.nom || fallbackAuthor.metier?.nom || fallbackAuthor.metier_nom || fallbackAuthor.trade || "",
            category: artisan?.metier?.nom || fallbackAuthor.metier?.nom || fallbackAuthor.metier_nom || fallbackAuthor.trade || "",
            city: author.ville || "",
            district: author.quartier || "",
            bio: artisan?.bio || "",
            workshop: artisan?.nom_atelier || artisan?.nom_association || "",
            telephone: author.telephone || "",
            email: author.email || "",
            statut: author.statut || "",
            image: getStorageUrl(authorPhoto) || profileAvatar,
            verified: Boolean(artisan?.is_certifed || fallbackAuthor.is_certifed),
            experience: `${artisan?.annees_experiences || fallbackAuthor.artisan?.annees_experiences || fallbackAuthor.artisan_p?.annees_experiences || 0} an(s) d'expérience`,
          },
        }
      : undefined,
    avatar: getStorageUrl(authorPhoto) || profileAvatar,
    meta: post.created_at ? new Date(post.created_at).toLocaleDateString("fr-FR") : "maintenant",
    text: post.description || "",
    images: media.map((path) => ({
      name: String(path).split("/").pop(),
      src: getStorageUrl(path),
      type: getMediaType(path),
    })),
    likes: post.likes_count || post.likes?.length || 0,
    likedByCurrentUser,
    comments: post.commentaires_count || post.comments_count || post.commentaires?.length || 0,
  };
};

export default function FeedSection() {
  const { isArtisan, user } = useUserMode();
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      setLoading(true);
      try {
        const payload = await getFeedPosts();
        if (active) {
          setPosts(getPaginatedItems(payload).map((post) => normalizePost(post, user)));
        }
      } catch {
        if (active) setPosts([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPosts();

    return () => {
      active = false;
    };
  }, [user]);

  const attachImages = (files) => {
    Array.from(files).forEach((file) => {
      if (!allowedMediaExtensions.test(file.name)) {
        alert("Format invalide. Utilisez jpg, jpeg, png, webp, mp4 ou mov.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImages((current) => [
          ...current,
          {
            name: file.name,
            src: reader.result,
            type: file.type.startsWith("video/") ? "video" : "image",
            file,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const publishPost = async () => {
    if (!text.trim() && images.length === 0) return;

    try {
      const payload = await createPost({
        description: text.trim(),
        postType: "services",
        media: images.map((image) => image.file).filter(Boolean),
      });
      const post = payload?.post
        ? normalizePost(
            {
              ...payload.post,
              artisan_p: payload.post.artisan_p || payload.post.artisan || user?.artisan || user?.artisan_p,
              media_json: payload.post.media_json || payload.media_urls,
            },
            user
          )
        : {
            id: Date.now(),
            author: user?.name || "Artisan",
            authorId: resolveCurrentArtisanId(user),
            authorType: "artisan",
            authorState: { artisan: { id: resolveCurrentArtisanId(user), name: user?.name || "Artisan" } },
            avatar: user?.avatar || profileAvatar,
            meta: "maintenant",
            text: text.trim(),
            images,
            likes: 0,
            comments: 0,
          };

      setPosts((current) => [post, ...current]);
      setText("");
      setImages([]);
    } catch (error) {
      alert(getApiMessage(error, "Impossible de publier pour le moment."));
    }
  };

  const updatePost = (postId, changes) => {
    setPosts((current) =>
      current.map((post) => (String(post.id) === String(postId) ? { ...post, ...changes } : post))
    );
  };

  return (
    <section className="mt-8">
      <h2 className="px-4 text-xl font-extrabold text-[#182433] sm:px-0">Fil d'actualité</h2>
      {isArtisan && (
      <div className="mt-4 rounded-none border-y border-[#eadfd3] bg-white p-3 shadow-sm sm:rounded-lg sm:border sm:p-4">
        <div className="flex flex-wrap items-center gap-3">
          <img
            src={user?.avatar || profileAvatar}
            alt={user?.name || "Profil"}
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
                accept="image/*,video/*"
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
                {image.type === "video" ? (
                  <video src={image.src} controls className="h-56 w-full bg-[#f6f2ed] object-contain" />
                ) : (
                  <img src={image.src} alt={image.name} className="h-56 w-full bg-[#f6f2ed] object-contain" />
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
      )}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onPostUpdate={updatePost} />
      ))}
      {!loading && posts.length === 0 && (
        <div className="mt-4 rounded-lg border border-[#eadfd3] bg-white p-6 text-sm font-bold text-gray-500">
          Aucune publication disponible pour le moment.
        </div>
      )}
    </section>
  );
}
