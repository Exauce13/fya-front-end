import { ArrowLeft, ClipboardList, MapPin, Star } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import { publicClients } from "../../data/userProfiles";
import profileAvatar from "../../assets/images/profile-avatar.svg";

export default function ClientPublicProfile() {
  const { slug } = useParams();
  const location = useLocation();
  const routedClient = location.state?.client;
  const client = routedClient || publicClients.find((item) => item.slug === slug) || {
    name: "Client FYA",
    role: "Client",
    city: "",
    district: "",
    avatar: profileAvatar,
    rating: "0/5",
    reviews: 0,
    offers: 0,
    bio: "",
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-0 pb-10 pt-24 text-[#182433] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="mx-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-[#eadfd3] bg-white px-4 text-sm font-extrabold text-[#182433] transition hover:bg-[#fff3ea] sm:mx-0"
        >
          <ArrowLeft size={17} />
          Retour
        </Link>

        <section className="mt-5 rounded-none border-y border-[#eadfd3] bg-white p-6 shadow-sm sm:rounded-xl sm:border sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img src={client.avatar} alt={client.name} className="h-24 w-24 rounded-full object-cover" />
              <div>
                <h1 className="text-3xl font-extrabold">{client.name}</h1>
                <p className="mt-1 text-sm font-bold text-gray-500">{client.role}</p>
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-extrabold">
                  <MapPin size={16} className="text-[#C96B2C]" />
                  {[client.city, client.district].filter(Boolean).join(", ") || "Localisation non renseignee"}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm font-semibold leading-7 text-gray-600">{client.bio}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <article className="rounded-lg bg-[#fbfaf8] p-5">
              <Star className="fill-[#F5A623] text-[#F5A623]" />
              <p className="mt-3 text-2xl font-extrabold">{client.rating}</p>
              <p className="text-sm font-bold text-gray-500">Note moyenne</p>
            </article>
            <article className="rounded-lg bg-[#fbfaf8] p-5">
              <Star className="text-[#C96B2C]" />
              <p className="mt-3 text-2xl font-extrabold">{client.reviews}</p>
              <p className="text-sm font-bold text-gray-500">Avis reçus</p>
            </article>
            <article className="rounded-lg bg-[#fbfaf8] p-5">
              <ClipboardList className="text-[#145DA0]" />
              <p className="mt-3 text-2xl font-extrabold">{client.offers}</p>
              <p className="text-sm font-bold text-gray-500">Appels d'offres lancés</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
