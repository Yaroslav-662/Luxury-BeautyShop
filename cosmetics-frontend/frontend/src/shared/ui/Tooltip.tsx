export default function Tooltip({ text, children }: any) {
  return (
    <div className="relative group inline-block">
      {children}
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition">
        {text}
      </span>
    </div>
  );
}
