import { useEffect, useState } from "react";
import AdminCards from "../../components/admin/AdminCards";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { CityShareChart, RegistrationChart } from "../../components/admin/StatisticsCharts";
import { getAdminNotifications, getAdminOverview, getAdminVerifications, markAllAdminNotificationsAsRead } from "../../services/adminService";
import { getApiMessage } from "../../services/apiClient";

const verificationFee = 1000;
const notificationsPerPage = 10;

const getPaginatedTotal = (payload) =>
  Number(Array.isArray(payload) ? payload.length : payload?.total ?? payload?.meta?.total ?? payload?.data?.total ?? 0);

const getPaginatedItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const parseNotificationData = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const notificationTypeLabels = {
  nouveau_message: {
    unread: "Nouveau message",
    read: "Message",
  },
  nouvel_appel_offre: {
    unread: "Nouvel appel d'offres",
    read: "Appel d'offres",
  },
  nouvelle_candidature: {
    unread: "Nouvelle candidature",
    read: "Candidature",
  },
  candidature_acceptee: {
    unread: "Candidature acceptée",
    read: "Candidature acceptée",
  },
  post_like: {
    unread: "Nouveau like",
    read: "Like",
  },
  post_comment: {
    unread: "Nouveau commentaire",
    read: "Commentaire",
  },
};

const formatNotificationType = (type, unread) => {
  const labels = notificationTypeLabels[type];
  if (labels) return unread ? labels.unread : labels.read;

  return String(type || "notification").replaceAll("_", " ");
};

const normalizeNotification = (notification) => {
  const data = parseNotificationData(notification.data_json || notification.data);
  const unread = !notification.read_at;
  const title = data.title || data.titre || notification.title || formatNotificationType(notification.type, unread);
  const body = data.content || data.message || data.description || notification.message || "";
  const date = notification.created_at || notification.date || notification.updated_at;

  return {
    id: notification.id || `${notification.type}-${date}-${title}`,
    type: notification.type || "notification",
    title,
    body,
    date: date ? new Date(date).toLocaleString("fr-FR") : "",
    unread,
    typeLabel: formatNotificationType(notification.type, unread),
  };
};

const markAdminNotificationsAsViewed = async (setNotifications) => {
  try {
    await markAllAdminNotificationsAsRead();
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
        title: notification.type === "nouveau_message" && notification.title === "Nouveau message"
          ? "Message"
          : notification.title,
        typeLabel: formatNotificationType(notification.type, false),
      }))
    );
  } catch {
    // La journalisation reste consultable meme si la lecture ne peut pas etre synchronisee.
  }
};

const normalizeStats = (stats = {}, certifiedCount = 0) => {
  const users = Number(stats.users ?? stats.utilisateurs ?? 0);
  const artisans = Number(stats.artisans ?? 0);
  const clients = Number(stats.clients ?? stats.client_count ?? stats.clients_count ?? Math.max(users - artisans, 0));
  const backendVerificationTurnover = Number(
    stats.verification_turnover ??
    stats.certification_turnover ??
    stats.ca_verifications ??
    stats.chiffre_affaires_verifications ??
    0
  );

  return {
    ...stats,
    users,
    clients,
    artisans,
    turnover: backendVerificationTurnover || certifiedCount * verificationFee || Number(stats.turnover ?? 0),
  };
};

export default function AdminDashboard() {
  const [overview, setOverview] = useState({
    stats: {},
    registrations: [],
    city_share: [],
  });
  const [notifications, setNotifications] = useState([]);
  const [notificationPage, setNotificationPage] = useState(1);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(false);
  const [loadingMoreNotifications, setLoadingMoreNotifications] = useState(false);
  const [message, setMessage] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOverview() {
      try {
        const [payload, verificationsPayload] = await Promise.all([
          getAdminOverview(),
          getAdminVerifications({ status: "Validé", per_page: 1000 }),
        ]);
        const certifiedCount = getPaginatedTotal(verificationsPayload);
        if (active) {
          setOverview({
            stats: normalizeStats(payload?.stats || payload?.overview || {}, certifiedCount),
            registrations: payload?.registrations || payload?.registration_series || [],
            city_share: payload?.city_share || payload?.cities || [],
          });
          setMessage("");
        }
      } catch (error) {
        if (active) setMessage(getApiMessage(error, "Impossible de charger les statistiques admin."));
      }
    }

    loadOverview();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      try {
        const payload = await getAdminNotifications({ page: 1, per_page: notificationsPerPage });
        if (!active) return;

        setNotifications(getPaginatedItems(payload).map(normalizeNotification));
        setNotificationPage(1);
        setHasMoreNotifications(Boolean(payload?.next_page_url || payload?.links?.next));
        setNotificationMessage("");
        markAdminNotificationsAsViewed(setNotifications);
      } catch (error) {
        if (active) {
          setNotifications([]);
          setHasMoreNotifications(false);
          setNotificationMessage(getApiMessage(error, "Impossible de charger les notifications."));
        }
      }
    }

    loadNotifications();

    return () => {
      active = false;
    };
  }, []);

  const loadMoreNotifications = async () => {
    const nextPage = notificationPage + 1;
    setLoadingMoreNotifications(true);
    try {
      const payload = await getAdminNotifications({ page: nextPage, per_page: notificationsPerPage });
      setNotifications((current) => [...current, ...getPaginatedItems(payload).map(normalizeNotification)]);
      setNotificationPage(nextPage);
      setHasMoreNotifications(Boolean(payload?.next_page_url || payload?.links?.next));
      setNotificationMessage("");
      markAdminNotificationsAsViewed(setNotifications);
    } catch (error) {
      setNotificationMessage(getApiMessage(error, "Impossible de charger plus de notifications."));
    } finally {
      setLoadingMoreNotifications(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Vue d'ensemble" />
      {message && <p className="rounded-lg border border-[#F0C5C0] bg-white p-4 text-sm font-bold text-[#B42318]">{message}</p>}
      <AdminCards stats={overview.stats} />

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <RegistrationChart series={overview.registrations} />
        <CityShareChart shares={overview.city_share} />
      </div>

      <article className="rounded-lg border border-[#E8DED2] bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black">Journalisation</h2>
            <p className="text-sm font-semibold text-[#75695F]">Les dernières notifications enregistrées par le backend.</p>
          </div>
          <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-black text-[#145DA0]">
            {notifications.length} affichée{notifications.length > 1 ? "s" : ""}
          </span>
        </div>

        {notificationMessage && (
          <p className="mb-4 rounded-lg border border-[#F0C5C0] bg-[#FFF7F5] p-4 text-sm font-bold text-[#B42318]">
            {notificationMessage}
          </p>
        )}

        <div className="divide-y divide-[#EFE6DD]">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex gap-3 py-4">
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notification.unread ? "bg-[#D96822]" : "bg-[#CBD5E1]"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-black text-[#182433]">{notification.title}</p>
                  {notification.date && <span className="text-xs font-bold text-[#8A7E75]">{notification.date}</span>}
                </div>
                {notification.body && <p className="mt-1 text-sm font-semibold leading-6 text-[#75695F]">{notification.body}</p>}
                <p className="mt-1 text-xs font-black uppercase text-[#145DA0]">{notification.typeLabel}</p>
              </div>
            </div>
          ))}
        </div>

        {!notifications.length && !notificationMessage && (
          <p className="rounded-lg border border-dashed border-[#D7CABD] p-5 text-sm font-bold text-[#75695F]">
            Aucune notification pour le moment.
          </p>
        )}

        {hasMoreNotifications && (
          <button
            type="button"
            onClick={loadMoreNotifications}
            disabled={loadingMoreNotifications}
            className="mt-5 rounded-lg border border-[#D7CABD] px-4 py-2 text-sm font-black text-[#145DA0] transition hover:border-[#145DA0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMoreNotifications ? "Chargement..." : "Voir plus"}
          </button>
        )}
      </article>
    </div>
  );
}
