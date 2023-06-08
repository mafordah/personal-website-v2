import './App.css';
import { useState, useRef, Suspense, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, Mask, useMask, } from "@react-three/drei";


// import { Vector3 } from 'three'
import { gsap } from "gsap";
import Tub from './Tub';
import Water from './Water';
import Logo from './Logo';
import Bubbles from './Bubbles';
// import Foam from './Foam';
import { WaterPlane } from './waterPlane';
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
  const logo = useRef();

  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    // When ready, auto-scroll 1px to hide URL bar
    window.addEventListener("load", function () {
      // Set a timeout...
      setTimeout(function () {
        // Hide the address bar
        window.scrollTo(0, 1);
      }, 0);
    });
  }

  const [toggle, setToggle] = useState(false);
  const toggleMenu = () => {
    setToggle(!toggle);
  };


  const menu = useRef();

  useEffect(() => {
    menu.current = new gsap.timeline({ paused: true })
      .fromTo(document.getElementById('main-nav'), { y: '8em', opacity: 0, filter: 'blur(10px)' }, { y: 0, opacity: 1, duration: 0.5, filter: 'blur(0px)' })
      .fromTo(document.getElementById('overlay'), {backdropFilter: 'blur(0px)'}, {backdropFilter: 'blur(3px)'}, "<")
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
      <Suspense fallback={<span id='loading'>loading...</span>}>
        <Canvas camera={{ position: [0, 0.5, 6], fov: 65 }}>
          {/* <spotLight intensity={0.5} angle={0.2} penumbra={1} position={[0, 0, 0]} castShadow shadow-mapSize={[512, 512]} /> */}
          {/* <directionalLight intensity={1} position={[5, 6, 4]} color="orange" /> */}
          <fog attach="fog" color="white" near={5} far={25} />

          <Tub />
          <Mask id={1} >
            <Water />
          </Mask>

          {/* <mesh ref={logo} onPointerDown={(e) => {
            e.stopPropagation();
            gsap.fromTo(logo.current.rotation, { y: 0 }, { y: Math.PI * 2, x: 0, duration: 3, ease: "elastic.out(1, 0.3.5)" });
            gsap.to(logo.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
            gsap.to(logo.current.position, { z: 0 });
            setState("main");
          }} >
            <Logo />
          </mesh> */}

          {/* <Html className="content" position={[0, -1.5, 1.6]} transform castShadow >
            <nav id="main-nav">
              <a onPointerDown={() => {
                gsap.fromTo(logo.current.rotation, { y: 0, x: 0 }, { y: Math.PI * 2, x: -Math.PI / 2.3, duration: 3, ease: "elastic.out(1, 0.35)" });
                gsap.to(logo.current.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 0.25 });
                gsap.to(logo.current.position, { z: -1.5 });
                setState("water");
              }}>ABOUT</a><br />

              <a onPointerDown={() => {
                gsap.fromTo(logo.current.rotation, { y: 0, x: 0 }, { y: Math.PI * 2, x: -Math.PI / 2.3, duration: 3, ease: "elastic.out(1, 0.35)" });
                gsap.to(logo.current.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 0.25 });
                gsap.to(logo.current.position, { z: -1.5 });
                setState("water");
              }}>WORK</a><br />

              <a onPointerDown={() => {
                gsap.fromTo(logo.current.rotation, { y: 0 }, { y: Math.PI * 2, x: 0, duration: 3, ease: "elastic.out(1, 0.35)" });
                gsap.to(logo.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
                gsap.to(logo.current.position, { z: 0 });
                setState("main");
              }}>CONTACT</a>
            </nav>
          </Html> */}

          <WaterPlane />
          {/* <Foam /> */}
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
          }}/>
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
