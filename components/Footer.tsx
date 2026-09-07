export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 py-8 mt-auto">
      <div className="max-w-2xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-400">
        <span>© {new Date().getFullYear()} NativeApply — a Nimbus Labs product</span>
        <a href="/terms" className="hover:text-black">
          Terms
        </a>
        <a href="/privacy" className="hover:text-black">
          Privacy
        </a>
        <a href="/refunds" className="hover:text-black">
          Refunds
        </a>
      </div>
    </footer>
  );
}
