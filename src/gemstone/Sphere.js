import Vector from "./Vector";
import { Object } from "./Object";
import { computeVertexNormals } from "./glsl-utilities";

class Sphere extends Object {
  constructor(gl, color, position = new Vector(0, 0, 0), scale = { x: 1, y: 1, z: 1 }, resolution = 20) {
    const vertices = [];
    const faces = [];

    for (let latNumber = 0; latNumber <= resolution; latNumber++) {
      const theta = latNumber * Math.PI / resolution;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let longNumber = 0; longNumber <= resolution; longNumber++) {
        const phi = longNumber * 2 * Math.PI / resolution;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;
        const nx = x;
        const ny = y;
        const nz = z;
        vertices.push([nx, ny, nz]);
      }
    }

    for (let latNumber = 0; latNumber < resolution; latNumber++) {
      for (let longNumber = 0; longNumber < resolution; longNumber++) {
        const first = (latNumber * (resolution + 1)) + longNumber;
        const second = first + resolution + 1;
        faces.push([first, first + 1, second]);
        faces.push([second, first + 1, second + 1,]);
      }
    }

    super(gl, vertices, faces, color, position, scale, computeVertexNormals);
  }
}

export { Sphere }
