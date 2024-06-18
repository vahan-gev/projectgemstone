import { useEffect, useRef } from 'react';
import { Camera } from './gemstone/Camera'
import { Universe } from './gemstone/Universe'
import { Scene } from './gemstone/Scene'
import { Box } from './gemstone/Box'
import { Sphere } from './gemstone/Sphere'
import { Icosahedron } from './gemstone/Icosahedron'
import { Cone } from './gemstone/Cone'
import { Color } from './gemstone/Color'
import Vector from './gemstone/Vector';
import './App.css';

function App() {
  const CANVAS_WIDTH = 1024;
  const CANVAS_HEIGHT = 512;
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Canvas is not supported in your browser

    // Basic Gemstone constants
    const camera = new Camera();
    const universe = new Universe(canvas, camera);
    const scene = new Scene();
    const gl = universe.gl;

    // Add a basic green box to the scene
    let box = new Box(gl, new Color(0, 1, 0), new Vector(0, 0, 0), new Vector(1, 1, 1));
    let boxRotationVelocity = 1;
    scene.add(box);

    // Adding more elements to the scene
    let floor = new Box(gl, new Color(0.5, 0.5, 0.5), new Vector(0, -1, 0), new Vector(10, 0.1, 10));
    scene.add(floor);

    let ball = new Sphere(gl, new Color(1, 0, 0), new Vector(0, 3, 0), new Vector(0.5, 0.5, 0.5), 20);
    let ballRotationVelocity = 1;
    ball.wireframe = true;
    scene.add(ball);

    let icosahedron = new Icosahedron(gl, new Color(0, 0, 1), new Vector(2, 0, 0), new Vector(0.5, 0.5, 0.5));
    let icosahedronRotationVelocity = 1;
    scene.add(icosahedron);

    let cone = new Cone(gl, new Color(1, 1, 0), new Vector(-2, 0, 0), new Vector(1, 1, 1), 20, 2, 1);
    scene.add(cone);

    // Set camera position and rotation
    camera.position = new Vector(0, 2, 5);
    camera.rotation = new Vector(0, 0, 0)

    // Draw the scene
    const animate = () => {
      universe.draw(scene);
      box.rotation.y += boxRotationVelocity;
      ball.rotation.y += ballRotationVelocity;
      icosahedron.rotation.y += icosahedronRotationVelocity;

      // Camera moving in a circle around the scene (remove the comment to enable it)
      // camera.position = new Vector(Math.sin(Date.now() / 1000) * 5, 2, Math.cos(Date.now() / 1000) * 5);

      window.requestAnimationFrame(animate);
    }

    animate();
  });
  return (
    <div>
      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}>
        <p>Your browser doesn't support this</p>
      </canvas>
    </div>
  );
}

export default App;