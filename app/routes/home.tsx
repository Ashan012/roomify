import type { Route } from "./+types/home";
import NavBar from "../../components/NavBar";
import { ArrowRight } from "lucide-react";
import Button from "components/ui/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="home">
      <NavBar />
      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p>Introducing Roomify 2.0</p>
        </div>

        <h1>Build beautiful spaces at the speed of thougth with roomify</h1>

        <p className="subtitle">
          Roomify is an AI-first design environment that help you visualize
          render, and ship artitectural project faster than ever
        </p>

        <div className="actions">
          <a href="#upload" className="cta">
            Start Building <ArrowRight className="icon" />
          </a>
          <Button variant="outline" size="lg" className="demo">
            WATCH DEMO
          </Button>
        </div>
      </section>
    </div>
  );
}
