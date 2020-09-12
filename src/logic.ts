const getNDiverged = (x0: number, y0: number, maxIter: number): number => {
  let xn = 0.0
  let yn = 0.0
  for (let i = 1; i < maxIter; i++) {
    const xNext = xn * xn - yn * yn + x0
    const yNext = 2.0 * xn * yn + y0
    xn = xNext
    yn = yNext
    if (yn * yn + xn * xn > 4.0) {
      return i
    }
  }
  return maxIter
}

export const generateMandelbrotSet = (
  canvasWidth: number,
  canvasHeight: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  maxIter: number
): Uint8Array => {
  const data = []
  for (let i = 0; i < canvasHeight; i++) {
    const y = yMin + ((yMax - yMin) * i) / canvasHeight
    for (let j = 0; j < canvasWidth; j++) {
      const x = xMin + ((xMax - xMin) * j) / canvasWidth
      const iterIndex = getNDiverged(x, y, maxIter)
      const v = (iterIndex % 8) * 32
      data.push(v) // R
      data.push(v) // G
      data.push(v) // B
      data.push(255) // A
    }
  }
  return new Uint8Array(data)
}
