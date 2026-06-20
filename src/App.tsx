import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { MenuProvider } from "@/context/MenuContext";
import { ReservationProvider } from "@/context/ReservationContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Index from "@/pages/Index";
import Menu from "@/pages/Menu";
import Contact from "@/pages/Contact";
import Reservations from "@/pages/Reservations";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import ScrollToTop from "@/components/layout/ScrollToTop";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MenuProvider>
          <ReservationProvider>
            <LanguageProvider>
              <Toaster position="top-center" richColors />
              <BrowserRouter>
                <ScrollToTop />
                <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/menu" element={<Menu />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/reservations" element={<Reservations />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </BrowserRouter>
            </LanguageProvider>
          </ReservationProvider>
        </MenuProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
