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
      <Navbar />
      {children}
      <Footer />
      <MusicButton />
    </>
  );
}
