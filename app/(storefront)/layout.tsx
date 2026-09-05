import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import FloatingWhatsApp from "@/components/storefront/FloatingWhatsApp";
import PageTransition from "@/components/PageTransition";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
