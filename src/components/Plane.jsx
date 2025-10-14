import { useRef, useEffect, useMemo } from 'react';
import { useControls } from 'leva';
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
    
    // Create cone/mountain shape
    float mountainShape = max(0.0, 1.0 - dist / 5.0);
    mountainShape = pow(mountainShape, 1.5);
    
    // Add noise only at the peak (where mountainShape is high)
    float noise = 0.0;
    if (mountainShape > 0.1) {
      noise += snoise(vec3(pos.x * 0.8, pos.y * 0.8, 0.0)) * 0.4;
      noise += snoise(vec3(pos.x * 1.5, pos.y * 1.5, 1.0)) * 0.2;
      noise += snoise(vec3(pos.x * 3.0, pos.y * 3.0, 2.0)) * 0.1;
    }
    
    // Combine: base mountain shape + noise at the top
    float elevation = mountainShape * uMountainHeight + noise * mountainShape * uNoiseIntensity;
    
    // Cut off the top of the mountain with a flat cap
    float capHeight = 3.0; // Height at which to cut the mountain
    elevation = min(elevation, capHeight);
    
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


export default function Plane() {
  const meshRef = useRef();

  const { color, gridWidth, gridHeight, noiseIntensity, mountainHeight, lineColor, lineSpeed, lineCount } = useControls({
    color: '#2e8fff',
    gridWidth: { value: 30, min: 10, max: 100, step: 1 },
    gridHeight: { value: 30, min: 10, max: 100, step: 1 },
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

  // Create custom grid lines (only horizontal and vertical, no diagonals)
  const gridLines = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    const width = 10;
    const height = 10;
    const segmentsX = gridWidth;
    const segmentsY = gridHeight;

    // Horizontal lines
    for (let i = 0; i <= segmentsY; i++) {
      const y = (i / segmentsY - 0.5) * height;
      for (let j = 0; j < segmentsX; j++) {
        const x1 = (j / segmentsX - 0.5) * width;
        const x2 = ((j + 1) / segmentsX - 0.5) * width;
        positions.push(x1, y, 0, x2, y, 0);
      }
    }

    // Vertical lines
    for (let i = 0; i <= segmentsX; i++) {
      const x = (i / segmentsX - 0.5) * width;
      for (let j = 0; j < segmentsY; j++) {
        const y1 = (j / segmentsY - 0.5) * height;
        const y2 = ((j + 1) / segmentsY - 0.5) * height;
        positions.push(x, y1, 0, x, y2, 0);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [gridWidth, gridHeight]);

  return (
    <>
      <lineSegments ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, -6]} geometry={gridLines}>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms.current}
        />
      </lineSegments>
    </>
  );
}
