import React from "react";
import { useLocation } from "react-router";

function Visualizer() {
  const location = useLocation();
  const { initialImage, name } = location.state || {};
  return (
    <div>
      <section>
        <h1>{name || "Untitled Project"}</h1>

        <div className="visualizer">
          {initialImage && (
            <div className="image-container">
              <h2>Source Image</h2>
              <img src={initialImage} alt="source" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Visualizer;
