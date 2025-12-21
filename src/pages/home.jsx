import VideoBackground from "../components/VideoBackground";
import HeroContent from "../components/HeroContent";
import ServicesCarousel from "../components/servicesCaruosel";
import HomeHighlightsSection from "../components/HomeHighlightsSection";
import { ClosingTestimonials } from "../components/ClosingTestimonials";

const videos = ["/videos/bordadora.mp4", "/videos/estampado.mp4"];

export default function Home() {
  return (
    <div>
      <section className="relative min-h-screen overflow-hidden">
        <VideoBackground videos={videos} duration={6000} transitionMs={800} />

        <div className="absolute inset-0 bg-blackDeep/30 pointer-events-none"></div>

        <HeroContent />

        <div className="relative bg-blackDeep pb-48">
          <div className="max-w-5xl mx-auto pt-24">
            <ServicesCarousel />
            <HomeHighlightsSection />
            <ClosingTestimonials/>
          </div>
        </div>
        
      </section>
    </div>
  );
}
