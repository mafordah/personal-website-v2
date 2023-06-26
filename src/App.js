import './App.css';
import { useState, useRef, Suspense, useEffect, useCallback } from "react";
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Mask, MeshReflectorMaterial } from "@react-three/drei";


import { gsap } from "gsap";
import Tub from './Tub';
import Water from './Water';
import Bubbles from './Bubbles';
import logoSVG from './images/logo/MF-logo-transparentCircle.svg';
import loadingGIF from './images/logo/logoLoadingGIF.gif'


function Rig(state) {
  useThree(({ camera }) => {
    if (state.state === "water") {

      gsap.to(camera.position, { x: 0, y: 3, z: 0.1, duration: 1, ease: "power1.inOut" });


    } else if (state.state === "main") {

      gsap.to(camera.position, { x: 0, y: 0.5, z: 6, duration: 1, ease: "power1.inOut" });

    }
  });
}



function App() {
  const [state, setState] = useState("main");

  const heroTimeline = useRef();
  const menuTimeline = useRef();
  const fogTimeline = useRef();
  const touchEvents = useRef();

  useEffect(() => {
    heroTimeline.current = new gsap.timeline()
      .to('#overlay', { boxShadow: "0 0 10em rgba(255, 255, 255, 0.0) inset", duration: 1, ease: "none" }, "start")
      .to('#overlay', { backdropFilter: 'blur(0px)', duration: 1.5, ease: "none" }, "start")

    menuTimeline.current = new gsap.timeline({ paused: true })
      .fromTo('#main-nav', { y: '8em', opacity: 0, filter: 'blur(10px)' }, { y: 0, opacity: 1, duration: 0.5, filter: 'blur(0px)' }, "start")
      .to('.upper', { attr: { d: "M8,2 L2,8" }, x: 1, duration: 0.5, ease: "power2.inOut" }, "start")
      .to('.middle', { attr: { d: "M6,5 L6,5" }, duration: 0.3, ease: "power2.inOut" }, "start")
      .to('.lower', { attr: { d: "M8,8 L2,2" }, x: 1, duration: 0.5, ease: "power2.inOut" }, "start")
      .reverse();

    fogTimeline.current = new gsap.timeline({ paused: true })
      .fromTo('#overlay',
        { boxShadow: "0 0 0 rgba(255, 255, 255, 0.0) inset" },
        { boxShadow: "0 0 10em rgba(255, 255, 255, 1.0) inset", duration: 1, ease: "none" }, "start")
      .fromTo('#overlay',
        { backdropFilter: 'blur(0px)' },
        { backdropFilter: 'blur(5px)', duration: 1.5, ease: "none" }, "start")
      .reverse();

  }, []);



  const toggleMenu = () => {
    menuTimeline.current.reversed(!menuTimeline.current.reversed());
    fogTimeline.current.reversed(!fogTimeline.current.reversed());
  };


  return (
    <div id="main">
      <Suspense id="suspense" fallback={<img id="loading" src={loadingGIF} alt="loading image logo"/>}>
        <Canvas camera={{ position: [0, 0.5, 6], fov: 65 }}>

          <Tub />
          <Water />
          <Bubbles />
          {/* <mesh receiveShadow position = {[0, -2.43, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[20, 50]} />
            <MeshReflectorMaterial
              blur={[300, 30]}
              resolution={2048}
              mixBlur={1}
              mixStrength={80}
              roughness={1}
              depthScale={0.1}
              color="#202020"
              metalness={0}
            />
          </mesh> */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={state === "main" ? true : false}
            // minPolarAngle={state === "main" ? Math.PI / 4 : 0}
            maxPolarAngle={Math.PI / 1.8}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
          />

          <Rig state={state} />
          <Environment preset="warehouse" background blur={1} />
        </Canvas>

        <div id="overlay">
          <img id="logo" src={logoSVG} alt="MF logo" onPointerDown={(e) => {
            e.stopPropagation();
            menuTimeline.current.reverse();
            fogTimeline.current.reverse();
            setState("main");
          }} />
          <nav id="main-nav">
            <a onPointerDown={() => {
              setState("water");
              toggleMenu();
            }}>ABOUT</a><br />

            <a onPointerDown={() => {
              setState("water");
              toggleMenu();
            }}>WORK</a><br />

            <a onPointerDown={() => {
              setState("water");
              toggleMenu();
            }}>CONTACT</a>
          </nav>
          <svg viewBox="0 0 12 10" className="menu" height="2rem" width="2rem" onPointerDown={() => { toggleMenu(); }}>
            <path d="M10,2 L2,2" className="upper line" />
            <path d="M2,5 L10,5" className="middle line" />
            <path d="M10,8 L2,8" className="lower line" />
          </svg>

          <div id="copy">© {new Date().getFullYear()} Miya Fordah</div>
        </div>

      </Suspense>

    </div>
  )
}



export default App;
