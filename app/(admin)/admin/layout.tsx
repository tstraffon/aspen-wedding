export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-surface-container-lowest">
        <span className="font-headline text-primary text-sm uppercase tracking-[0.3em]">
          Admin Console
        </span>
        <div className="flex items-center space-x-6">
          <a
            href="/admin"
            className="text-on-surface-variant hover:text-on-surface font-label text-sm uppercase tracking-widest transition-colors duration-200"
          >
            Households
          </a>
          <a
            href="/admin/rsvps"
            className="text-on-surface-variant hover:text-on-surface font-label text-sm uppercase tracking-widest transition-colors duration-200"
          >
            RSVPs
          </a>
          <a
            href="/api/admin/auth/logout"
            className="text-on-surface-variant hover:text-error font-label text-sm uppercase tracking-widest transition-colors duration-200"
          >
            Logout
          </a>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
