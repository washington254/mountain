import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Grid({ color = '#2e8fff', size = 10, divisions = 50, speed = .3 }) {
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Move entire group towards camera (positive Z direction)
            groupRef.current.position.z += speed * delta;

            // Reset position when it moves exactly one grid length
            if (groupRef.current.position.z >= size) {
                groupRef.current.position.z = 0;
            }
        }
    });

    return (
        <group ref={groupRef}>
            {/* First grid */}
            <gridHelper
                args={[size, divisions, color, color]}
                position={[0, -1, 0]}
            />
            {/* Second grid for seamless loop */}
            <gridHelper
                args={[size, divisions, color, color]}
                position={[0, -1, -size]}
            />
        </group>
    );
}
