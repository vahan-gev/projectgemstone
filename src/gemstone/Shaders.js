const VERTEX_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  attribute vec3 vertexPosition;
  attribute vec3 vertexColor;
  attribute vec3 vertexNormal;

  uniform mat4 transform;
  uniform mat4 cameraMatrix;
  uniform mat4 projectionMatrix;
  uniform vec3 lightDirection;
  uniform vec3 lightPosition;

  varying vec4 pixelVertexColor;

  void main(void) {
      // Hardcoded ambient light
      vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      vec4 transformedNormal = vec4(mat3(transform) * vertexNormal, 1.0);
      vec4 vertexPosition4 = vec4(vertexPosition, 1.0);
      vec3 lightDir = normalize(lightPosition - vec3(transform * vertexPosition4));

      float diffuse = max(dot(normalize(vec3(transformedNormal)), lightDir), 0.0);

      gl_Position = projectionMatrix * cameraMatrix * transform * vertexPosition4;
      pixelVertexColor = vec4((ambientLight + diffuse) * vertexColor, 1.0);
  }

`

const FRAGMENT_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec3 color;

  varying vec4 pixelVertexColor;

  void main(void) {
    gl_FragColor = pixelVertexColor;
  }
`
export { FRAGMENT_SHADER, VERTEX_SHADER }