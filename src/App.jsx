import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';

import Plane from './components/Plane';

function App() {


  return (
    <>
      <div className="relative w-full h-screen">
        <h1 className="absolute top-10 left-1/2 transform -translate-x-1/2 text-2xl z-10 font-bold text-gray-100">
           MOUNTAIN
        </h1>

   

        <Canvas flat shadows camera={{ position: [8, 5, 8], fov: 50 }}>
          <OrbitControls target={[0, 0, 0]} />
          <ambientLight intensity={Math.PI / 2} />
           <Plane/>
        </Canvas>
      </div>
    </>
  );
}

export default App;
