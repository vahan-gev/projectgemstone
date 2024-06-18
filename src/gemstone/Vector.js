/**
 * This JavaScript module defines a Vector object and associated functions.
 *
 * The module’s approach is non-destructive: methods always return new
 * Vector objects and never modify the operands. This is a design choice.
 *
 * The module is designed for vectors of any number of dimensions. The
 * implementations are generalized but not optimal for certain sizes of
 * vectors. Specific Vector2D and Vector3D implementations can be much
 * more compact, while sacrificing generality.
 */

/**
 * A private method for checking dimensions, throwing an exception when different.
 */
const checkDimensions = (v1, v2) => {
  if (v1.dimensions !== v2.dimensions) {
    throw Object.assign(
      new Error('Vectors have different dimensions'),
      { code: 402 }
    );
  }
}

// Define the class.
class Vector {
  constructor() {
    this.elements = [].slice.call(arguments)
  }

  get dimensions() {
    return this.elements.length
  }

  get x() {
    return this.elements[0]
  }

  set x(value) {
    this.elements[0] = value
  }

  get y() {
    return this.elements[1]
  }

  set y(value) {
    this.elements[1] = value
  }

  get z() {
    return this.elements[2]
  }

  set z(value) {
    this.elements[2] = value
  }

  get w() {
    return this.elements[3]
  }

  set w(value) {
    this.elements[3] = value
  }

  add(v) {
    let result = new Vector()

    checkDimensions(this, v)

    for (let i = 0, max = this.dimensions; i < max; i += 1) {
      result.elements[i] = this.elements[i] + v.elements[i]
    }

    return result
  }

  subtract(v) {
    let result = new Vector()

    checkDimensions(this, v)

    for (let i = 0, max = this.dimensions; i < max; i += 1) {
      result.elements[i] = this.elements[i] - v.elements[i]
    }

    return result
  }

  multiply(s) {
    let result = new Vector()

    for (let i = 0, max = this.dimensions; i < max; i += 1) {
      result.elements[i] = this.elements[i] * s
    }

    return result
  }

  divide(s) {
    let result = new Vector()

    for (let i = 0, max = this.dimensions; i < max; i += 1) {
      result.elements[i] = this.elements[i] / s
    }

    return result
  }

  dot(v) {
    let result = 0

    checkDimensions(this, v)

    for (let i = 0, max = this.dimensions; i < max; i += 1) {
      result += this.elements[i] * v.elements[i]
    }

    return result
  }

  cross(v) {
    if (this.dimensions !== 3 || v.dimensions !== 3) {
      throw Object.assign(
        new Error('Cross product is for 3D vectors only.'),
        { code: 402 }
      );
    }

    // With 3D vectors, we can just return the result directly.
    return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x)
  }

  get magnitude() {
    return Math.sqrt(this.dot(this))
  }

  get unit() {
    // At this point, we can leverage our more "primitive" methods.
    return this.divide(this.magnitude)
  }

  // https://webglfundamentals.org/webgl/lessons/webgl-3d-camera.html
  normalize(v) {
    let length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (length > 0.00001) {
      return new Vector(v[0] / length, v[1] / length, v[2] / length);
    } else {
      return new Vector(0, 0, 0);
    }
  }

  projection(v) {
    checkDimensions(this, v)

    // Plug and chug :)
    // The projection of u onto v is u dot the unit vector of v
    // times the unit vector of v.
    let unitv = v.unit
    return unitv.multiply(this.dot(unitv))
  }
}

export default Vector
