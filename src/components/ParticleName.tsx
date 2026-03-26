import { useEffect, useRef } from "react"

interface Vector2D {
  x: number
  y: number
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 }
  vel: Vector2D = { x: 0, y: 0 }
  acc: Vector2D = { x: 0, y: 0 }
  target: Vector2D = { x: 0, y: 0 }

  closeEnoughTarget = 50
  maxSpeed = 5.0
  maxForce = 0.5
  particleSize = 5
  isKilled = false

  startColor = { r: 255, g: 255, b: 255 }
  targetColor = { r: 34, g: 211, b: 238 } // cyan-400
  colorWeight = 0
  colorBlendRate = 0.08

  move() {
    let proximityMult = 1
    const distance = Math.sqrt(Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2))

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    }

    const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y)
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    }

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y)
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce
      steer.y = (steer.y / steerMagnitude) * this.maxForce
    }

    this.acc.x += steer.x
    this.acc.y += steer.y

    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    }

    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    }

    ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2)
    ctx.fill()
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      const angle = Math.random() * Math.PI * 2
      const mag = (width + height) / 2
      this.target.x = width / 2 + Math.cos(angle) * mag
      this.target.y = height / 2 + Math.sin(angle) * mag

      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0
      this.isKilled = true
    }
  }
}

export function ParticleName() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])

  // Small padding — particles spread just beyond the text, not the whole screen
  const PADDING = 100

  const pixelSteps = 5
  const name = "Kshitij Singh"

  const initParticles = (canvas: HTMLCanvasElement, containerW: number, _containerH: number) => {
    // The visible text occupies the inner area of the padded canvas
    const visibleCX = canvas.width / 2   // = containerW/2 + PADDING
    const visibleCY = canvas.height / 2  // = containerH/2 + PADDING

    const offscreenCanvas = document.createElement("canvas")
    offscreenCanvas.width = canvas.width
    offscreenCanvas.height = canvas.height
    const offscreenCtx = offscreenCanvas.getContext("2d", { willReadFrequently: true })!

    // Scale font to the visible (container) width, not the full padded canvas
    const fontSize = Math.min(containerW / 8, 100)
    offscreenCtx.fillStyle = "white"
    offscreenCtx.font = `bold ${fontSize}px Inter, sans-serif`
    offscreenCtx.textAlign = "center"
    offscreenCtx.textBaseline = "middle"
    offscreenCtx.fillText(name, visibleCX, visibleCY)

    const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    // Detect theme: particles need a visible start color in light mode
    const isDark = document.documentElement.classList.contains('dark')
    // dark → white (#fff), light → vivid sky-blue (#0ea5e9) so particles show up
    const spawnColor = isDark
      ? { r: 255, g: 255, b: 255 }
      : { r: 14, g: 165, b: 233 }

    const particles = particlesRef.current
    let particleIndex = 0

    const coordsIndexes: number[] = []
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
      coordsIndexes.push(i)
    }

    // Shuffle for fluid motion
    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]]
    }

    for (const coordIndex of coordsIndexes) {
      const alpha = pixels[coordIndex + 3]

      if (alpha > 128) {
        const x = (coordIndex / 4) % canvas.width
        const y = Math.floor(coordIndex / 4 / canvas.width)

        let particle: Particle
        if (particleIndex < particles.length) {
          particle = particles[particleIndex]
          particle.isKilled = false
          particleIndex++
        } else {
          particle = new Particle()
          // Spawn close to the text area — within ~1.5x the visible box
          const angle = Math.random() * Math.PI * 2
          const mag = Math.max(canvas.width, canvas.height) * 0.3
          particle.pos.x = canvas.width / 2 + Math.cos(angle) * mag
          particle.pos.y = canvas.height / 2 + Math.sin(angle) * mag

          particle.maxSpeed = Math.random() * 6 + 8
          particle.maxForce = particle.maxSpeed * 0.15
          particle.particleSize = Math.random() * 2 + 3
          particle.colorBlendRate = Math.random() * 0.04 + 0.04
          particles.push(particle)
        }

        // Set theme-aware spawn color
        particle.startColor = { ...spawnColor }

        // Gradient coloring: cyan to violet
        const progress = x / canvas.width
        particle.targetColor = {
          r: Math.round(34 + (139 - 34) * progress), // 34 -> 139 (violet-400 roughly)
          g: Math.round(211 + (92 - 211) * progress), // 211 -> 92
          b: Math.round(238 + (246 - 238) * progress), // 238 -> 246
        }
        particle.colorWeight = 0
        particle.target.x = x
        particle.target.y = y
      }
    }

    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(canvas.width, canvas.height)
    }
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const particles = particlesRef.current

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let allSettled = true

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]
      particle.move()
      particle.draw(ctx)

      // Check if this particle is close enough to its target
      const dx = particle.pos.x - particle.target.x
      const dy = particle.pos.y - particle.target.y
      if (Math.sqrt(dx * dx + dy * dy) > 1.5 || particle.colorWeight < 1.0) {
        allSettled = false
      }
    }

    // Once every particle has landed, stop the loop — name stays frozen
    if (allSettled && particles.length > 0) {
      return
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const updateSize = () => {
      const W = container.clientWidth
      const H = container.clientHeight
      canvas.width  = W + PADDING * 2
      canvas.height = H + PADDING * 2
      // Position the canvas so it overflows equally on all sides
      canvas.style.position = 'absolute'
      canvas.style.left = `-${PADDING}px`
      canvas.style.top  = `-${PADDING}px`
      canvas.style.width  = `${canvas.width}px`
      canvas.style.height = `${canvas.height}px`
      particlesRef.current = []
      initParticles(canvas, W, H)
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    animate()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", updateSize)
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-40 relative pointer-events-none" style={{ overflow: 'visible' }}>
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  )
}
