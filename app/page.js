import { AboutAndGuide } from "./_compoents/Pricing";
import { Hero } from "./_compoents/Hero";
import { Footer } from "./_compoents/Footer";
import DashboardHeader from "./dashboard/_component/DashboardHeader";
export default function Home() {
  return (
    <div>
        <DashboardHeader />
        <Hero />
        <AboutAndGuide />
        <Footer />
    </div>
  );
}
