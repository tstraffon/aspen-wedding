import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MusicButton from "@/components/MusicButton";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-primary focus:text-on-primary focus:px-6 focus:py-3 focus:font-label focus:text-xs focus:uppercase focus:tracking-widest"
      >
        Skip to content
      </a>
      <Navbar />
      <div id="main-content">{children}</div>
      <Footer />
      <MusicButton />
    </>
  );
}
