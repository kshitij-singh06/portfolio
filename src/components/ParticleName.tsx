import { useEffect, useRef } from "react"

interface Vector2D {
  x: number
  y: number
}

// Physics always ticks at this fixed rate (60 fps).
// On a 144 Hz display, ~2–3 render frames share one physics tick.
// On a 30 Hz display, ~2 physics ticks happen per render frame.
// Either way the animation takes the same real-world time to complete.
const PHYSICS_DT = 1000 / 60 // ~16.67 ms

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
  settled = false   // true once snapped to target — no more physics

  startColor = { r: 255, g: 255, b: 255 }
  targetColor = { r: 34, g: 211, b: 238 }
  colorWeight = 0
  colorBlendRate = 0.08

  // Always called once per PHYSICS_DT tick.
  move() {
    // Already snapped — nothing to do.
    if (this.settled) return

    const dx = this.target.x - this.pos.x
    const dy = this.target.y - this.pos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Snap-and-lock: if the particle is very close to its target AND nearly
    // stationary, freeze it exactly on the target and stop all physics.
    // This prevents the residual-velocity jitter that's especially visible
    // on mobile (where large frame gaps cause many accumulated ticks at once).
    const speed = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y)
    if (distance < 1.5 && speed < 1.0) {
      this.pos.x = this.target.x
      this.pos.y = this.target.y
      this.vel.x = 0
      this.vel.y = 0
      this.colorWeight = 1.0
      this.settled = true
      return
    }

    let proximityMult = 1
    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget
    }

    const towardsTarget = { x: dx, y: dy }

    const magnitude = Math.sqrt(
      towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y
    )
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

    // Color blend lives in the physics tick so it advances at the same
    // real-world rate on every device.
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const r = Math.round(
      this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight
    )
    const g = Math.round(
      this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight
    )
    const b = Math.round(
      this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight
    )

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
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
        r: Math.round(
          this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight
        ),
        g: Math.round(
          this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight
        ),
        b: Math.round(
          this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight
        ),
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

  // Fixed-timestep state
  const lastTimeRef = useRef<number | null>(null)
  const accumulatorRef = useRef(0)

  // Cross-fade state
  const fadingRef      = useRef(false)
  const fadeStartRef   = useRef(0)
  const settledTimeRef = useRef(0)  // when allSettled first became true
  const dotsHoldRef   = useRef(0)  // when text reached full opacity (dots hold start)
  const dotsFadeRef   = useRef(0)  // when dots started fading out
  const HOLD_DURATION  = 600  // ms — frozen dots before text fades in
  const FADE_DURATION  = 400  // ms — text fade-in
  const DOTS_HOLD      = 600  // ms — both layers visible after text is solid
  const DOTS_FADE      = 400  // ms — dots fade out

  // Stored so drawSolidText can reproduce the exact same layout
  const textSettingsRef = useRef({ fontSize: 60, cx: 0, cy: 0 })

  const PADDING = 100
  const pixelSteps = 5
  const name = "Kshitij Singh"

  // Draws the final solid gradient text — called during and after the fade.
  const drawSolidText = (ctx: CanvasRenderingContext2D, canvasW: number, canvasH: number) => {
    const { fontSize, cx, cy } = textSettingsRef.current
    const grad = ctx.createLinearGradient(0, 0, canvasW, 0)
    grad.addColorStop(0, "rgb(34,  211, 238)")  // cyan-400
    grad.addColorStop(1, "rgb(139,  92, 246)")  // violet-500
    ctx.fillStyle = grad
    ctx.font = `bold ${fontSize}px Inter, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(name, cx, cy)
  }

  const initParticles = (canvas: HTMLCanvasElement, containerW: number, _containerH: number) => {
    const visibleCX = canvas.width / 2
    const visibleCY = canvas.height / 2

    const offscreenCanvas = document.createElement("canvas")
    offscreenCanvas.width = canvas.width
    offscreenCanvas.height = canvas.height
    const offscreenCtx = offscreenCanvas.getContext("2d", { willReadFrequently: true })!

    const fontSize = Math.min(containerW / 8, 100)
    // Store settings so drawSolidText can reproduce the same layout.
    textSettingsRef.current = { fontSize, cx: visibleCX, cy: visibleCY }

    offscreenCtx.fillStyle = "white"
    offscreenCtx.font = `bold ${fontSize}px Inter, sans-serif`
    offscreenCtx.textAlign = "center"
    offscreenCtx.textBaseline = "middle"
    offscreenCtx.fillText(name, visibleCX, visibleCY)

    const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    const isDark = document.documentElement.classList.contains("dark")
    const spawnColor = isDark
      ? { r: 255, g: 255, b: 255 }
      : { r: 14, g: 165, b: 233 }

    const particles = particlesRef.current
    let particleIndex = 0

    const coordsIndexes: number[] = []
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
      coordsIndexes.push(i)
    }

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
          particle.settled = false
          particleIndex++
        } else {
          particle = new Particle()
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

        particle.startColor = { ...spawnColor }

        const progress = x / canvas.width
        particle.targetColor = {
          r: Math.round(34 + (139 - 34) * progress),
          g: Math.round(211 + (92 - 211) * progress),
          b: Math.round(238 + (246 - 238) * progress),
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

  const animate = (timestamp: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const particles = particlesRef.current

    // --- Fixed-timestep accumulator ---
    // Measure real elapsed time since last frame, clamped to prevent a
    // massive physics jump if the tab was backgrounded.
    const elapsed =
      lastTimeRef.current !== null ? timestamp - lastTimeRef.current : PHYSICS_DT
    lastTimeRef.current = timestamp
    accumulatorRef.current += Math.min(elapsed, PHYSICS_DT * 3)

    // Drain the accumulator: run as many fixed-rate ticks as needed.
    // At 60 Hz → exactly 1 tick per frame.
    // At 144 Hz → 1 tick every ~2.4 frames (accumulator fills up gradually).
    // At 30 Hz  → 2 ticks per frame. Physics speed in real time is identical.
    while (accumulatorRef.current >= PHYSICS_DT) {
      for (const particle of particles) {
        particle.move()
      }
      accumulatorRef.current -= PHYSICS_DT
    }

    // --- Render current physics state ---
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let allSettled = true
    for (const particle of particles) {
      particle.draw(ctx)

      // A particle counts as settled if it has been snapped (settled flag)
      // OR is close enough and fully coloured.
      if (!particle.settled) {
        const dx = particle.pos.x - particle.target.x
        const dy = particle.pos.y - particle.target.y
        if (Math.sqrt(dx * dx + dy * dy) > 1.5 || particle.colorWeight < 1.0) {
          allSettled = false
        }
      }
    }

    if (allSettled && particles.length > 0) {
      if (!fadingRef.current && settledTimeRef.current === 0) {
        settledTimeRef.current = timestamp
      }

      const sinceSettled = timestamp - settledTimeRef.current

      // Phase 1 — hold dots only
      if (sinceSettled < HOLD_DURATION) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (const particle of particles) particle.draw(ctx)
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Phase 2 — fade text in (0 → 1) while dots stay visible underneath
      if (!fadingRef.current) {
        fadingRef.current = true
        fadeStartRef.current = timestamp
      }
      const textAlpha = Math.min((timestamp - fadeStartRef.current) / FADE_DURATION, 1.0)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const particle of particles) particle.draw(ctx)
      ctx.globalAlpha = textAlpha
      drawSolidText(ctx, canvas.width, canvas.height)
      ctx.globalAlpha = 1.0

      if (textAlpha < 1.0) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Phase 3 — hold both layers visible
      if (dotsHoldRef.current === 0) dotsHoldRef.current = timestamp
      if (timestamp - dotsHoldRef.current < DOTS_HOLD) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Phase 4 — fade dots out (1 → 0) while solid text stays at full opacity
      if (dotsFadeRef.current === 0) dotsFadeRef.current = timestamp
      const dotsAlpha = Math.max(1.0 - (timestamp - dotsFadeRef.current) / DOTS_FADE, 0.0)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Draw solid text at full opacity first (background layer)
      drawSolidText(ctx, canvas.width, canvas.height)
      // Draw dots on top with decreasing opacity
      ctx.globalAlpha = dotsAlpha
      for (const particle of particles) particle.draw(ctx)
      ctx.globalAlpha = 1.0

      if (dotsAlpha <= 0) {
        // Final state: clear canvas and draw only solid text
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawSolidText(ctx, canvas.width, canvas.height)
        return  // Loop stops — only crisp solid text remains
      }

      animationRef.current = requestAnimationFrame(animate)
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
      canvas.width = W + PADDING * 2
      canvas.height = H + PADDING * 2
      canvas.style.position = "absolute"
      canvas.style.left = `-${PADDING}px`
      canvas.style.top = `-${PADDING}px`
      canvas.style.width = `${canvas.width}px`
      canvas.style.height = `${canvas.height}px`

      particlesRef.current = []
      // Reset fixed-timestep state on resize so there's no phantom elapsed time.
      lastTimeRef.current = null
      accumulatorRef.current = 0

      initParticles(canvas, W, H)
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", updateSize)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-40 relative pointer-events-none"
      style={{ overflow: "visible" }}
    >
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  )
}
