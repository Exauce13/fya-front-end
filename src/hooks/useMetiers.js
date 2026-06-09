import { useEffect, useState } from "react";

import { getMetiers } from "../services/artisanService";

const normalizeMetier = (metier) => {
  if (typeof metier === "string") return { id: null, name: metier };
  return {
    id: metier?.id ?? null,
    name: metier?.nom || metier?.name || metier?.libelle || metier?.metier || "",
  };
};

export default function useMetiers() {
  const [metiers, setMetiers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadMetiers() {
      setLoading(true);
      try {
        const data = await getMetiers();
        const values = Array.isArray(data) ? data : data?.metiers || data?.data || [];
        const nextMetiers = values.map(normalizeMetier).filter((metier) => metier.name);

        if (active && nextMetiers.length > 0) {
          setMetiers(nextMetiers);
        }
      } catch {
        if (active) setMetiers([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMetiers();

    return () => {
      active = false;
    };
  }, []);

  return { metiers, loading };
}
