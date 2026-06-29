import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.webp";

import NavLinks from "./NavLinks";
import ProfileDropdown from "./ProfileDropdown";
import MobileMenu from "./MobileMenu";
import { getConversations } from "../../services/messageService";
import { getOfferFeed, getOfferItems } from "../../services/offersService";
import { onRealtimeEvent, realtimeEvents } from "../../services/realtimeService";

const seenMessagesKey = "fya-seen-message-ids";
const seenOffersKey = "fya-seen-offer-ids";
const indicatorRefreshIntervalMs = 7000;
const connectedIndicatorRefreshIntervalMs = 15000;

const readSeenIds = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]").map(String);
  } catch {
    return [];
  }
};

const writeSeenIds = (key, ids) => {
  localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids.map(String))).slice(0, 300)));
};

const asArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

export default function Navbar({ user }) {
  const location = useLocation();
  const isAuthenticated = !!user;
  const isHome = location.pathname === "/";
  const theme = isHome ? "dark" : "light";
  const [messageIds, setMessageIds] = useState([]);
  const [offerIds, setOfferIds] = useState([]);
  const [seenMessageIds, setSeenMessageIds] = useState(() => readSeenIds(seenMessagesKey));
  const [seenOfferIds, setSeenOfferIds] = useState(() => readSeenIds(seenOffersKey));
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  const refreshIndicators = useCallback(async () => {
    if (!user?.id) {
      setMessageIds([]);
      setOfferIds([]);
      return;
    }

    try {
      const payload = await getConversations();
      const unreadIds = asArray(payload)
        .map((conversation) => conversation.last_message)
        .filter((message) => message?.id && Number(message.expediteur_id) !== Number(user.id) && !message.is_read)
        .map((message) => String(message.id));
      setMessageIds(unreadIds);
    } catch {
      setMessageIds([]);
    }

    if (user.role === "artisan") {
      try {
        const payload = await getOfferFeed();
        setOfferIds(getOfferItems(payload).map((offer) => String(offer.id)).filter(Boolean));
      } catch {
        setOfferIds([]);
      }
    } else {
      setOfferIds([]);
    }
  }, [user]);

  useEffect(() => {
    const initialTimerId = window.setTimeout(refreshIndicators, 0);
    const timerId = window.setInterval(
      refreshIndicators,
      realtimeConnected ? connectedIndicatorRefreshIntervalMs : indicatorRefreshIntervalMs
    );

    return () => {
      window.clearTimeout(initialTimerId);
      window.clearInterval(timerId);
    };
  }, [refreshIndicators, realtimeConnected]);

  useEffect(() => {
    const resetTimerId = window.setTimeout(() => setRealtimeConnected(false), 0);
    if (!user?.id) return () => window.clearTimeout(resetTimerId);

    const removeConnectedListener = onRealtimeEvent(realtimeEvents.connected, () => setRealtimeConnected(true));
    const removeDisconnectedListener = onRealtimeEvent(
      [realtimeEvents.disconnected, realtimeEvents.error],
      () => setRealtimeConnected(false)
    );

    return () => {
      window.clearTimeout(resetTimerId);
      removeConnectedListener();
      removeDisconnectedListener();
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return undefined;

    return onRealtimeEvent(
      [realtimeEvents.message, realtimeEvents.offerPublished],
      (event) => {
        if (event.type === realtimeEvents.message) {
          const detail = event.detail || {};
          if (detail.id && Number(detail.senderId) !== Number(user.id)) {
            setMessageIds((current) => Array.from(new Set([String(detail.id), ...current])));
          } else {
            refreshIndicators().catch(() => {});
          }
        }

        if (event.type === realtimeEvents.offerPublished && user.role === "artisan") {
          const offerId = event.detail?.offerId;
          if (offerId) {
            setOfferIds((current) => Array.from(new Set([String(offerId), ...current])));
          } else {
            refreshIndicators().catch(() => {});
          }
        }
      }
    );
  }, [refreshIndicators, user]);

  const indicators = useMemo(() => ({
    "/messages": !location.pathname.startsWith("/messages") && messageIds.some((id) => !seenMessageIds.includes(id)),
    "/offres": offerIds.some((id) => !seenOfferIds.includes(id)),
  }), [location.pathname, messageIds, offerIds, seenMessageIds, seenOfferIds]);

  const handleNavigate = (to) => {
    if (to === "/messages") {
      const nextIds = Array.from(new Set([...seenMessageIds, ...messageIds]));
      setSeenMessageIds(nextIds);
      writeSeenIds(seenMessagesKey, nextIds);
    }

    if (to === "/offres") {
      const nextIds = Array.from(new Set([...seenOfferIds, ...offerIds]));
      setSeenOfferIds(nextIds);
      writeSeenIds(seenOffersKey, nextIds);
    }
  };

  return (
    <header
      className={`absolute left-0 top-0 z-50 w-full border-b backdrop-blur-md ${
        isHome
          ? "border-white/10 bg-[#102437]/45"
          : "border-[#eadfd3] bg-[#F8F5F1]/95 shadow-sm"
      }`}
    >
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 md:h-20 lg:px-10">

        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="FYA Logo"
            className="h-12 w-auto md:h-20"
          />
        </Link>

        {/* Navigation Desktop */}
        <NavLinks theme={theme} indicators={indicators} onNavigate={handleNavigate} />

        {/* Actions */}
        <div className="flex items-center gap-4">

          <div className="hidden items-center gap-4 md:flex">
            {isAuthenticated ? (
              <ProfileDropdown user={user} theme={theme} />
            ) : (
              <>
              <Link
                to="/login"
                className={`rounded-xl border px-5 py-2 transition ${
                  isHome
                    ? "border-white/45 text-white hover:bg-white/10"
                    : "border-[#C96B2C]/35 text-[#C96B2C] hover:bg-[#fff3ea]"
                }`}
              >
                Se connecter
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 rounded-xl bg-[#C96B2C] text-white hover:bg-[#b65e23] transition"
              >
                S'inscrire
              </Link>
              </>
            )}
          </div>

          <MobileMenu user={user} theme={theme} indicators={indicators} onNavigate={handleNavigate} />
        </div>

      </div>
    </header>
  );
}
