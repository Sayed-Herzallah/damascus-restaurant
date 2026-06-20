import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturedDishes from "@/components/home/FeaturedDishes";
import ChefRecommendation from "@/components/home/ChefRecommendation";
import MenuCategoriesGrid from "@/components/home/MenuCategoriesGrid";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import GallerySection from "@/components/home/GallerySection";
import ReservationCTA from "@/components/home/ReservationCTA";
import FaqSection from "@/components/home/FaqSection";
import OpeningHoursCard from "@/components/home/OpeningHoursCard";

export default function Index() {
  return (
    <>
      <Hero />
      <AboutSection />
      <StatsSection />
      <FeaturedDishes />
      <ChefRecommendation />
      <MenuCategoriesGrid />
      <TestimonialsSection />
      <GallerySection />
      <ReservationCTA />
      <FaqSection />
      <OpeningHoursCard />
    </>
  );
}
