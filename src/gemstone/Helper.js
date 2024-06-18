/**
 * Utility function for turning our nascent geometry object into a “raw” coordinate array
 * arranged as triangles.
 */
const toRawTriangleArray = protoGeometry => {
  const result = []

  protoGeometry.facesByIndex.forEach(face => {
    face.forEach(vertexIndex => {
      result.push(...protoGeometry.vertices[vertexIndex])
    })
  })

  return result
}

/*
 * Utility function for turning indexed vertices into a “raw” coordinate array
 * arranged as line segments.
 */
const toRawLineArray = protoGeometry => {
  const result = []

  protoGeometry.facesByIndex.forEach(face => {
    // Oddly enough, the inner loop here is clearer as a `for` loop because we
    // need to access the current vertex index and the one after that (wrapping
    // around once we get to the end).
    for (let i = 0, maxI = face.length; i < maxI; i += 1) {
      // “Connect the dots.”
      result.push(
        ...protoGeometry.vertices[face[i]],
        ...protoGeometry.vertices[face[(i + 1) % maxI]] // Lets us wrap around to 0.
      )
    }
  })

  return result
}

export { toRawTriangleArray, toRawLineArray }