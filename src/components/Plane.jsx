import { useRef, useEffect } from 'react';
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uNoiseIntensity;
  uniform float uMountainHeight;
  
  // 3D Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // Distance from center
    float dist = length(pos.xy);
    
    // Create cone/mountain shape with flatter peak
    float mountainShape = max(0.0, 1.0 - dist / 5.0);
    mountainShape = pow(mountainShape, 1.5);
    
    // Flatten the peak - reduce height when very close to center
    float peakFlatten = smoothstep(0.0, 1.5, dist); // Flat within 1.5 units of center
    mountainShape *= mix(0.85, 1.0, peakFlatten); // Reduce peak height by 15%
    
    // Add noise only at the peak (where mountainShape is high)
    float noise = 0.0;
    if (mountainShape > 0.1) {
      noise += snoise(vec3(pos.x * 0.8, pos.y * 0.8, 0.0)) * 0.4;
      noise += snoise(vec3(pos.x * 1.5, pos.y * 1.5, 1.0)) * 0.2;
      noise += snoise(vec3(pos.x * 3.0, pos.y * 3.0, 2.0)) * 0.1;
    }
    
    // Combine: base mountain shape + noise at the top
    float elevation = mountainShape * uMountainHeight + noise * mountainShape * uNoiseIntensity;
    
    pos.z += elevation;
    vElevation = elevation;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform vec3 uColor;
  
  void main() {
    vec3 color = uColor;
    // Color based on elevation
    // color = mix(color, vec3(1.0), vElevation * 0.2);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function MovingLines({ lineColor, lineSpeed, lineCount, mountainHeight }) {
  const linesRef = useRef();
  const lineDataRef = useRef([]);
  const initializedRef = useRef(false);

  // Calculate elevation matching the shader
  const getElevation = (x, y) => {
    const dist = Math.sqrt(x * x + y * y);
    let mountainShape = Math.max(0, 1.0 - dist / 5.0);
    mountainShape = Math.pow(mountainShape, 1.5);
    return mountainShape * mountainHeight;
  };

  // Initialize line data immediately
  if (!initializedRef.current) {
    lineDataRef.current = Array(lineCount).fill(0).map((_, i) => ({
      angle: (i / lineCount) * Math.PI * 2,
      progress: 0,
    }));
    initializedRef.current = true;
  }

  useEffect(() => {
    // Reinitialize if lineCount changes with uniform distribution
    lineDataRef.current = Array(lineCount).fill(0).map((_, i) => ({
      angle: (i / lineCount) * Math.PI * 2,
      progress: 0,
    }));
  }, [lineCount]);

  useFrame((_, delta) => {
    if (!linesRef.current || lineDataRef.current.length === 0) return;

    const positions = linesRef.current.geometry.attributes.position.array;
    const minRadius = 2;

    for (let i = 0; i < lineCount; i++) {
      const lineData = lineDataRef.current[i];
      if (!lineData) continue;

      // Update progress (move toward center)
      lineData.progress += delta * lineSpeed;
      if (lineData.progress > 1) {
        lineData.progress = 0;
        // Keep the same angle for uniform distribution
      }

      // Calculate current radius (from edge to center all the way to 0)
      const currentRadius = 10 * (1 - lineData.progress);

      // Small line segment length
      const segmentLength = 0.02;
      const prevProgress = Math.max(0, lineData.progress - segmentLength);
      const prevRadius = 10 * (1 - prevProgress);

      // Calculate positions along the angle
      const x1 = Math.cos(lineData.angle) * prevRadius;
      const y1 = Math.sin(lineData.angle) * prevRadius;
      const z1 = getElevation(x1, y1);

      const x2 = Math.cos(lineData.angle) * currentRadius;
      const y2 = Math.sin(lineData.angle) * currentRadius;
      const z2 = getElevation(x2, y2);

      // Set line segment positions
      positions[i * 6] = x1;
      positions[i * 6 + 1] = y1;
      positions[i * 6 + 2] = z1 + 0.05;
      positions[i * 6 + 3] = x2;
      positions[i * 6 + 4] = y2;
      positions[i * 6 + 5] = z2 + 0.05;
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const positions = new Float32Array(lineCount * 6);

  return (
    <lineSegments ref={linesRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={lineCount * 2}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={lineColor} transparent opacity={0.8} />
    </lineSegments>
  );
}
export default function Plane() {
  const meshRef = useRef();

  const { color, gridWidth, gridHeight, noiseIntensity, mountainHeight, lineColor, lineSpeed, lineCount } = useControls({
    color: '#2e8fff',
    gridWidth: { value: 70, min: 10, max: 100, step: 1 },
    gridHeight: { value: 70, min: 10, max: 100, step: 1 },
    noiseIntensity: { value: 1., min: 0, max: 3, step: 0.1 },
    mountainHeight: { value: 4.0, min: 1, max: 10, step: 0.5 },
    lineColor: '#00ffff',
    lineSpeed: { value: 0.14, min: 0.1, max: 2, step: 0.1 },
    lineCount: { value: 100, min: 10, max: 100, step: 5 }
  });

  const uniforms = useRef({
    uColor: { value: new THREE.Color(color) },
    uNoiseIntensity: { value: noiseIntensity },
    uMountainHeight: { value: mountainHeight }
  });

  // Update uniforms in real-time
  useEffect(() => {
    uniforms.current.uColor.value.set(color);
    uniforms.current.uNoiseIntensity.value = noiseIntensity;
    uniforms.current.uMountainHeight.value = mountainHeight;
  }, [color, noiseIntensity, mountainHeight]);

  return (
    <>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20, gridWidth, gridHeight]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms.current}
          wireframe
        />
      </mesh>
      <MovingLines
        lineColor={lineColor}
        lineSpeed={lineSpeed}
        lineCount={lineCount}
        mountainHeight={mountainHeight - .5}
      />
    </>
  );
}
