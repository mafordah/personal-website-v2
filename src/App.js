import './App.css';
import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, Mask, useMask, } from "@react-three/drei";
// import { Vector3 } from 'three'
import { gsap } from "gsap";
import Model from "./Model";
import Bubbles from './Bubbles';
// import Foam from './Foam';
import { WaterPlane } from './waterPlane';
// import logo from './images/logo/MF-logo-transparentCircle.svg'



function Rig(state) {
  useThree(({ camera }) => {
    if (state.state === "water") {

      gsap.to(camera.position, { x: 0, y: 3.5, z: 0.5, duration: 1, ease: "power1.inOut" });

    } else if (state.state === "main") {

      gsap.to(camera.position, { x: 0, y: 0, z: 6, duration: 1, ease: "power1.inOut" });

    }
  });
}


function App() {
  const [state, setState] = useState("main");
  const logo = useRef();

  return (
    <div id="main">
      <Suspense fallback={<span id='loading'>loading...</span>}>
        <Canvas camera={{ position: [0, 0, 6], fov: 65 }}>
          {/* <spotLight intensity={0.5} angle={0.2} penumbra={1} position={[0, 0, 0]} castShadow shadow-mapSize={[512, 512]} /> */}
          {/* <directionalLight intensity={1} position={[5, 6, 4]} color="orange" /> */}

          <Model
            path={"/images/3d/bathtub-02.glb"}
            position={[0, -1.8, 0]}
            scale={1}
            rotation={[0, Math.PI / -2, 0]}
          />

          {/* <Html className="content" position={[0, 1.5, 0]} center transform >
            <img id="logo" className="noselect" src={logo} alt="logo" />
          </Html> */}
          <mesh ref={logo} onPointerDown={(e) => {
            e.stopPropagation();
            gsap.fromTo(logo.current.rotation, { y: 0 }, { y: Math.PI * 2, x: 0, duration: 3, ease: "elastic.out(1, 0.3.5)" });
            gsap.to(logo.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
            gsap.to(logo.current.position, {z: 0});
            setState("main");
          }} >
            <Model
              path={"/images/3d/logo.glb"}
              position={[0, -1.5, 0]}
              scale={1}
              rotation={[0, Math.PI / -2, 0]}
            />
          </mesh>

          <Html className="content" position={[0, -1.5, 1.6]} transform castShadow >
            <nav id="main-nav">
              <a onPointerDown={() => {
                gsap.fromTo(logo.current.rotation, { y: 0, x: 0 }, { y: Math.PI * 2, x: -Math.PI / 2.3, duration: 3, ease: "elastic.out(1, 0.35)" });
                gsap.to(logo.current.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 0.25 });
                gsap.to(logo.current.position, {z: -1.5});
                setState("water");
              }}>ABOUT</a><br />

              <a onPointerDown={() => {
                gsap.fromTo(logo.current.rotation, { y: 0, x: 0 }, { y: Math.PI * 2, x: -Math.PI / 2.3, duration: 3, ease: "elastic.out(1, 0.35)" });
                gsap.to(logo.current.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 0.25 });
                gsap.to(logo.current.position, {z: -1.5});
                setState("water");
              }}>WORK</a><br />

              <a onPointerDown={() => {
                gsap.fromTo(logo.current.rotation, { y: 0 }, { y: Math.PI * 2, x: 0, duration: 3, ease: "elastic.out(1, 0.35)" });
                gsap.to(logo.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
                gsap.to(logo.current.position, {z: 0});
                setState("main");
              }}>CONTACT</a>
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
        
          <Rig state={state} />
          <Environment preset="warehouse" background blur={1} />
        </Canvas>

        <div id="copy" className="noselect">&copy; {new Date().getFullYear()} Miya Fordah</div>

      </Suspense>

    </div>
  )
}

export default App;
