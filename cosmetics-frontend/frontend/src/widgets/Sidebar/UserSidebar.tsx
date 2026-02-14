import { Link } from "react-router-dom";

export default function UserSidebar() {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 h-screen p-4">
      <div className="text-yellow-500 font-bold text-xl mb-6">Акаунт</div>

      <nav className="flex flex-col gap-2 text-gray-300">
        <Link to="/account" className="hover:text-yellow-500">Профіль</Link>
        <Link to="/orders" className="hover:text-yellow-500">Мої замовлення</Link>
        <Link to="/account/settings" className="hover:text-yellow-500">Налаштування</Link>
      </nav>
    </aside>
  );
}
