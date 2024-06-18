import { Object } from "./Object";
import Vector from "./Vector";
import { computeTriangleNormals } from "./glsl-utilities";
class Icosahedron extends Object {
  constructor(gl, color, position = new Vector(0, 0, 0), scale = { x: 1, y: 1, z: 1 }) {
    const phi = (1 + Math.sqrt(5)) / 2;
    const X = (1 / Math.sqrt(1 + phi * phi));
    const Z = (phi / Math.sqrt(1 + phi * phi));

    const vertices = [
      new Vector(-X, 0.0, Z),
      new Vector(X, 0.0, Z),
      new Vector(-X, 0.0, -Z),
      new Vector(X, 0.0, -Z),
      new Vector(0.0, Z, X),
      new Vector(0.0, Z, -X),
      new Vector(0.0, -Z, X),
      new Vector(0.0, -Z, -X),
      new Vector(Z, X, 0.0),
      new Vector(-Z, X, 0.0),
      new Vector(Z, -X, 0.0),
      new Vector(-Z, -X, 0.0),
    ].map(vertex => [vertex.x, vertex.y, vertex.z]);

    const faces = [
      [1, 4, 0], [4, 9, 0], [4, 5, 9], [8, 5, 4], [1, 8, 4],
      [1, 10, 8], [10, 3, 8], [8, 3, 5], [3, 2, 5], [3, 7, 2],
      [3, 10, 7], [10, 6, 7], [6, 11, 7], [6, 0, 11], [6, 1, 0],
      [10, 1, 6], [11, 0, 9], [2, 11, 9], [5, 2, 9], [11, 2, 7],
    ];

    super(gl, vertices, faces, color, position, scale, computeTriangleNormals);
  }
}

export { Icosahedron }
