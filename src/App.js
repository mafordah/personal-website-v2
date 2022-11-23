import './App.css';
import { Suspense } from "react";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from "@react-three/drei";
import Model from "./Model";

function App() {
  return (
    <div id="canvas-container">
      <Canvas>
        <ambientLight intensity={0.2} />
        <directionalLight color="pink" position={[5, 10, 5]} />
        {/* <mesh>
          <sphereGeometry args={[1, 30, 30]}/>
          <meshPhysicalMaterial depthWrite={false} transmission={1} thickness={10} roughness={0.5} />
        </mesh> */}
        <Suspense fallback={null}>
          <Model path={"/images/3d/bathtub-02.glb"}/>
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App;
