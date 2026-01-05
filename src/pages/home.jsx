import VideoBackground from "../components/VideoBackground";
import HeroContent from "../components/HeroContent";
import ServicesCarousel from "../components/servicesCaruosel";
import HomeHighlightsSection from "../components/HomeHighlightsSection";
import { ClosingTestimonials } from "../components/ClosingTestimonials";


export default function Home() {
  return (
    <div>
      <section className="relative min-h-screen overflow-hidden ">
        <VideoBackground  duration={6000} transitionMs={800} />
        <HeroContent />

        <div className="relative bg-blackDeep pb-48">
          <div className="max-w-7xl mx-auto pt-24">
            <ServicesCarousel />
            <HomeHighlightsSection />
            <ClosingTestimonials/>
          </div>
        </div>
        
      </section>
    </div>
  );
}
