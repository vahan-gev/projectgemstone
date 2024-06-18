import { Object } from "./Object";
import Vector from "./Vector";
import { computeVertexNormals } from "./glsl-utilities";

class Cone extends Object {
  constructor(gl, color, position = new Vector(0, 0, 0), scale = { x: 1, y: 1, z: 1 }, resolution = 20, height = 1, radius = 1) {
    const vertices = [];
    const faces = [];

    vertices.push([0, height, 0]);

    vertices.push([0, 0, 0]);

    for (let i = 0; i < resolution; i++) {
      const angle = (i / resolution) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      vertices.push([x, 0, z]);
    }

    for (let i = 2; i < vertices.length; i++) {
      const nextIndex = (i + 1 - 2) % resolution + 2;
      faces.push([0, nextIndex, i]);
    }

    for (let i = 2; i < vertices.length; i++) {
      const nextIndex = (i + 1 - 2) % resolution + 2;
      faces.push([1, i, nextIndex]);
    }

    super(gl, vertices, faces, color, position, scale, computeVertexNormals);
  }
}

export { Cone };
