import { Object } from "./Object";
import Vector from "./Vector";
import { computeTriangleNormals } from "./glsl-utilities";

class Box extends Object {
  constructor(gl, color, position = new Vector(0, 0, 0), scale = { x: 1, y: 1, z: 1 }) {
    const X = 0.5;
    const Y = 0.5;
    const Z = 0.5;

    const vertices = [
      new Vector(-X, -Y, Z),
      new Vector(X, -Y, Z),
      new Vector(X, Y, Z),
      new Vector(-X, Y, Z),
      new Vector(-X, -Y, -Z),
      new Vector(X, -Y, -Z),
      new Vector(X, Y, -Z),
      new Vector(-X, Y, -Z),
    ].map(vertex => [vertex.x, vertex.y, vertex.z]);

    const faces = [
      [0, 1, 2], [0, 2, 3],
      [4, 6, 5], [4, 7, 6],
      [3, 2, 6], [3, 6, 7],
      [0, 5, 1], [0, 4, 5],
      [1, 5, 6], [1, 6, 2],
      [0, 3, 7], [0, 7, 4]
    ];
    super(gl, vertices, faces, color, position, scale, computeTriangleNormals);
  }
}

export { Box }
