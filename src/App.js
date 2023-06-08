import './App.css';
import { useState, useRef, Suspense, useEffect, useCallback } from "react";
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Mask, } from "@react-three/drei";


import { gsap } from "gsap";
import Tub from './Tub';
import Water from './Water';
import Bubbles from './Bubbles';
import logoSVG from './images/logo/MF-logo-transparentCircle.svg'


function Rig(state) {
  useThree(({ camera }) => {
    if (state.state === "water") {

      gsap.to(camera.position, { x: 0, y: 3, z: 0.01, duration: 1, ease: "power1.inOut" });

    } else if (state.state === "main") {

      gsap.to(camera.position, { x: 0, y: 0.5, z: 6, duration: 1, ease: "power1.inOut" });

    }
  });
}



function App() {
  const [state, setState] = useState("main");

  const [toggle, setToggle] = useState(false);
  const toggleMenu = () => {
    setToggle(!toggle);
  };


  const menu = useRef();

  useEffect(() => {
    menu.current = new gsap.timeline({ paused: true })
      .fromTo(document.getElementById('main-nav'), { y: '8em', opacity: 0, filter: 'blur(10px)' }, { y: 0, opacity: 1, duration: 0.5, filter: 'blur(0px)' })
      .fromTo(document.getElementById('overlay'), { backdropFilter: 'blur(0px)' }, { backdropFilter: 'blur(3px)' }, "<")
      .to(document.getElementsByClassName('upper'), { attr: { d: "M8,2 L2,8" }, x: 1, duration: 0.5, ease: "Power2.easeInOut" }, "<")
      .to(document.getElementsByClassName('middle'), { attr: { d: "M6,5 L6,5" }, duration: 0.3, ease: "Power2.easeInOut" }, "<")
      .to(document.getElementsByClassName('lower'), { attr: { d: "M8,8 L2,2" }, x: 1, duration: 0.5, ease: "Power2.easeInOut" }, "<")
      .reverse();
  }, []);

  useEffect(() => {
    menu.current.reversed(!toggle);
  }, [toggle]);

  return (
    <div id="main">
      <Suspense id="suspense" fallback={<span id='loading'>loading...</span>}>
        <Canvas camera={{ position: [0, 0.5, 6], fov: 65 }}>

          <Tub />
          <Water />
          <Bubbles />
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
          <svg viewBox="0 0 12 10" className="menu" height="2rem" width="2rem" onPointerDown={() => {
            toggleMenu();
          }}>
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
