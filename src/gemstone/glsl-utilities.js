/*
 * This is a set of utility functions that are common across many types of WebGL programs.
 * Don’t feel beholden to how this is structured---feel free to take it apart and rearrange
 * things into something that makes more sense to you.
 */

import Vector from "./Vector"

/**
 * Returns the WebGL rendering context.
 */
const getGL = canvas => canvas.getContext('webgl')

/**
 * Initializes a vertex buffer for the given array of vertices.
 */
const initVertexBuffer = (gl, vertices) => {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  return buffer
}

/**
 * Sets up a GLSL shader of the given type.
 */
const compileShader = (gl, shaderSource, shaderType, compileError) => {
  const shader = gl.createShader(shaderType)
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)

  // Check for an error.
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (compileError) {
      compileError(shader)
    }

    return null
  } else {
    return shader
  }
}

/**
 * Links a GLSL program.
 */
const linkShaderProgram = (gl, vertexShader, fragmentShader) => {
  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)
  return shaderProgram
}

/**
 * Initializes a simple shader program, using these parameters:
 *
 * - gl: The WebGL context to use.
 * - vertexShaderSource: The vertex shader source code.
 * - fragmentShaderSource: The fragment shader source code.
 *
 * Optional parameters:
 *
 * - compileError: The function to call if a shader does not compile.
 * - linkError: The function to call if the program does not link.
 */
const initSimpleShaderProgram = (gl, vertexShaderSource, fragmentShaderSource, compileError, linkError) => {
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER, compileError)
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER, compileError)

  // If either shader is null, we just bail out.  An error would have
  // been reported to the compileError function.
  if (!vertexShader || !fragmentShader) {
    return null
  }

  // Link the shader program.
  const shaderProgram = linkShaderProgram(gl, vertexShader, fragmentShader)
  if (gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    return shaderProgram
  }

  // If we get here, something must have gone wrong.
  if (linkError) {
    linkError(shaderProgram)
  }

  return null
}

const computeFaceNormals = protoGeometry =>
  protoGeometry.facesByIndex.map(face => {
    // Compute the triangle normal...
    const p0 = new Vector(...protoGeometry.vertices[face[0]])
    const p1 = new Vector(...protoGeometry.vertices[face[1]])
    const p2 = new Vector(...protoGeometry.vertices[face[2]])

    const v1 = p1.subtract(p0)
    const v2 = p2.subtract(p0)

    // Formula from book "Real-time 3D Graphics" "Normals" section.
    return v1.cross(v2)
  })

const computeTriangleNormals = protoGeometry => {
  const result = []

  // For every triangle...
  protoGeometry.facesByIndex.forEach((face, faceIndex) => {
    const N = protoGeometry.faceNormals[faceIndex]

    // Every vertex in the triangle gets the same normal.
    result.push(...N.elements)
    result.push(...N.elements)
    result.push(...N.elements)
  })

  return result
}

const computeVertexNormals = protoGeometry => {
  const result = []

  // For every triangle...
  protoGeometry.facesByIndex.forEach(face => {
    // For every vertex in that triangle...
    face.forEach(vertexIndex => {
      let totalVector = new Vector(0, 0, 0)

      // Grab every face the vertex is in.
      protoGeometry.facesByIndex.forEach((face, faceIndex) => {
        if (face.includes(vertexIndex)) {
          totalVector = totalVector.add(protoGeometry.faceNormals[faceIndex])
        }
      })

      result.push(...totalVector.unit.elements)
    })
  })

  return result
}

export { getGL, initVertexBuffer, compileShader, linkShaderProgram, initSimpleShaderProgram, computeTriangleNormals, computeVertexNormals, computeFaceNormals }
