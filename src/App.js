import './App.css';
import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, Mask, useMask, } from "@react-three/drei";
import { Vector3 } from 'three'
import { gsap } from "gsap";
import Model from "./Model";
import Bubbles from './Bubbles';
// import Foam from './Foam';
import { WaterPlane } from './waterPlane';
// import logo from './images/logo/MF-logo-transparentCircle.svg'



function Rig(state) {
  useThree(({ camera }) => {
    if (state.state === "water") {
      gsap.to(camera.position, { x: 0, y: 4, z: 1, duration: 1, ease: "power1.inOut" });
      // gsap.to(camera.rotation, {z: 0});
      // camera.rotation.set(deg2rad(30), 0, 0);

    } else if (state.state === "main") {
      gsap.to(camera.position, { x: 0, y: 0, z: 6, duration: 1, ease: "power1.inOut" });
    }

    // camera.rotation.set(deg2rad(30), 0, 0);
  });
  // return useFrame(({ camera }) => {

  // if (state.state === "water") {
  //   // if (window.innerHeight > window.innerWidth) {
  //   //   camera.position.lerp(vec.set(1, 4, 0), 0.025)
  //   // } else {
  //   camera.position.lerp(vec.set(0, 4, 0), 0.025)
  //   camera.rotateZ(80)
  //   camera.lookAt(0, 0, 0)
  // } else if (state.state === "move"){
  //   camera.position.lerp(vec.set(0, 0, 6), 0.025)
  //   camera.lookAt(0, 0, 0)

  // }
  // })
}

function App() {
  const [state, setState] = useState("main");

  return (
    <div id="main">
      <Suspense fallback={<span>loading...</span>}>
        <Canvas camera={{ position: [0, 0, 6], fov: 65 }}>
          {/* <spotLight intensity={0.5} angle={0.2} penumbra={1} position={[30, 30, 30]} castShadow shadow-mapSize={[512, 512]} />
          <directionalLight intensity={2} position={[10, 10, -10]} color="orange" /> */}

          <Model
            path={"/images/3d/bathtub-02.glb"}
            position={[0, -1.8, 0]}
            scale={1}
            rotation={[0, Math.PI / -2, 0]}
          />

          {/* <Html className="content" position={[0, 1.5, 0]} center transform >
            <img id="logo" className="noselect" src={logo} alt="logo" />
          </Html> */}
          {/* {state === "main" ? <mesh> */}
          <Model
            path={"/images/3d/logo.glb"}
            position={[0, -1.5, 0]}
            scale={1}
            rotation={[0, Math.PI / -2, 0]}
          />
          {/* </mesh> : <></>} */}

          <Html className="content" position={[0, -1.5, 1.6]} transform castShadow >
            <nav id="main-nav">
              <a onPointerDown={() => { setState("water"); }}>ABOUT</a><br />
              <a onPointerDown={() => { setState("water"); }}>WORK</a><br />
              <a onPointerDown={() => { setState("main"); }}>CONTACT</a>
            </nav>
          </Html>

          <WaterPlane />


          {/* <Foam /> */}
          <Bubbles />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={state === "main" ? true : false}
            // minPolarAngle={state === "main" ? Math.PI / 4 : 0}
            maxPolarAngle={Math.PI / 1.8}
          // minAzimuthAngle={-Math.PI / 2}
          // maxAzimuthAngle={Math.PI / 2}
          />
          {/* {state === "main" ? <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
          /> : <></>} */}
          <Rig state={state} />
          <Environment preset="warehouse" background blur={1} />
        </Canvas>

        <div id="copy" className="noselect">&copy; {new Date().getFullYear()} Miya Fordah</div>

      </Suspense>

    </div>
  )
}

export default App;
