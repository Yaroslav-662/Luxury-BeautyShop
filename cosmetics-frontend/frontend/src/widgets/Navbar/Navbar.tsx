// src/widgets/Navbar/Navbar.tsx
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useCartStore } from "@/store/cart.store";
import { useFavoritesStore } from "@/store/favorites.store";

export default function Navbar() {
  const cartCount = useCartStore((s) => s.count);
  const favCount = useFavoritesStore((s) => s.count);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Закриваємо пошук при кліку поза ним
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQ("");
      }
    }
    if (searchOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  // Закриваємо при зміні сторінки
  useEffect(() => {
    setSearchOpen(false);
    setSearchQ("");
  }, [location.pathname]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchOpen(false);
      setSearchQ("");
    }
  }

  function openSearch() {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const navLinks = [
    { to: "/shop", label: "Магазин" },
    { to: "/shop?sort=discount", label: "🔥 Sale" },
    { to: "/shop", label: "Новинки" },
  ];

  return (
    <header className="w-full bg-black/90 backdrop-blur-lg border-b border-yellow-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3 gap-3">

        {/* Logo */}
        <Link to="/" className="text-lg md:text-xl font-bold text-yellow-500 shrink-0 tracking-tight">
          BEAUTY LUXE
        </Link>

        {/* Nav — desktop */}
        <nav className="hidden md:flex items-center gap-4 text-sm text-gray-300 font-medium">
          {navLinks.map((l) => (
            <Link key={l.label} className="hover:text-yellow-400 transition-colors whitespace-nowrap" to={l.to}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Search desktop */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-xs justify-end">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="w-full flex gap-2">
              <input
                ref={inputRef}
                className="flex-1 bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-1.5 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                placeholder="Пошук товарів..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
              <button type="submit" className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
                →
              </button>
            </form>
          ) : (
            <button onClick={openSearch} className="text-gray-400 hover:text-yellow-400 transition-colors p-1" title="Пошук">
              🔍
            </button>
          )}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search mobile */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden text-gray-400 hover:text-yellow-400 transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {searchOpen ? "✕" : "🔍"}
          </button>

          {/* Favorites */}
          <Link
            to="/favorites"
            className="relative text-gray-300 hover:text-yellow-400 transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Обрані"
          >
            <span className="text-lg">{favCount > 0 ? "♥" : "♡"}</span>
            {favCount > 0 && (
              <span className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {favCount > 9 ? "9+" : favCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative text-gray-300 hover:text-yellow-400 transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Кошик"
          >
            <span className="text-lg">🛒</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-yellow-500 text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          <UserMenu />
        </div>
      </div>

      {/* Mobile search dropdown */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 border-t border-neutral-800/50">
          <form onSubmit={handleSearch} className="flex gap-2 pt-3">
            <input
              ref={inputRef}
              autoFocus
              className="flex-1 bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              placeholder="Пошук товарів..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
            <button
              type="submit"
              className="bg-yellow-500 text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors"
            >
              →
            </button>
          </form>
          {/* Mobile nav links */}
          <div className="flex gap-3 mt-3 flex-wrap">
            {navLinks.map((l) => (
              <Link key={l.label} to={l.to}
                className="text-sm text-neutral-400 hover:text-yellow-400 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
