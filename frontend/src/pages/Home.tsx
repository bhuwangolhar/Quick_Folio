import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Certifications from "../components/Certifications";
import EducationSection from "../components/Education";
import Socials from "../components/Socials";

interface HomeProps {
  adminMode?: boolean;
}

export default function Home({ adminMode = false }: HomeProps) {
  return (
    <main>
      <Hero adminMode={adminMode} />
      <About adminMode={adminMode} />
      <Experience adminMode={adminMode} />
      <Projects adminMode={adminMode} />
      <Skills adminMode={adminMode} />
      <EducationSection adminMode={adminMode} />
      <Certifications adminMode={adminMode} />
      <Socials adminMode={adminMode} />
    </main>
  );
}