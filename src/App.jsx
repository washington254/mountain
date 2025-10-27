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

  const { numClouds, cloudHeight, cloudScale, cloudOpacity, cloudSpeed, cloudColor, bloom } = useControls('Clouds', {
    numClouds: { value: 2, min: 1, max: 10, step: 1 },
    cloudHeight: { value: -.7, min: -2, max: 2, step: 0.1 },
    cloudScale: { value: 0.13, min: 0.05, max: 1, step: 0.05 },
    cloudOpacity: { value: 0.9, min: 0.1, max: 1, step: 0.05 },
    cloudSpeed: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    cloudColor: '#4d4d6f',
    bloom: { value: 4, min: 0, max: 5, step: 0.1 }
  });

  // Individual cloud controls with full customization
  const cloud1 = useControls('Cloud 1', {
    posX: { value: -2, min: -10, max: 10, step: 0.1 },
    posY: { value: 0, min: -10, max: 10, step: 0.1 },
    posZ: { value: 0, min: -10, max: 10, step: 0.1 },
    scale: { value: 0.13, min: 0.05, max: 2, step: 0.05 },
    color: '#4d4d6f',
    opacity: { value: 0.9, min: 0.1, max: 1, step: 0.05 },
    speed: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    seed: { value: 1, min: 1, max: 100, step: 1 }
  });

  const cloud2 = useControls('Cloud 2', {
    posX: { value: 2, min: -10, max: 10, step: 0.1 },
    posY: { value: 0, min: -10, max: 10, step: 0.1 },
    posZ: { value: 0, min: -10, max: 10, step: 0.1 },
    scale: { value: 0.13, min: 0.05, max: 2, step: 0.05 },
    color: '#4d4d6f',
    opacity: { value: 0.9, min: 0.1, max: 1, step: 0.05 },
    speed: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    seed: { value: 2, min: 1, max: 100, step: 1 }
  });

  const cloud3 = useControls('Cloud 3', {
    posX: { value: 0, min: -10, max: 10, step: 0.1 },
    posY: { value: 2, min: -10, max: 10, step: 0.1 },
    posZ: { value: -2, min: -10, max: 10, step: 0.1 },
    scale: { value: 0.13, min: 0.05, max: 2, step: 0.05 },
    color: '#4d4d6f',
    opacity: { value: 0.9, min: 0.1, max: 1, step: 0.05 },
    speed: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    seed: { value: 3, min: 1, max: 100, step: 1 }
  });

  const cloud4 = useControls('Cloud 4', {
    posX: { value: 0, min: -10, max: 10, step: 0.1 },
    posY: { value: -2, min: -10, max: 10, step: 0.1 },
    posZ: { value: 2, min: -10, max: 10, step: 0.1 },
    scale: { value: 0.13, min: 0.05, max: 2, step: 0.05 },
    color: '#4d4d6f',
    opacity: { value: 0.9, min: 0.1, max: 1, step: 0.05 },
    speed: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    seed: { value: 4, min: 1, max: 100, step: 1 }
  });

  const cloud5 = useControls('Cloud 5', {
    posX: { value: 3, min: -10, max: 10, step: 0.1 },
    posY: { value: 1, min: -10, max: 10, step: 0.1 },
    posZ: { value: -1, min: -10, max: 10, step: 0.1 },
    scale: { value: 0.13, min: 0.05, max: 2, step: 0.05 },
    color: '#4d4d6f',
    opacity: { value: 0.9, min: 0.1, max: 1, step: 0.05 },
    speed: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    seed: { value: 5, min: 1, max: 100, step: 1 }
  });

  const cloud6 = useControls('Cloud 6', {
    posX: { value: -3, min: -10, max: 10, step: 0.1 },
    posY: { value: -1, min: -10, max: 10, step: 0.1 },
    posZ: { value: 1, min: -10, max: 10, step: 0.1 },
    scale: { value: 0.13, min: 0.05, max: 2, step: 0.05 },
    color: '#4d4d6f',
    opacity: { value: 0.9, min: 0.1, max: 1, step: 0.05 },
    speed: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    seed: { value: 6, min: 1, max: 100, step: 1 }
  });

  const cloud7 = useControls('Cloud 7', {
    posX: { value: 1, min: -10, max: 10, step: 0.1 },
    posY: { value: 3, min: -10, max: 10, step: 0.1 },
    posZ: { value: -3, min: -10, max: 10, step: 0.1 },
    scale: { value: 0.13, min: 0.05, max: 2, step: 0.05 },
    color: '#4d4d6f',
    opacity: { value: 0.9, min: 0.1, max: 1, step: 0.05 },
    speed: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    seed: { value: 7, min: 1, max: 100, step: 1 }
  });

  const cloud8 = useControls('Cloud 8', {
    posX: { value: -1, min: -10, max: 10, step: 0.1 },
    posY: { value: -3, min: -10, max: 10, step: 0.1 },
    posZ: { value: 3, min: -10, max: 10, step: 0.1 },
    scale: { value: 0.13, min: 0.05, max: 2, step: 0.05 },
    color: '#4d4d6f',
    opacity: { value: 0.9, min: 0.1, max: 1, step: 0.05 },
    speed: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    seed: { value: 8, min: 1, max: 100, step: 1 }
  });

  const cloud9 = useControls('Cloud 9', {
    posX: { value: 4, min: -10, max: 10, step: 0.1 },
    posY: { value: 0, min: -10, max: 10, step: 0.1 },
    posZ: { value: 0, min: -10, max: 10, step: 0.1 },
    scale: { value: 0.13, min: 0.05, max: 2, step: 0.05 },
    color: '#4d4d6f',
    opacity: { value: 0.9, min: 0.1, max: 1, step: 0.05 },
    speed: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    seed: { value: 9, min: 1, max: 100, step: 1 }
  });

  const cloud10 = useControls('Cloud 10', {
    posX: { value: -4, min: -10, max: 10, step: 0.1 },
    posY: { value: 0, min: -10, max: 10, step: 0.1 },
    posZ: { value: 0, min: -10, max: 10, step: 0.1 },
    scale: { value: 0.13, min: 0.05, max: 2, step: 0.05 },
    color: '#4d4d6f',
    opacity: { value: 0.9, min: 0.1, max: 1, step: 0.05 },
    speed: { value: 0.2, min: 0.1, max: 1, step: 0.05 },
    seed: { value: 10, min: 1, max: 100, step: 1 }
  });

  const cloudConfigs = [cloud1, cloud2, cloud3, cloud4, cloud5, cloud6, cloud7, cloud8, cloud9, cloud10];


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
          {/* <Leva hidden /> */}
          {/* <OrbitControls/> */}
          <ambientLight intensity={Math.PI / 2} />
          <Grid />
          <Plane />

          <Clouds material={CloudMaterial}>
            {cloudConfigs.slice(0, numClouds).map((config, index) => (
              <Cloud
                key={index}
                position={[config.posX, config.posY + cloudHeight, config.posZ]}
                speed={config.speed}
                opacity={config.opacity}
                scale={config.scale}
                color={config.color}
                seed={config.seed}
              />
            ))}
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
