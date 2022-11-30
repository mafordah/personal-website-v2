import './App.css';
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from "@react-three/drei";
import Model from "./Model";
import Bubbles from './Bubbles';


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
    <div id="canvas-container">
      <Suspense fallback={<span>loading...</span>}>
        <Canvas>
          <ambientLight intensity={0.25} />
          <spotLight intensity={1} angle={0.2} penumbra={1} position={[30, 30, 30]} castShadow shadow-mapSize={[512, 512]} />
          <directionalLight intensity={3} position={[10, 10, -10]} color="orange" />

          {/* <mesh position={[0.1, -0.5, 0]} rotation={[Math.PI / -2, 0, 0]}>
          <planeGeometry args={[6, 3]} />
          <meshPhysicalMaterial
            opacity={0}
            transmission={1}
            thickness={0.5}
            roughness={0.1}
          />
        </mesh> */}


          <Model
            path={"/images/3d/bathtub-02.glb"}
            position={[0, -1.5, 0]}
            scale={1}
            rotation={[0, Math.PI / -2, 0]}
          />
          {/* <MovingPlane /> */}
          <Bubbles />
          <OrbitControls />
          <Environment preset="night" background blur={1} />

        </Canvas>
      </Suspense>
    </div>
  )
}

export default App;
