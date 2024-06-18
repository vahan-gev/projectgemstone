import { getGL, initSimpleShaderProgram } from "./glsl-utilities"
import { Mat4 } from "./Mat4"
import { FRAGMENT_SHADER, VERTEX_SHADER } from "./Shaders"
import Vector from "./Vector"
class Universe {
  constructor(canvas, camera) {
    const gl = getGL(canvas)
    if (!gl) {
      console.log('[Universe.js] > No WebGL context found.')
      return
    }

    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0.0, 0.0, 0.0, 0.0)
    gl.viewport(0, 0, canvas.width, canvas.height)

    // Initialize the shaders.
    let abort = false
    const shaderProgram = initSimpleShaderProgram(
      gl,
      VERTEX_SHADER,
      FRAGMENT_SHADER,

      // Very cursory error-checking here...
      shader => {
        abort = true
        console.log('[Universe.js] > Shader problem: ' + gl.getShaderInfoLog(shader))
      },

      // Another simplistic error check: we don't even access the faulty
      // shader program.
      shaderProgram => {
        abort = true
        console.log('[Universe.js] > Could not link shaders.')
      }
    )

    if (abort) {
      console.log('[Universe.js] > Fatal errors encountered.')
      return
    }

    gl.useProgram(shaderProgram)


    this.gl = gl;
    this.canvas = canvas;
    this.shaderProgram = shaderProgram;
    this.vertexPosition = gl.getAttribLocation(this.shaderProgram, 'vertexPosition');
    this.gl.enableVertexAttribArray(this.vertexPosition);
    this.vertexColor = gl.getAttribLocation(this.shaderProgram, 'vertexColor')
    this.gl.enableVertexAttribArray(this.vertexColor)
    this.transform = gl.getUniformLocation(this.shaderProgram, 'transform')
    this.projectionMatrix = gl.getUniformLocation(this.shaderProgram, 'projectionMatrix')
    this.cameraLocation = gl.getUniformLocation(this.shaderProgram, 'cameraMatrix')

    this.vertexNormal = gl.getAttribLocation(this.shaderProgram, 'vertexNormal');
    this.gl.enableVertexAttribArray(this.vertexNormal)

    this.lightPositionUniform = gl.getUniformLocation(this.shaderProgram, 'lightPosition');
    this.lightDirectionUniform = gl.getUniformLocation(this.shaderProgram, 'lightDirection');

    this.position = { x: 0, y: 0, z: 0 };
    this.scale = { x: 1, y: 1, z: 1 };
    this.rotation = { x: 0, y: 0, z: 0 };
    this.lightPosition = new Vector(0, 20, 0);
    this.lightDirection = new Vector(1, 0, 0);
    this.normalizedLightDirection = this.lightDirection.normalize(this.lightDirection);
    this.camera = camera;
    this.mat4 = new Mat4()

    this.projectionMode = 'perspective'
    this.aspectRatio = this.canvas.width / this.canvas.height
    this.orthographicScale = 10;
    this.left = -this.orthographicScale * this.aspectRatio;
    this.right = this.orthographicScale * this.aspectRatio;
    this.top = this.orthographicScale;
    this.bottom = -this.orthographicScale;
  }

  draw(scene) {
    const gl = this.gl;
    gl.useProgram(this.shaderProgram);
    let transformMatrix = this.mat4.createIdentity();
    let scalingMatrix = this.mat4.createScaling(this.scale.x, this.scale.y, this.scale.z);

    let rotationMatrixX = this.mat4.createRotation(this.rotation.x, 1, 0, 0);
    let rotationMatrixY = this.mat4.createRotation(this.rotation.y, 0, 1, 0);
    let rotationMatrixZ = this.mat4.createRotation(this.rotation.z, 0, 0, 1);

    let rotationMatrix = this.mat4.multiply(rotationMatrixX, rotationMatrixY);
    rotationMatrix = this.mat4.multiply(rotationMatrix, rotationMatrixZ);

    let translationMatrix = this.mat4.createTranslation(this.position.x, this.position.y, this.position.z);

    transformMatrix = this.mat4.multiply(transformMatrix, scalingMatrix);
    transformMatrix = this.mat4.multiply(transformMatrix, rotationMatrix);
    transformMatrix = this.mat4.multiply(transformMatrix, translationMatrix);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform3fv(this.lightPositionUniform, [this.lightPosition.x, this.lightPosition.y, this.lightPosition.z]);
    gl.uniform3fv(this.lightDirectionUniform, [this.normalizedLightDirection.x, this.normalizedLightDirection.y, this.normalizedLightDirection.z]);

    gl.uniformMatrix4fv(this.projectionMatrix, gl.FALSE, new Float32Array(this.projectionMode === 'perspective' ? this.mat4.createPerspective(75, this.aspectRatio, 0.1, 1000) : this.mat4.createOrthographic(this.left, this.right, this.bottom, this.top, 0.1, 1000)));
    gl.uniformMatrix4fv(this.cameraLocation, gl.FALSE, new Float32Array(this.camera.matrix));
    gl.uniformMatrix4fv(this.transform, gl.FALSE, new Float32Array(transformMatrix));
    scene.forEach(object => {
      object.draw(gl, transformMatrix, this.vertexPosition, this.vertexColor, this.transform, this.vertexNormal);
    });

    gl.flush();
  }
}

export { Universe }