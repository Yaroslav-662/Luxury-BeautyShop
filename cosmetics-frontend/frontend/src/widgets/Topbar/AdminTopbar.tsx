import UserMenu from "../Navbar/UserMenu";

export default function AdminTopbar() {
  return (
    <div className="w-full bg-black/40 backdrop-blur-md border-b border-yellow-500/20 px-6 py-3 flex justify-end">
      <UserMenu />
    </div>
  );
}
