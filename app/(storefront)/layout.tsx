import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import FloatingWhatsApp from "@/components/storefront/FloatingWhatsApp";
import PageTransition from "@/components/PageTransition";
import LocomotiveScrollProvider from "@/components/LocomotiveScrollProvider";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Fixed outside the scroll container: Locomotive Scroll transforms
          the container below, which would break `fixed` positioning if
          the header were a descendant of it. */}
      <Header />
      <LocomotiveScrollProvider>
        <div className="flex min-h-full flex-col pt-28">
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <FloatingWhatsApp />
        </div>
      </LocomotiveScrollProvider>
    </>
  );
}
