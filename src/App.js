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
      if (window.innerWidth < window.innerHeight) {
        gsap.to(camera.position, { x: 3.5, y: 1.5, z: 4.75, duration: 1, ease: "power1.inOut" });
      } else {
        gsap.to(camera.position, { x: 0, y: 0.5, z: 6, duration: 1, ease: "power1.inOut" });
      }


    }
  });
}



function App() {
  const [state, setState] = useState("main");

  const menuTimeline = useRef();
  const fogTimeline = useRef();

  // var isPointerDown = false;
  // var polylineCount = 0;
  // var svg;
  // var mask;
  // var point;
  // var polyline;

  let isPointerDown = false;
  let svgMask;
  let currentPolyline = [];
  const polylines = [];



  useEffect(() => {
    menuTimeline.current = new gsap.timeline({ paused: true })
      .fromTo('#main-nav', { display: 'none', opacity: 0, filter: 'blur(10px)' }, { display: 'block', opacity: 1, duration: 0.5, filter: 'blur(0px)' }, "start")
      .to('.upper', { attr: { d: "M8,8 L2,2" }, x: 1, duration: 0.5, ease: "power2.inOut" }, "start")
      .to('.middle', { attr: { d: "M6,5 L6,5" }, duration: 0.3, ease: "power2.inOut" }, "start")
      .to('.lower', { attr: { d: "M8,2 L2,8" }, x: 1, duration: 0.5, ease: "power2.inOut" }, "start")
      .reverse();

    fogTimeline.current = new gsap.timeline({ paused: true })
      .fromTo('#overlay',
        { backgroundColor: "rgba(255, 255, 255, 0.0)", boxShadow: "0 0 0 rgba(255, 255, 255, 0.0) inset", display: "none" },
        { backgroundColor: "rgba(255, 255, 255, 0.2)", boxShadow: "0 0 10em rgba(255, 255, 255, 1.0) inset", display: "flex", duration: 1, ease: "none" }, "start")
      .fromTo('#overlay',
        { backdropFilter: 'blur(0px)' },
        { backdropFilter: 'blur(5px)', duration: 1.5, ease: "none" }, "start")
      .reverse();


    // svg = document.querySelector("#draw-container");
    // mask = document.querySelector("#draw-mask");
    // point = svg.createSVGPoint();
    // polyline = document.querySelector("#poly" + polylineCount);

    svgMask = generateInitialMask();

  }, []);



  const toggleMenu = () => {
    menuTimeline.current.reversed(!menuTimeline.current.reversed());
    fogTimeline.current.reversed(!fogTimeline.current.reversed());
    gsap.getProperty("#overlay", "pointerEvents") === "none" ? gsap.set("#overlay", { pointerEvents: "auto" }) : gsap.set("#overlay", { pointerEvents: "none" });
  };

  const generateInitialMask = () => {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <rect width="100%" height="100%" fill="white" />
      </svg>
    `;
  };

  const onPointerDown = () => {
    isPointerDown = true;
    currentPolyline = [];
  };

  const onPointerUp = () => {
    isPointerDown = false;
    if (currentPolyline.length > 0) {
      polylines.push(currentPolyline);
    }
  };

  const onPointerMove = (e) => {
    if (isPointerDown) {
      drawLine(e);
    }
  };

  const drawLine = (e) => {
    const newPoint = { x: e.clientX, y: e.clientY };
    currentPolyline.push(newPoint);
    updateMask();
  };

  const updateMask = () => {
    const newMask = generateMask([...polylines, currentPolyline]);
    svgMask = newMask;
    applyMask();
  };

  const generateMask = (lines) => {
    const svgHeader = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    `;
    const svgFooter = `
      </svg>
    `;

    const polylineElements = lines.map((line, index) => {
      const points = line.map(({ x, y }) => `${x},${y}`).join(' ');
      return `<polyline key="${index}" fill="transparent" stroke="white" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" points="${points}" />`;
    }).join('');

    return svgHeader + polylineElements + svgFooter;
  };

  const applyMask = () => {
    document.getElementById('overlay').style.mask = `url(data:image/svg+xml;utf8,${encodeURIComponent(svgMask)}) 0/100% 100%, linear-gradient(#000, #000)`;
    document.getElementById('overlay').style.WebkitMask = `url(data:image/svg+xml;utf8,${encodeURIComponent(svgMask)}) 0/100% 100%, linear-gradient(#000, #000)`;
  };

  // const onPointerDown = (e) => {
  //   isPointerDown = true;
  //   createPolyline();
  // }

  // const onPointerUp = (e) => {
  //   isPointerDown = false;
  // }

  // const onPointerMove = (e) => {
  //   if (isPointerDown) {
  //     drawLine(e);
  //     // gsap.to("#overlay", {
  //     //   WebkitMask: `url(#draw-mask) 0/100% 100%,
  //     //     linear-gradient(#fff,#fff)`,
  //     //   WebkitMaskComposite: `destination-out`,
  //     //   mask: `url(#draw-mask) 0/100% 100%, 
  //     //     linear-gradient(#fff,#fff)`,
  //     //   maskComposite: `exclude`
  //     // }, console.log("hey"));
  //   }
  // };

  // function createPolyline() {
  //   polylineCount++;
  //   // console.log(polylineCount);
  //   var poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  //   poly.setAttribute("id", "poly" + polylineCount);
  //   poly.setAttribute("fill", "transparent");
  //   poly.setAttribute("stroke", "black");
  //   poly.setAttribute("stroke-width", "40");
  //   poly.setAttribute("stroke-linecap", "round");
  //   poly.setAttribute("stroke-linejoin", "round");
  //   poly.setAttribute("points", "");
  //   mask.appendChild(poly);
  //   polyline = document.querySelector("#poly" + polylineCount);
  // }

  // function drawLine(e) {
  //   // console.log("mouse location:", evt.clientX, evt.clientY);
  //   point = svg.createSVGPoint();
  //   point.x = (e.clientX);
  //   point.y = (e.clientY);
  //   // console.log(point);
  //   polyline.points.appendItem(point);
  //   // console.log(polyline.points);
  // }



  return (
    <div id="main">
      <Suspense id="suspense" fallback={<img id="loading" src={loadingGIF} alt="loading animation gif" />}>
        <Canvas camera={window.innerWidth < window.innerHeight ? { position: [3.5, 1.5, 4.75], fov: 65 } : { position: [0, 0.5, 6], fov: 65 }}>

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
          // minAzimuthAngle={-Math.PI / 2}
          // maxAzimuthAngle={Math.PI / 2}
          />

          <Rig state={state} />
          <Environment preset="warehouse" background blur={1} />
        </Canvas>

        <div id="container">
          {/* <h1 id="title">Miya Fordah</h1> */}


          <div id="overlay" onPointerDown={(e) => { onPointerDown(e) }} onPointerUp={(e) => { onPointerUp(e) }} onPointerMove={(e) => { onPointerMove(e) }}></div>
          {/* <svg id="draw-container" style={{
              position: 'absolute',
              width: '100%',
              height: '100%'
            }}>
              <defs>
                <mask id="draw-mask" >
                  <rect width="100%" height="100%" fill="white" />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="rgba(255, 255, 255, 0.2)" mask= "url(#draw-mask)"/>
            </svg> */}

          <img id="logo" src={logoSVG} alt="MF logo" onPointerDown={(e) => {
            e.stopPropagation();
            menuTimeline.current.reverse();
            fogTimeline.current.reverse();
            setState("main");
          }} />

          {/* <nav id="main-nav">
            <a onPointerDown={() => {
              toggleMenu();
            }}>ABOUT</a><br />

            <a onPointerDown={() => {
              toggleMenu();
            }}>WORK</a><br />

            <a onPointerDown={() => {
              toggleMenu();
            }}>CONTACT</a>
          </nav> */}

          <svg className="menu" height="2rem" width="2rem" viewBox="0 0 12 10" onPointerDown={() => { toggleMenu(); }}>
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
