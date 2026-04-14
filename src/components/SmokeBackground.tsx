import { useEffect, useRef } from 'react';

const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color;
uniform vec2 u_pointer;

#define FC gl_FragCoord.xy
#define R resolution
#define T (time + 660.)

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);} 
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);} 
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1.,-1.2,.2,1.2)*2.;a*=.5;}return t;}

void main(){
  vec2 baseUv=(FC-.5*R)/R.y;
  vec3 col=vec3(1.);
  vec2 pointerBase=(u_pointer-.5*R)/R.y;

  vec2 uv=baseUv;
  vec2 pointer=pointerBase;
  uv.x+=.25;
  pointer.x+=.25;
  uv*=vec2(2.,1.);
  pointer*=vec2(2.,1.);

  vec2 delta=uv-pointer;
  float cursorDist=length(delta)+1e-4;
  float cursorField=exp(-cursorDist*6.5);
  vec2 dir=delta/cursorDist;
  vec2 localPush=dir*(0.22*cursorField);
  vec2 localSwirl=vec2(-dir.y, dir.x)*(0.05*cursorField*sin(T*0.9+cursorDist*8.));
  vec2 flowUv=uv+localPush+localSwirl;

  float n=fbm(flowUv*.28-vec2(T*.01,0.));
  n=noise(flowUv*3.+n*2.);
  flowUv += vec2(cos(T*0.35 + flowUv.y*2.5), sin(T*0.3 + flowUv.x*2.0)) * (0.03 * cursorField);

  col.r-=fbm(flowUv+vec2(0.,T*.015)+n);
  col.g-=fbm(flowUv*1.003+vec2(0.,T*.015)+n+.003);
  col.b-=fbm(flowUv*1.006+vec2(0.,T*.015)+n+.006);

  col += u_color * (cursorField * 0.06);

  col=mix(col, u_color, dot(col,vec3(.21,.71,.07)));
  col=mix(vec3(.08),col,min(time*.1,1.));
  col=clamp(col,.08,1.);
  O=vec4(col,1.);
}`;

interface ProgramWithUniforms extends WebGLProgram {
  resolution?: WebGLUniformLocation | null;
  time?: WebGLUniformLocation | null;
  u_color?: WebGLUniformLocation | null;
  u_pointer?: WebGLUniformLocation | null;
}

class Renderer {
  private readonly vertexSrc = "#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}";
  private readonly vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private program: ProgramWithUniforms | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private color: [number, number, number] = [0.45, 0.7, 0.95];
  private pointer: [number, number] = [0, 0];
  private colorDirty = true;
  private pointerDirty = true;
  private resolutionDirty = true;
  private lastWidth = 0;
  private lastHeight = 0;

  constructor(canvas: HTMLCanvasElement, fragmentSource: string) {
    const gl = canvas.getContext('webgl2', {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      throw new Error('WebGL2 is not supported in this browser.');
    }

    this.canvas = canvas;
    this.gl = gl;
    this.setup(fragmentSource);
    this.init();
  }

  updateColor(newColor: [number, number, number]) {
    if (
      this.color[0] === newColor[0] &&
      this.color[1] === newColor[1] &&
      this.color[2] === newColor[2]
    ) {
      return;
    }
    this.color = newColor;
    this.colorDirty = true;
  }

  updateScale() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    const nextWidth = Math.max(1, Math.floor(width * dpr));
    const nextHeight = Math.max(1, Math.floor(height * dpr));
    if (nextWidth === this.lastWidth && nextHeight === this.lastHeight) {
      return;
    }

    this.canvas.width = nextWidth;
    this.canvas.height = nextHeight;
    this.lastWidth = nextWidth;
    this.lastHeight = nextHeight;
    this.pointer = [nextWidth * 0.5, nextHeight * 0.5];
    this.pointerDirty = true;
    this.resolutionDirty = true;
    this.gl.viewport(0, 0, nextWidth, nextHeight);
  }

  updatePointer(nextPointer: [number, number]) {
    if (
      this.pointer[0] === nextPointer[0] &&
      this.pointer[1] === nextPointer[1]
    ) {
      return;
    }
    this.pointer = nextPointer;
    this.pointerDirty = true;
  }

  private compile(shader: WebGLShader, source: string) {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`Shader compilation error: ${gl.getShaderInfoLog(shader) ?? 'unknown error'}`);
    }
  }

  reset() {
    const { gl, program, vs, fs, buffer } = this;
    if (!program) return;
    if (buffer) gl.deleteBuffer(buffer);
    if (vs) {
      gl.detachShader(program, vs);
      gl.deleteShader(vs);
    }
    if (fs) {
      gl.detachShader(program, fs);
      gl.deleteShader(fs);
    }
    gl.deleteProgram(program);
    this.program = null;
  }

  private setup(fragmentSource: string) {
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram() as ProgramWithUniforms | null;

    if (!this.vs || !this.fs || !program) {
      throw new Error('Failed to initialize WebGL shaders.');
    }

    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, fragmentSource);

    this.program = program;
    gl.attachShader(program, this.vs);
    gl.attachShader(program, this.fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`Program linking error: ${gl.getProgramInfoLog(program) ?? 'unknown error'}`);
    }
  }

  private init() {
    const { gl, program } = this;
    if (!program) return;

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    program.resolution = gl.getUniformLocation(program, 'resolution');
    program.time = gl.getUniformLocation(program, 'time');
    program.u_color = gl.getUniformLocation(program, 'u_color');
    program.u_pointer = gl.getUniformLocation(program, 'u_pointer');
  }

  render(now = 0) {
    const { gl, program, buffer, canvas } = this;
    if (!program || !gl.isProgram(program)) return;

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    if (program.resolution && this.resolutionDirty) {
      gl.uniform2f(program.resolution, canvas.width, canvas.height);
      this.resolutionDirty = false;
    }
    if (program.time) gl.uniform1f(program.time, now * 1e-3);
    if (program.u_color && this.colorDirty) {
      gl.uniform3fv(program.u_color, this.color);
      this.colorDirty = false;
    }
    if (program.u_pointer && this.pointerDirty) {
      gl.uniform2f(program.u_pointer, this.pointer[0], this.pointer[1]);
      this.pointerDirty = false;
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

const hexToRgb = (hex: string): [number, number, number] | null => {
  const normalized = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

  return [
    parseInt(normalized.slice(0, 2), 16) / 255,
    parseInt(normalized.slice(2, 4), 16) / 255,
    parseInt(normalized.slice(4, 6), 16) / 255,
  ];
};

interface SmokeBackgroundProps {
  smokeColor?: string;
  className?: string;
}

export default function SmokeBackground({
  smokeColor = '#52b9f5',
  className,
}: SmokeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId = 0;
    let observer: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let resizeHandler: (() => void) | null = null;
    let visibilityHandler: (() => void) | null = null;
    let reducedMotionMedia: MediaQueryList | null = null;
    let pointerMoveHandler: ((event: PointerEvent) => void) | null = null;
    let pointerLeaveHandler: (() => void) | null = null;
    let running = false;
    let pointerTarget = { x: 0, y: 0 };
    let pointerCurrent = { x: 0, y: 0 };

    const clamp = (value: number, min: number, max: number) => {
      return Math.min(max, Math.max(min, value));
    };

    try {
      const renderer = new Renderer(canvas, fragmentShaderSource);
      rendererRef.current = renderer;

      reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

      resizeHandler = () => renderer.updateScale();
      resizeHandler();

      observer = new ResizeObserver(resizeHandler);
      observer.observe(canvas);
      window.addEventListener('resize', resizeHandler);

      const resetPointerToCenter = () => {
        const centerX = canvas.width * 0.5;
        const centerY = canvas.height * 0.5;
        pointerTarget = { x: centerX, y: centerY };
        pointerCurrent = { x: centerX, y: centerY };
        renderer.updatePointer([centerX, centerY]);
      };
      resetPointerToCenter();

      pointerMoveHandler = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        const x = clamp((event.clientX - rect.left) / rect.width, 0, 1) * canvas.width;
        const y = (1 - clamp((event.clientY - rect.top) / rect.height, 0, 1)) * canvas.height;
        pointerTarget = { x, y };
      };

      pointerLeaveHandler = () => {
        pointerTarget = { x: canvas.width * 0.5, y: canvas.height * 0.5 };
      };

      window.addEventListener('pointermove', pointerMoveHandler, { passive: true });
      window.addEventListener('pointerout', pointerLeaveHandler);

      let isIntersecting = true;
      intersectionObserver = new IntersectionObserver((entries) => {
        isIntersecting = entries[0].isIntersecting;
        if (visibilityHandler) visibilityHandler();
      }, { threshold: 0 });
      intersectionObserver.observe(canvas);

      const loop = (now: number) => {
        pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.1;
        pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.1;
        renderer.updatePointer([pointerCurrent.x, pointerCurrent.y]);
        renderer.render(now);
        animationFrameId = window.requestAnimationFrame(loop);
      };

      const start = () => {
        if (running) return;
        running = true;
        animationFrameId = window.requestAnimationFrame(loop);
      };

      const stop = () => {
        if (!running) return;
        running = false;
        window.cancelAnimationFrame(animationFrameId);
      };

      visibilityHandler = () => {
        const reducedMotion = reducedMotionMedia?.matches ?? false;
        if (document.visibilityState === 'visible' && !reducedMotion && isIntersecting) {
          start();
        } else {
          stop();
          if (!isIntersecting) {
            // retain current frame, just don't schedule next
          } else {
            renderer.render(0);
          }
        }
      };

      document.addEventListener('visibilitychange', visibilityHandler);
      visibilityHandler();
    } catch (error) {
      console.error(error);
    }

    return () => {
      if (observer) observer.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();
      window.cancelAnimationFrame(animationFrameId);
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      if (pointerMoveHandler) window.removeEventListener('pointermove', pointerMoveHandler);
      if (pointerLeaveHandler) window.removeEventListener('pointerout', pointerLeaveHandler);
      if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler);
      rendererRef.current?.reset();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    const rgb = hexToRgb(smokeColor);
    if (rgb) {
      renderer.updateColor(rgb);
    }
  }, [smokeColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? 'w-full h-full block'}
    />
  );
}
