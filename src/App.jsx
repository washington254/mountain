import { Canvas } from '@react-three/fiber';
import { OrbitControls, Cloud } from '@react-three/drei';
import { useControls } from 'leva';
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing';

import Plane from './components/Plane';

function App() {
  const { cloudRadius, cloudHeight, cloudScale, cloudOpacity, cloudSpeed , bloom } = useControls('Clouds', {
    cloudRadius: { value: 4.5, min: 3, max: 15, step: 0.5 },
    cloudHeight: { value: -0.5, min: -2, max: 2, step: 0.1 },
    cloudScale: { value: 0.25, min: 0.05, max: 1, step: 0.05 },
    cloudOpacity: { value: 0.3, min: 0.1, max: 1, step: 0.05 },
    cloudSpeed: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    bloom: {value:4,min:0,max:5,step:0.1}
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
        <Canvas flat shadows camera={{ position: [0, 0, 10], fov:60 }}>
          <OrbitControls 
            target={[0, 0, 0]} 
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={0}
            enablePan={false}
          />
          <ambientLight intensity={Math.PI / 2} />
          <Plane />

          {/* {cloudPositions.map((pos, i) => (
            <Cloud
              key={i}
              position={[pos.x, cloudHeight, pos.z]}
              speed={cloudSpeed}
              opacity={cloudOpacity}
              scale={cloudScale}
              rotation={[0, pos.rotation, 0]}
            />
          ))} */}
       		<EffectComposer>
				<Bloom
					mipmapBlur
					intensity={bloom}
					luminanceThreshold={0.23}
					luminanceSmoothing={0.01}
					opacity={0.7}
				/>
				<ToneMapping adaptive={true} />
			</EffectComposer>
        </Canvas>
      </div>
    </>
  );
}

export default App;
