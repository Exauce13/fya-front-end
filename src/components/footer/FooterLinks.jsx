import { Link } from "react-router-dom";

export default function FooterLinks({ columns, routes }) {
  return columns.map((column) => (
    <div key={column.title}>
      <h3 className="text-sm font-extrabold">{column.title}</h3>
      <div className="mt-4 space-y-2 text-sm text-white/72">
        {column.items.map((item) => (
          routes[item] ? (
            <Link key={item} to={routes[item]} className="block hover:text-white">
              {item}
            </Link>
          ) : (
            <p key={item}>{item}</p>
          )
        ))}
      </div>
    </div>
  ));
}
