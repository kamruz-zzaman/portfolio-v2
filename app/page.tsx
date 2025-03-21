import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Skills from "@/components/sections/skills";
import Projects from "@/components/sections/projects";
import Contact from "@/components/sections/contact";
import FeaturedPosts from "@/components/sections/featured-posts";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Header />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <FeaturedPosts />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
