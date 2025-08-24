import React, { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
}

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean;
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
            ${reverse ? 'u_reverse_active' : 'false'}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
  const uniforms = React.useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }

    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
    };
  }, [colors, opacities, totalSize, dotSize]);

  return (
    <Canvas
      className="h-full w-full"
      style={{ backgroundColor: "transparent" }}
      orthographic
    >
      <ShaderMaterial source={shader} uniforms={uniforms} maxFps={120} />
    </Canvas>
  );
};

const ShaderMaterial: React.FC<ShaderProps> = ({
  source,
  uniforms,
  maxFps = 60,
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh | null>(null);
  let lastFrameTime = 0;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    if (timestamp - lastFrameTime < 1 / maxFps) {
      return;
    }
    lastFrameTime = timestamp;
    
    const material = ref.current.material as THREE.ShaderMaterial;
    const extractedReverse = source.includes('u_reverse_active');
    const speedMatch = source.match(/animation_speed_factor_([\d.]+)_/);
    const speed = speedMatch ? parseFloat(speedMatch[1]) : 10;
    
    material.uniforms.u_time.value = extractedReverse
      ? 20 - (timestamp * speed) % 40
      : (timestamp * speed) % 40;
  });

  const material = React.useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: `
        precision mediump float;
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform vec3 u_colors[6];
        uniform float u_opacities[10];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform float u_time;
        uniform vec2 u_resolution;
        
        float circle(vec2 coord, float size, float blur) {
          float dist = length(coord);
          float c = smoothstep(size + blur, size - blur, dist);
          return c;
        }
        
        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          st.y = 1.0 - st.y;
          
          float aspectRatio = u_resolution.x / u_resolution.y;
          vec2 grid = vec2(u_total_size * aspectRatio, u_total_size);
          vec2 gridSt = st * grid;
          
          vec2 cellIndex = floor(gridSt);
          vec2 cellCenter = fract(gridSt) - 0.5;
          
          float minDim = min(u_resolution.x, u_resolution.y);
          float dotRadius = (u_dot_size / u_total_size) * 0.5;
          float scaleFactor = minDim / u_total_size;
          
          float dist = distance(st, vec2(0.5));
          float time = u_time * 0.5;
          
          float wave = sin(dist * 3.0 - time) * 0.5 + 0.5;
          wave = pow(wave, 2.0);
          
          float sizeVariation = mix(0.6, 1.0, wave);
          
          float c = circle(cellCenter, dotRadius * sizeVariation, 0.01) * 1.0;
          
          vec3 color = mix(u_colors[1], u_colors[4], wave);
          float opacity = mix(u_opacities[1], u_opacities[6], wave);
          
          gl_FragColor = vec4(color, c * opacity);
        }
      `,
      uniforms: {
        ...uniforms,
        u_time: { value: 0 },
        u_resolution: {
          value: new THREE.Vector2(size.width, size.height),
        },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    for (const uniformName in uniforms) {
      const uniform = uniforms[uniformName];
      switch (uniform.type) {
        case "uniform1f":
          mat.uniforms[uniformName] = { value: uniform.value as number };
          break;
        case "uniform3f":
          mat.uniforms[uniformName] = {
            value: new THREE.Vector3(
              ...(uniform.value as [number, number, number])
            ),
          };
          break;
        case "uniform1fv":
          mat.uniforms[uniformName] = { value: uniform.value as number[] };
          break;
        case "uniform3fv":
          mat.uniforms[uniformName] = {
            value: (uniform.value as number[][]).map(
              (v: any) => new THREE.Vector3(...v)
            ),
          };
          break;
        case "uniform2f":
          mat.uniforms[uniformName] = {
            value: new THREE.Vector2(
              ...(uniform.value as [number, number])
            ),
          };
          break;
        default:
          // Invalid uniform type
          break;
      }
    }

    return mat;
  }, [uniforms, size]);

  React.useEffect(() => {
    if (ref.current) {
      (ref.current.material as THREE.ShaderMaterial).uniforms.u_resolution.value = new THREE.Vector2(size.width, size.height);
    }
  }, [size]);

  const geometry = React.useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -1, -1, 0,
       1, -1, 0,
       1,  1, 0,
      -1, -1, 0,
       1,  1, 0,
      -1,  1, 0,
    ]);
    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    return geo;
  }, []);

  return <mesh ref={ref} geometry={geometry} material={material} />;
};

export default { CanvasRevealEffect };