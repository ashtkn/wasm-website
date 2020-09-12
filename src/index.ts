import { drawMandelbrotSet as drawMandelbrotSetJs, MAX_ITER, X_MAX, X_MIN, Y_MAX, Y_MIN } from './drawer'
import { generateMandelbrotSet as generateMandelbrotSetJs } from './logic'

import('../wasm/mandelbrot/pkg/mandelbrot')
  .catch((err) => {
    console.error(err)
  })
  .then((modules) => {
    if (!modules) return
    const { generate_mandelbrot_set, draw_mandelbrot_set } = modules
    const generateMandelbrotSetWasm = (
      canvasWidth: number,
      canvasHeight: number,
      xMin: number,
      xMax: number,
      yMin: number,
      yMax: number,
      maxIter: number
    ) => generate_mandelbrot_set(canvasWidth, canvasHeight, xMin, xMax, yMin, yMax, maxIter)

    const drawMandelbrotSetWasm = () => draw_mandelbrot_set()

    return { generateMandelbrotSetWasm, drawMandelbrotSetWasm }
  })
  .then(({ generateMandelbrotSetWasm, drawMandelbrotSetWasm }) => {
    console.log('finished loading wasm')
    const renderButton = document.getElementById('render')
    renderButton.addEventListener('click', () => {
      {
        // generating and drawing with wasm
        drawMandelbrotSetWasm()
      }
      {
        // generating with wasm and drawing with js
        const canvas = document.getElementById('canvas_hybrid') as HTMLCanvasElement
        const context = canvas.getContext('2d')
        const canvasWidth = canvas.width
        const canvasHeight = canvas.height

        const wasmResult = generateMandelbrotSetWasm(canvasWidth, canvasHeight, X_MIN, X_MAX, Y_MIN, Y_MAX, MAX_ITER)

        const drawStartTime = Date.now()
        drawMandelbrotSetJs(context, canvasWidth, canvasHeight, wasmResult)
        const drawElapsedTime = Date.now() - drawStartTime

        console.log(`draw:js: ${drawElapsedTime}ms`)
      }
      {
        // generating and drawing with js
        const canvas = document.getElementById('canvas_js') as HTMLCanvasElement
        const context = canvas.getContext('2d')
        const canvasWidth = canvas.width
        const canvasHeight = canvas.height

        const generateStartTime = Date.now()
        const jsResult = generateMandelbrotSetJs(canvasWidth, canvasHeight, X_MIN, X_MAX, Y_MIN, Y_MAX, MAX_ITER)
        const generateElapsedTime = Date.now() - generateStartTime

        const drawStartTime = Date.now()
        drawMandelbrotSetJs(context, canvasWidth, canvasHeight, jsResult)
        const drawElapsedTime = Date.now() - drawStartTime

        console.log(`generate:js: ${generateElapsedTime}ms`)
        console.log(`draw:js: ${drawElapsedTime}ms`)
      }
    })
  })
