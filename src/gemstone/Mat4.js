class Mat4 {
  constructor() {
    this.matrix = this.createIdentity();
  }

  createIdentity() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
  }

  createTranslation(tx, ty, tz) {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx, ty, tz, 1,
    ];
  }

  createScaling(sx, sy, sz) {
    return [
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, 1,
    ];
  }

  // Based on the original glRotate reference:
  // https://www.khronos.org/registry/OpenGL-Refpages/es1.1/xhtml/glRotate.xml
  createRotation(angle, x, y, z) {
    const axisLength = Math.sqrt(x * x + y * y + z * z);
    const s = Math.sin((angle * Math.PI) / 180.0);
    const c = Math.cos((angle * Math.PI) / 180.0);
    const oneMinusC = 1.0 - c;
    x /= axisLength;
    y /= axisLength;
    z /= axisLength;

    const x2 = x * x;
    const y2 = y * y;
    const z2 = z * z;
    const xy = x * y;
    const yz = y * z;
    const xz = x * z;
    const xs = x * s;
    const ys = y * s;
    const zs = z * s;

    return [
      x2 * oneMinusC + c,
      xy * oneMinusC + zs,
      xz * oneMinusC - ys,
      0.0,

      xy * oneMinusC - zs,
      y2 * oneMinusC + c,
      yz * oneMinusC + xs,
      0.0,

      xz * oneMinusC + ys,
      yz * oneMinusC - xs,
      z2 * oneMinusC + c,
      0.0,

      0.0,
      0.0,
      0.0,
      1.0
    ];
  }

  multiply(a, b) {
    let result = new Array(16);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        result[row * 4 + col] = 0;
        for (let i = 0; i < 4; i++) {
          result[row * 4 + col] += a[row * 4 + i] * b[i * 4 + col];
        }
      }
    }
    return result;
  }

  createOrthographic(left, right, bottom, top, near, far) {
    return [
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, -2 / (far - near), 0,
      -(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1,
    ];
  }

  createPerspective(fov, aspect, near, far) {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fov * Math.PI / 180);
    const rangeInv = 1.0 / (near - far);

    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0,
    ];
  }
}


export { Mat4 }
