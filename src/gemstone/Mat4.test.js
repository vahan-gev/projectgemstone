import { Mat4 } from './Mat4';

describe('Mat4 Class', () => {

  describe('Initialization & Identity Matrix', () => {
    const identityMatrix = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];

    test('is initialized with an identity matrix', () => {
      const mat = new Mat4();
      expect(mat.matrix).toEqual(identityMatrix);
    });

    test('createIdentity produces an identity matrix', () => {
      const mat = new Mat4();
      expect(mat.createIdentity()).toEqual(identityMatrix);
    });
  });

  describe('Matrix Multiplication', () => {
    test('multiplying with identity matrix retains original matrix', () => {
      const mat = new Mat4();
      const originalMatrix = mat.createTranslation(1, 2, 3);
      const identityMatrix = mat.createIdentity();
      const result = mat.multiply(originalMatrix, identityMatrix);
      expect(result).toEqual(originalMatrix);
    });

    test('multiplying two matrices', () => {
      const mat = new Mat4();
      const matrixA = mat.createTranslation(1, 2, 3);
      const matrixB = mat.createScaling(2, 3, 4);
      const expected = [
        2, 0, 0, 0,
        0, 3, 0, 0,
        0, 0, 4, 0,
        1, 2, 3, 1
      ];
      const result = mat.multiply(matrixB, matrixA);
      expect(result).toEqual(expected);
    });
  });

  describe('Translation Matrix', () => {
    test('createTranslation returns the correct matrix', () => {
      const mat = new Mat4();
      const tx = 5, ty = 10, tz = 15;
      expect(mat.createTranslation(tx, ty, tz)).toEqual([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1,
      ]);
    });
  });

  describe('Scaling Matrix', () => {
    test('createScaling returns the correct matrix', () => {
      const mat = new Mat4();
      const sx = 2, sy = 3, sz = 4;
      expect(mat.createScaling(sx, sy, sz)).toEqual([
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1,
      ]);
    });
  });

  describe('Rotation Matrix', () => {
    test('createRotation returns the correct matrix for X-axis rotation', () => {
      const mat = new Mat4();
      const angle = 90;
      const result = mat.createRotation(angle, 1, 0, 0);
      const expected = [
        1, 0, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 0,
        0, 0, 0, 1,
      ];

      result.forEach((value, index) => {
        if (typeof value === 'number' && typeof expected[index] === 'number') {
          expect(value).toBeCloseTo(expected[index]);
        } else {
          expect(value).toEqual(expected[index]);
        }
      });
    });

    test('createRotation returns the correct matrix for Y-axis rotation', () => {
      const mat = new Mat4();
      const angle = 90;
      const result = mat.createRotation(angle, 0, 1, 0);
      const expected = [
        0, 0, -1, 0,
        0, 1, 0, 0,
        1, 0, 0, 0,
        0, 0, 0, 1,
      ];

      result.forEach((value, index) => {
        if (typeof value === 'number' && typeof expected[index] === 'number') {
          expect(value).toBeCloseTo(expected[index]);
        } else {
          expect(value).toEqual(expected[index]);
        }
      });
    });

    test('createRotation returns the correct matrix for Z-axis rotation', () => {
      const mat = new Mat4();
      const angle = 90;
      const result = mat.createRotation(angle, 0, 0, 1);
      const expected = [
        0, 1, 0, 0,
        -1, 0, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ];

      result.forEach((value, index) => {
        if (typeof value === 'number' && typeof expected[index] === 'number') {
          expect(value).toBeCloseTo(expected[index]);
        } else {
          expect(value).toEqual(expected[index]);
        }
      });
    });
  });


  describe('Orthographic Projection Matrix', () => {
    test('createOrthographic produces the correct matrix', () => {
      const mat = new Mat4();
      const left = -1, right = 1, bottom = -1, top = 1, near = 0.1, far = 100;
      const expected = [
        2 / (right - left), 0, 0, 0,
        0, 2 / (top - bottom), 0, 0,
        0, 0, -2 / (far - near), 0,
        -(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1,
      ];
      expect(mat.createOrthographic(left, right, bottom, top, near, far)).toEqual(expected);
    });
  });

  describe('Perspective Projection Matrix', () => {
    test('createPerspective produces the correct matrix', () => {
      const mat = new Mat4();
      const fov = 90;
      const aspect = 16 / 9;
      const near = 0.1;
      const far = 100;
      const f = 1.0 / Math.tan((fov / 2) * Math.PI / 180);
      const expected = [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) / (near - far), -1,
        0, 0, (2 * far * near) / (near - far), 0,
      ];
      const result = mat.createPerspective(fov, aspect, near, far);
      expect(result.map(num => parseFloat(num.toFixed(4)))).toEqual(expected.map(num => parseFloat(num.toFixed(4))));
    });
  });

});
