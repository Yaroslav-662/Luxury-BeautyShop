export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-yellow-500/20 py-6 mt-10">
      <div className="max-w-7xl mx-auto text-center text-gray-400">
        © {new Date().getFullYear()} BEAUTY LUXE — Всі права захищені.
      </div>
    </footer>
  );
}
