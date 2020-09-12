import draw, { MAX_ITER, X_MAX, X_MIN, Y_MAX, Y_MIN } from './drawer'

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
      // draw with wasm
      {
        console.log('start generating drawing with wasm')
        drawMandelbrotSetWasm()
      }
      // draw with hybrid
      {
        console.log('start generating with wasm and drawing with js')
        const CANVAS_ID = 'canvas_hybrid'
        const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement
        const context = canvas.getContext('2d')
        const canvasWidth = canvas.width
        const canvasHeight = canvas.height

        const generateStartTime = Date.now()
        const wasmResult = generateMandelbrotSetWasm(canvasWidth, canvasHeight, X_MIN, X_MAX, Y_MIN, Y_MAX, MAX_ITER)
        const generateElapsedTime = Date.now() - generateStartTime
        const drawStartTime = Date.now()
        draw(context, canvasWidth, canvasHeight, wasmResult)
        const drawElapsedTime = Date.now() - drawStartTime
        console.log(`\tgenerated:wasm\tgenerate_elapsed:${generateElapsedTime}ms`)
        console.log(`\tdraw:  js\tdraw_elapsed:${drawElapsedTime}ms`)
      }
    })
  })
