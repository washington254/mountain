import { Canvas } from '@react-three/fiber';
import { OrbitControls, Cloud } from '@react-three/drei';
import { useControls } from 'leva';

import Plane from './components/Plane';

function App() {
  const { cloudRadius, cloudHeight, cloudScale, cloudOpacity, cloudSpeed } = useControls('Clouds', {
    cloudRadius: { value: 4.5, min: 3, max: 15, step: 0.5 },
    cloudHeight: { value: -0.5, min: -2, max: 2, step: 0.1 },
    cloudScale: { value: 0.25, min: 0.05, max: 1, step: 0.05 },
    cloudOpacity: { value: 0.3, min: 0.1, max: 1, step: 0.05 },
    cloudSpeed: { value: 0.2, min: 0.1, max: 1, step: 0.05 }
  });

  // Calculate cloud positions in a circle
  const cloudPositions = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 8;
    // Diagonal clouds (odd indices) use PI offset, cardinal clouds (even indices) use PI/2 offset
    const rotationOffset = i % 2 === 1 ? Math.PI : Math.PI / 2;
    return {
      x: Math.cos(angle) * cloudRadius,
      z: Math.sin(angle) * cloudRadius,
      rotation: angle + rotationOffset
    };
  });

  return (
    <>
      <div className="relative w-full h-screen">
        <h1 className="absolute top-10 left-1/2 transform -translate-x-1/2 text-2xl z-10 font-bold text-gray-100">
          MOUNTAIN
        </h1>



        <Canvas flat shadows camera={{ position: [8, 5, 8], fov: 50 }}>
          <OrbitControls target={[0, 0, 0]} />
          <ambientLight intensity={Math.PI / 2} />
          <Plane />

          {/* Light clouds forming a circle around the mountain base */}
          {cloudPositions.map((pos, i) => (
            <Cloud
              key={i}
              position={[pos.x, cloudHeight, pos.z]}
              speed={cloudSpeed}
              opacity={cloudOpacity}
              scale={cloudScale}
              rotation={[0, pos.rotation, 0]}
            />
          ))}
        </Canvas>
      </div>
    </>
  );
}

export default App;
