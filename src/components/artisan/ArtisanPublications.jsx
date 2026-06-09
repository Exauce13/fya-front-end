import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";

import PostCard from "../home/PostCard";
import { getArtisanPosts } from "../../services/artisanService";
import { createPost } from "../../services/postsService";
import { getApiMessage, getStorageUrl } from "../../services/apiClient";
import { useUserMode } from "../../context/useUserMode";
import { isPostLiked } from "../../utils/likedPostsStorage";
import profileAvatar from "../../assets/images/profile-avatar.svg";

const getMediaType = (path) => {
  const value = String(path).toLowerCase();
  if (/\.(mp4|mov|webm|avi|mkv)(\?|$)/.test(value)) return "video";
  return "image";
};

const allowedMediaExtensions = /\.(jpe?g|png|webp|mp4|mov)$/i;

const getPostItems = (payload) => {
  if (Array.isArray(payload?.posts?.data)) return payload.posts.data;
  if (Array.isArray(payload?.data?.posts?.data)) return payload.data.posts.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const isRealizationPost = (post) => /r[eé]alisation/i.test(String(post.post_type || post.type || ""));

const normalizePost = (post, artisan, currentUser) => {
  const backendArtisan = post.artisan_p || post.artisanP || post.artisan || {};
  const author = backendArtisan.user || post.user || {};
  const media = post.media_json || post.media_urls || post.media || [];
  const artisanId = backendArtisan.id || post.artisan_id || artisan.id;
  const authorPhoto = author.photo || artisan.photo;

  return {
    id: post.id,
    author: author.name || `${artisan.prenom} ${artisan.nom}`.trim() || "Artisan",
    authorId: artisanId,
    authorType: "artisan",
    authorState: {
      artisan: {
        id: artisanId,
        name: author.name || `${artisan.prenom} ${artisan.nom}`.trim() || "Artisan",
        job: backendArtisan.metier?.nom || artisan.metier || "",
        category: backendArtisan.metier?.nom || artisan.metier || "",
        city: author.ville || artisan.ville || "",
        district: author.quartier || artisan.quartier || "",
        bio: backendArtisan.bio || artisan.bio || "",
        workshop: backendArtisan.nom_atelier || backendArtisan.nom_association || artisan.atelier || "",
        telephone: author.telephone || artisan.telephone || "",
        email: author.email || artisan.email || "",
        statut: author.statut || artisan.statut || "",
        image: getStorageUrl(authorPhoto) || profileAvatar,
        verified: Boolean(backendArtisan.is_certifed || artisan.verified),
        experience: `${backendArtisan.annees_experiences || artisan.experience || 0} an(s) d'expérience`,
      },
    },
    avatar: getStorageUrl(authorPhoto) || profileAvatar,
    meta: post.created_at ? new Date(post.created_at).toLocaleDateString("fr-FR") : "maintenant",
    text: post.description || "",
    images: media.map((item) => {
      if (item?.src) {
        return {
          name: item.name || String(item.src).split("/").pop(),
          src: item.src,
          type: item.type || getMediaType(item.src),
        };
      }

      const value = String(item).replace(/^\/?storage\/?/, "");
      return {
        name: value.split("/").pop(),
        src: getStorageUrl(item),
        type: getMediaType(value),
      };
    }),
    likes: post.likes_count || post.likes?.length || 0,
    comments: post.commentaires_count || post.comments_count || post.commentaires?.length || 0,
    likedByCurrentUser:
      Boolean(post.liked_by_current_user || post.is_liked || post.liked) ||
      isPostLiked(currentUser?.id, post.id),
  };
};

const normalizeCreatedPost = (payload, artisan, fallbackImages, fallbackText) => {
  const post = payload?.post;
  const media = post?.media_json || payload?.media_urls || fallbackImages;

  return {
    id: post?.id || Date.now(),
    author: `${artisan.prenom} ${artisan.nom} ${artisan.metier}`.trim(),
    authorId: artisan.id,
    authorType: "artisan",
    authorState: { artisan },
    avatar: artisan.photo,
    meta: post?.created_at ? new Date(post.created_at).toLocaleDateString("fr-FR") : "maintenant",
    text: post?.description || fallbackText,
    images: media.map((item) => {
      if (item.src) return item;
      return {
        name: String(item).split("/").pop(),
        src: getStorageUrl(item),
        type: getMediaType(item),
      };
    }),
    likes: 0,
    comments: 0,
    likedByCurrentUser: false,
  };
};

export default function ArtisanPublications({ artisan, initialPosts, visitorMode }) {
  const { user } = useUserMode();
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!artisan.id) {
      return;
    }

    let active = true;

    async function loadArtisanPosts() {
      setLoading(true);
      try {
        const payload = await getArtisanPosts(artisan.id);
        if (active) {
          const nextPosts = getPostItems(payload)
            .filter((post) => !isRealizationPost(post))
            .map((post) => normalizePost(post, artisan, user));
          setPosts(nextPosts);
        }
      } catch {
        if (active) setPosts(initialPosts);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadArtisanPosts();

    return () => {
      active = false;
    };
  }, [artisan, initialPosts, user]);

  const attachImages = (files) => {
    Array.from(files || []).forEach((file) => {
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
      const nextPost = payload?.post
        ? normalizePost(
            {
              ...payload.post,
              artisan_p: payload.post.artisan_p || payload.post.artisan || {
                id: artisan.id,
                user: { name: `${artisan.prenom} ${artisan.nom}`.trim(), photo: artisan.photo },
              },
              media_json: payload.post.media_json || payload.media_urls || images,
            },
            artisan,
            user
          )
        : normalizeCreatedPost(payload, artisan, images, text.trim());

      setPosts((current) => [nextPost, ...current]);
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
              placeholder="Publier un service, une astuce ou une annonce..."
            />
            <div className="flex justify-end gap-2 sm:justify-start">
              <label className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#d7e3f1] bg-white text-[#145DA0] transition hover:bg-[#eef6ff]">
                <ImagePlus size={20} />
                <input
                  type="file"
                  accept="image/*,video/*"
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

      <div className="mt-5">
        {loading && (
          <p className="rounded-lg border border-[#eadfd3] bg-[#fbfaf8] p-4 text-sm font-bold text-gray-500">
            Chargement des publications...
          </p>
        )}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onPostUpdate={updatePost} />
        ))}
        {!loading && posts.length === 0 && (
          <p className="rounded-lg border border-[#eadfd3] bg-[#fbfaf8] p-4 text-sm font-bold text-gray-500">
            Aucune publication de service pour le moment.
          </p>
        )}
      </div>
    </section>
  );
}
