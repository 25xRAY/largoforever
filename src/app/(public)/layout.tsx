import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EdRoniqFloat } from "@/components/ai/EdRoniqFloat";

export const dynamic = "force-dynamic";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <EdRoniqFloat />
    </>
  );
}
