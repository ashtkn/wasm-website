import('../wasm/mandelbrot/pkg/mandelbrot')
  .catch((err) => {
    console.error(err)
  })
  .then((modules) => {
    if (!modules) return
    const { greet } = modules
    greet()
  })
