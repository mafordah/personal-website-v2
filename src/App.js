import './App.css';
import { Suspense } from "react";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, MeshWobbleMaterial } from "@react-three/drei";
import Model from "./Model";
import Bubbles from './Bubbles';
import Foam from './Foam';
import Ground from './Ground';
import { WaterPlane } from './waterPlane';


// import vertexShader from './vertexShader';
// import fragmentShader from './fragmentShader';

// const MovingPlane = () => {
//   // This reference will give us direct access to the mesh
//   const mesh = useRef();

//   const uniforms = useMemo(
//     () => ({
//       u_time: {
//         value: 0.0,
//       },
//     }), []
//   );

//   useFrame((state) => {
//     const { clock } = state;
//     mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
//   });

//   return (
//     <mesh ref={mesh} position={[0.1, 0, 0]} rotation={[Math.PI / -2, 0, 0]} scale={1.5}>
//       <planeGeometry args={[1, 1, 32, 32]} />
//       {/* <meshPhysicalMaterial
//         depthWrite={true}
//         transmission={1}
//         thickness={0.5}
//         roughness={0.1}
//       /> */}
//       <shaderMaterial
//         fragmentShader={fragmentShader}
//         vertexShader={vertexShader}

//         transmission={1}
//         // thickness={0.5}
//         // roughness={0.1}
//         uniforms={uniforms}
//       />
//     </mesh>
//   );
// }

function App() {


  return (
    <div id="main">
      <Suspense fallback={<span>loading...</span>}>
        <Canvas camera={{ position: [0, 0, 6], fov: 65 }}>
          <spotLight intensity={0.5} angle={0.2} penumbra={1} position={[30, 30, 30]} castShadow shadow-mapSize={[512, 512]} />
          <directionalLight intensity={2} position={[10, 10, -10]} color="orange" />
          <Model
            path={"/images/3d/bathtub-02.glb"}
            position={[0, -1.8, 0]}
            scale={1}
            rotation={[0, Math.PI / -2, 0]}
          />
          <WaterPlane/>
          {/* <MovingPlane /> */}
          {/* <Foam /> */}
          <Bubbles />
          {/* <Ground /> */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
          />
          <Environment preset="warehouse" background blur={1} />
        </Canvas>

        <div id="copy" className="noselect">&copy; {new Date().getFullYear()} Miya Fordah</div>

      </Suspense>

    </div>
  )
}

export default App;
