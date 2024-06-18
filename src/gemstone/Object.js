import { toRawLineArray, toRawTriangleArray } from "./Helper";
import { computeFaceNormals, computeTriangleNormals, initVertexBuffer } from "./glsl-utilities";
import Vector from "./Vector";
import { Mat4 } from "./Mat4";
class Object {
  constructor(gl, vertices, facesByIndex, color, position, scale, normalCalculation) {
    this.gl = gl;
    this.id = Math.random().toString(36).substring(7)
    this.vertices = vertices ?? []
    this.facesByIndex = facesByIndex ?? []
    this.color = color ?? { r: 0.5, g: 0.5, b: 0.5 }
    this.wireframeValue = false
    this.rawVertices = toRawTriangleArray(this)
    this.faceNormals = computeFaceNormals(this)
    this.position = position ?? new Vector(0, 0, 0);
    this.rotation = { x: 0, y: 0, z: 0 };
    this.scale = scale ?? { x: 1, y: 1, z: 1 };
    this.verticesBuffer = initVertexBuffer(this.gl, this.rawVertices);

    this.normalCalculation = normalCalculation ? normalCalculation : computeTriangleNormals;

    this.mat4 = new Mat4()
    if (Array.isArray(this.color)) {
      const colorsInsteadOfVertices = { facesByIndex: this.facesByIndex, vertices: this.color }
      this.colors = this.wireframeValue ? toRawLineArray(colorsInsteadOfVertices) : toRawTriangleArray(colorsInsteadOfVertices)
    } else {
      this.colors = [];
      for (let i = 0, maxi = this.rawVertices.length / 3; i < maxi; i += 1) {
        this.colors = this.colors.concat(this.color.r, this.color.g, this.color.b);
      }
    }
    this.colorsBuffer = initVertexBuffer(this.gl, this.colors)
    this.normalsBuffer = initVertexBuffer(this.gl, this.normalCalculation(this))
  }

  get normalCalculation() {
    return this.normalCalculationValue
  }

  set normalCalculation(newNormalCalculationValue) {
    this.normalCalculationValue = newNormalCalculationValue
    this.normalsBuffer = initVertexBuffer(this.gl, newNormalCalculationValue(this))
  }

  get wireframe() {
    return this.wireframeValue
  }

  set wireframe(newWireframeValue) {
    this.wireframeValue = newWireframeValue
    this.rawVertices = newWireframeValue ? toRawLineArray(this) : toRawTriangleArray(this)
    this.verticesBuffer = initVertexBuffer(this.gl, this.rawVertices)
    if (Array.isArray(this.color)) {
      const colorsInsteadOfVertices = { facesByIndex: this.facesByIndex, vertices: this.color }
      this.colors = this.wireframeValue ? toRawLineArray(colorsInsteadOfVertices) : toRawTriangleArray(colorsInsteadOfVertices)
    } else {
      this.colors = [];
      for (let i = 0, maxi = this.rawVertices.length / 3; i < maxi; i += 1) {
        this.colors = this.colors.concat(this.color.r, this.color.g, this.color.b);
      }
    }
    this.colorsBuffer = initVertexBuffer(this.gl, this.colors)
    this.normalsBuffer = initVertexBuffer(this.gl, this.normalCalculation(this))
  }

  getPosition() {
    return this.position;
  }

  draw(gl, globalTransformMatrix, vertexPosition, vertexColor, transform, vertexNormal) {

    let objectTransformMatrix = this.mat4.createIdentity();

    let objectScalingMatrix = this.mat4.createScaling(this.mesh().scale.x, this.mesh().scale.y, this.mesh().scale.z);
    objectTransformMatrix = this.mat4.multiply(objectTransformMatrix, objectScalingMatrix);

    let objectRotationMatrixX = this.mat4.createRotation(this.mesh().rotation.x, 1, 0, 0);
    let objectRotationMatrixY = this.mat4.createRotation(this.mesh().rotation.y, 0, 1, 0);
    let objectRotationMatrixZ = this.mat4.createRotation(this.mesh().rotation.z, 0, 0, 1);

    let objectRotationMatrix = this.mat4.multiply(objectRotationMatrixX, objectRotationMatrixY);
    objectRotationMatrix = this.mat4.multiply(objectRotationMatrix, objectRotationMatrixZ);

    objectTransformMatrix = this.mat4.multiply(objectTransformMatrix, objectRotationMatrix);

    let objectTranslationMatrix = this.mat4.createTranslation(this.mesh().position.x, this.mesh().position.y, this.mesh().position.z);
    objectTransformMatrix = this.mat4.multiply(objectTransformMatrix, objectTranslationMatrix);

    let finalTransformMatrix = this.mat4.multiply(globalTransformMatrix, objectTransformMatrix);
    gl.uniformMatrix4fv(transform, gl.FALSE, new Float32Array(finalTransformMatrix));

    // Set the varying normals
    if (!this.wireframe) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh().normalsBuffer);
      gl.vertexAttribPointer(vertexNormal, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vertexNormal);
    } else {
      gl.disableVertexAttribArray(vertexNormal);
    }

    // Set the varying colors
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh().colorsBuffer);
    gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

    // Set the vertex coordinates
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh().verticesBuffer);
    gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(this.mesh().mode, 0, this.mesh().vertices.length / 3);
  }

  collidesWith(object) {
    let a = this.mesh()
    let b = object.mesh()

    let aMin = { x: a.position.x - a.scale.x / 2, y: a.position.y - a.scale.y / 2, z: a.position.z - a.scale.z / 2 }
    let aMax = { x: a.position.x + a.scale.x / 2, y: a.position.y + a.scale.y / 2, z: a.position.z + a.scale.z / 2 }

    let bMin = { x: b.position.x - b.scale.x / 2, y: b.position.y - b.scale.y / 2, z: b.position.z - b.scale.z / 2 }
    let bMax = { x: b.position.x + b.scale.x / 2, y: b.position.y + b.scale.y / 2, z: b.position.z + b.scale.z / 2 }

    return aMin.x < bMax.x && aMax.x > bMin.x && aMin.y < bMax.y && aMax.y > bMin.y && aMin.z < bMax.z && aMax.z > bMin.z
  }

  mesh() {
    return {
      id: this.id,
      color: this.color,
      vertices: this.rawVertices,
      mode: this.wireframeValue ? this.gl.LINES : this.gl.TRIANGLES,
      verticesBuffer: this.verticesBuffer,
      colorsBuffer: this.colorsBuffer,
      normalsBuffer: this.normalsBuffer,
      position: this.position,
      rotation: this.rotation,
      scale: this.scale
    }
  }
}

class ObjectGroup {
  constructor(position, scale) {
    this.children = []
    this.position = position ?? new Vector(0, 0, 0);
    this.rotation = { x: 0, y: 0, z: 0 };
    this.scale = scale ?? { x: 1, y: 1, z: 1 };
    this.mat4 = new Mat4()
  }

  add(object) {
    this.children.push(object)
  }

  remove(object) {
    this.children = this.children.filter(child => child.id !== object.id)
  }

  draw(gl, globalTransformMatrix, vertexPosition, vertexColor, transform) {
    let groupMatrix = this.mat4.createIdentity();
    let scalingMatrix = this.mat4.createScaling(this.scale.x, this.scale.y, this.scale.z);

    let rotationMatrixX = this.mat4.createRotation(this.rotation.x, 1, 0, 0);
    let rotationMatrixY = this.mat4.createRotation(this.rotation.y, 0, 1, 0);
    let rotationMatrixZ = this.mat4.createRotation(this.rotation.z, 0, 0, 1);

    let rotationMatrix = this.mat4.multiply(rotationMatrixX, rotationMatrixY);
    rotationMatrix = this.mat4.multiply(rotationMatrix, rotationMatrixZ);


    let translationMatrix = this.mat4.createTranslation(this.position.x, this.position.y, this.position.z);

    groupMatrix = this.mat4.multiply(groupMatrix, scalingMatrix);
    groupMatrix = this.mat4.multiply(groupMatrix, rotationMatrix);
    groupMatrix = this.mat4.multiply(groupMatrix, translationMatrix);

    let finalTransformMatrix = this.mat4.multiply(globalTransformMatrix, groupMatrix);
    gl.uniformMatrix4fv(transform, gl.FALSE, new Float32Array(finalTransformMatrix));

    this.children.forEach(child => {
      child?.draw(gl, finalTransformMatrix, vertexPosition, vertexColor, transform)
    })
  }

}

export { Object, ObjectGroup }