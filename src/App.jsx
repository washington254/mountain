import { Canvas, extend } from '@react-three/fiber';
import { Cloud, Clouds } from '@react-three/drei';
import { useControls } from 'leva';
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing';
import * as THREE from 'three';

import Plane from './components/Plane';
import Grid from './components/Grid';

class CloudMaterial extends THREE.MeshBasicMaterial {
  constructor() {
    super();
    this.fog = false;
  }
}

extend({ CloudMaterial });

function App() {

  const { cloudRadius, cloudHeight, cloudScale, cloudOpacity, cloudSpeed, cloudColor, bloom } = useControls('Clouds', {
    cloudRadius: { value: 2., min: 3, max: 15, step: 0.5 },
    cloudHeight: { value: -.7, min: -2, max: 2, step: 0.1 },
    cloudScale: { value: 0.19, min: 0.05, max: 1, step: 0.05 },
    cloudOpacity: { value: 0.9, min: 0.1, max: 1, step: 0.05 },
    cloudSpeed: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    cloudColor: '#4d4d6f',
    bloom: { value: 4, min: 0, max: 5, step: 0.1 }
  });


  const { fogColor, fogNear, fogFar } = useControls('Fog', {
    fogColor: '#000',
    fogNear: { value: 2, min: 0, max: 10, step: 0.1 },
    fogFar: { value: 3, min: 5, max: 20, step: 0.5 },
  });

  return (
    <>
      <div className="relative w-full h-screen">
        <Canvas flat shadows camera={{ position: [0, -.5, 6], fov: 40, far: 13 }}>
          <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
          {/* <OrbitControls/> */}
          <ambientLight intensity={Math.PI / 2} />
          <Grid />
          <Plane />

          <Clouds material={CloudMaterial}>
            <Cloud
              position={[-cloudRadius, cloudHeight, 0]}
              speed={cloudSpeed}
              opacity={cloudOpacity}
              scale={[cloudScale, cloudScale, cloudScale]}
              color={cloudColor}
              seed={1}
            />
            <Cloud
              position={[cloudRadius, cloudHeight, 0]}
              speed={cloudSpeed}
              opacity={cloudOpacity}
              scale={[cloudScale, cloudScale, cloudScale]}
              color={cloudColor}
              seed={1}
            />
          </Clouds>


          <EffectComposer>
            <Bloom
              mipmapBlur
              intensity={bloom}
              luminanceThreshold={0.1}
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
