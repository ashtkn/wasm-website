export const X_MIN = -1.5
export const X_MAX = 0.5
export const Y_MIN = -1.0
export const Y_MAX = 1.0
export const MAX_ITER = 64

export const drawMandelbrotSet = (
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  data: Uint8Array
): void => {
  const img = new ImageData(new Uint8ClampedArray(data), canvasWidth, canvasHeight)
  context.putImageData(img, 0, 0)
}
