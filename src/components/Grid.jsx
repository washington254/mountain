import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying float vDepth;
  
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uNearFade;
  uniform float uFarFade;
  
  varying float vDepth;
  
  void main() {
    // Calculate opacity based on depth from camera
    // Closer to camera = 1, farther = 0
    float opacity = smoothstep(uFarFade, uNearFade, vDepth);
    
    gl_FragColor = vec4(uColor, opacity);
  }
`;

export default function Grid({ color = '#2e8fff', size = 10, divisions = 50, speed = .3 }) {
    const gridRef = useRef();

    const gridGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const halfSize = size / 2;
        const step = size / divisions;

        // Create grid lines
        for (let i = 0; i <= divisions; i++) {
            const pos = -halfSize + i * step;
            // Horizontal lines
            vertices.push(-halfSize, 0, pos, halfSize, 0, pos);
            // Vertical lines
            vertices.push(pos, 0, -halfSize, pos, 0, halfSize);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        return geometry;
    }, [size, divisions]);

    const uniforms = useMemo(() => ({
        uColor: { value: new THREE.Color(color) },
        uNearFade: { value: 0 },
        uFarFade: { value: 6 }
    }), [color]);

    useFrame((_state, delta) => {
        if (gridRef.current) {
            // Move grid towards camera (positive Z direction)
            gridRef.current.position.z += speed * delta;

            // Reset position before reaching the end
            if (gridRef.current.position.z >= size * 0.6) {
                gridRef.current.position.z = -size * 0.1;
            }
        }
    });

    return (
        <lineSegments ref={gridRef} position={[0, -1, -size * 0.1]}>
            <bufferGeometry attach="geometry" {...gridGeometry} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
            />
        </lineSegments>
    );
}
