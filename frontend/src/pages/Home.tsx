import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Socials from "../components/Socials";

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Skills />
      <Socials />
    </main>
  );
}