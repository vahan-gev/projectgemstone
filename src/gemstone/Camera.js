import { Mat4 } from "./Mat4"
import Vector from "./Vector";

class Camera {
  constructor() {
    this._position = new Vector(0, 0, 0);
    this._rotation = new Vector(0, 0, 0);
    this.mat4 = new Mat4()
    this.matrix = this.createMatrix(this._position, this._rotation);
  }
  get position() {
    return this._position;
  }

  set position(value) {
    this._position = value;
    this.updateMatrix();
  }

  get rotation() {
    return this._rotation;
  }

  set rotation(value) {
    this._rotation = value;
    this.updateMatrix();
  }

  updateMatrix() {
    this.matrix = this.createMatrix(this._position, this._rotation);
  }

  createMatrix(position, rotation) {
    const { x, y, z } = position
    const { x: rx, y: ry, z: rz } = rotation
    const cameraMatrix = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      -x, -y, -z, 1
    ]

    const rotationMatrixX = [
      1, 0, 0, 0,
      0, Math.cos(rx), -Math.sin(rx), 0,
      0, Math.sin(rx), Math.cos(rx), 0,
      0, 0, 0, 1
    ]

    const rotationMatrixY = [
      Math.cos(ry), 0, Math.sin(ry), 0,
      0, 1, 0, 0,
      -Math.sin(ry), 0, Math.cos(ry), 0,
      0, 0, 0, 1
    ]

    const rotationMatrixZ = [
      Math.cos(rz), -Math.sin(rz), 0, 0,
      Math.sin(rz), Math.cos(rz), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]

    const rotationMatrix = this.mat4.multiply(rotationMatrixX, rotationMatrixY)
    const finalMatrix = this.mat4.multiply(rotationMatrix, rotationMatrixZ)
    return this.mat4.multiply(cameraMatrix, finalMatrix)
  }

  lookAt(position) {
    const { x, y, z } = position
    const dx = x - this._position.x
    const dy = y - this._position.y
    const dz = z - this._position.z
    const rx = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz))
    const ry = Math.atan2(-dx, -dz);
    this.rotation = new Vector(rx, ry, 0)
  }
}

export { Camera }