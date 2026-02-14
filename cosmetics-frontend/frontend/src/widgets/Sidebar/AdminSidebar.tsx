import { Link, useLocation } from "react-router-dom";

const items = [
  { title: "Панель", link: "/admin" },
  { title: "Товари", link: "/admin/products" },
  { title: "Категорії", link: "/admin/categories" },
  { title: "Замовлення", link: "/admin/orders" },
  { title: "Користувачі", link: "/admin/users" },
  { title: "Файли", link: "/admin/files" },
  { title: "Відгуки", link: "/admin/reviews" },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gray-900 border-r border-yellow-500/20 h-screen p-4">
      <div className="text-yellow-500 font-bold text-xl mb-6">Admin</div>

      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.link}
            to={item.link}
            className={`px-3 py-2 rounded-md ${
              location.pathname.startsWith(item.link)
                ? "bg-yellow-500 text-black"
                : "text-gray-300 hover:bg-yellow-500/10"
            }`}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
