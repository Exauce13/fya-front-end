import { useEffect, useMemo, useState } from "react";

import { getClientOffers } from "../services/paymentService";
import {
  getOfferFeed,
  getMyOffers,
  getOfferItems,
  normalizeOffer,
  readCreatedOffers,
} from "../services/offersService";

const mergeOffers = (backendOffers, cachedOffers) => {
  const byId = new Map();

  [...cachedOffers, ...backendOffers].forEach((offer) => {
    if (offer?.id) byId.set(offer.id, offer);
  });

  return Array.from(byId.values());
};

const isClosedStatus = (status) => ["closed", "completed", "termine", "terminé"].includes(String(status || "").toLowerCase());

export default function useMyOffers(user, status = "open") {
  const [offers, setOffers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const clientId = user?.client?.id || user?.client_id;
    const cachedOffers = readCreatedOffers(user?.id).map((offer) => normalizeOffer(offer, true));

    async function loadUserOffersFromBackend() {
      const payload = await getMyOffers();
      return getOfferItems(payload)
        .map((offer) => normalizeOffer(offer, true))
        .filter((offer) => Number(offer.userId) === Number(user?.id) || !offer.userId);
    }

    async function loadClientOffersFromBackend() {
      if (!clientId) return [];

      const payload = await getClientOffers(clientId);
      return getOfferItems(payload).map((offer) => normalizeOffer(offer, true));
    }

    async function loadOwnOffersFromFeed() {
      const payload = await getOfferFeed();
      return getOfferItems(payload)
        .map((offer) => normalizeOffer(offer, true))
        .filter((offer) => Number(offer.userId) === Number(user?.id));
    }

    async function loadOffers() {
      setLoading(true);
      try {
        let items = [];

        try {
          items = await loadUserOffersFromBackend();
        } catch {
          items = await loadClientOffersFromBackend();
          if (items.length === 0) {
            items = await loadOwnOffersFromFeed();
          }
        }

        if (active) {
          const mergedOffers = mergeOffers(items, cachedOffers);
          setOffers(mergedOffers);
          setMessage(mergedOffers.length ? "" : "Aucun appel d'offres lancé.");
        }
      } catch (error) {
        if (active) {
          setOffers(cachedOffers);
          setMessage(
            cachedOffers.length
              ? ""
              : error.response?.data?.message || "Impossible de charger vos appels d'offres."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOffers();

    return () => {
      active = false;
    };
  }, [user]);

  const filteredOffers = useMemo(() => {
    if (status === "closed") return offers.filter((offer) => isClosedStatus(offer.status));
    if (status === "all") return offers;
    return offers.filter((offer) => !isClosedStatus(offer.status));
  }, [offers, status]);

  return {
    offers: filteredOffers,
    loading,
    message: filteredOffers.length ? "" : message,
  };
}
