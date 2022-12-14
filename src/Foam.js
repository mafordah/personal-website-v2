import { MathUtils } from 'three'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instance, Instances } from '@react-three/drei'
import { Vector3 } from 'three'

//Bubble instance code referenced from https://codesandbox.io/s/hi-key-bubbles-i6t0j?file=/src/App.js

const particles = Array.from({ length: 500 }, () => ({
    factor: MathUtils.randInt(20, 50),
    speed: MathUtils.randFloat(0.01, 0.25),
    xFactor: MathUtils.randFloatSpread(5),
    yFactor: MathUtils.randFloatSpread(0.5),
    zFactor: MathUtils.randFloatSpread(2.2)
}));

// const vec = new Vector3()

function FoamBubble({ factor, speed, xFactor, yFactor, zFactor }) {
    const ref = useRef();

    useFrame((state) => {
        const t = factor + state.clock.elapsedTime * (speed / 2);

        // vec.set(
        //     Math.cos(t) + Math.sin(t * 1) / 100 + xFactor + Math.cos((t / 100) * factor) + (Math.sin(t * 1) * factor) / 100,
        //     Math.sin(t) + Math.cos(t * 2) / 100 + yFactor + Math.sin((t / 100) * factor) + (Math.cos(t * 2) * factor) / 100,
        //     Math.sin(t) + Math.cos(t * 2) / 100 + zFactor + Math.cos((t / 100) * factor) + (Math.sin(t * 3) * factor) / 100
        // );

        ref.current.scale.setScalar(Math.max(0.3, Math.cos(t) * 0.5));
        ref.current.position.set(xFactor, yFactor , zFactor);

    })

    return <Instance ref={ref} onPointerDown={(e) => { }} />
}

export default function Foam() {
    const ref = useRef()
    return (
        <Instances limit={particles.length} ref={ref} position={[0.2, -0.3, 0]}>
            <sphereGeometry args={[0.35, 30, 30]} />
            <meshPhysicalMaterial
                color={"white"}
                opacity={1}
                transparent={false}
                depthWrite={true}
                transmission={0.98}
                thickness={0.1}
                metalness={0}
                roughness={0.2}
                envMapIntensity={15}
                ior={1.25}
            />
            {particles.map((data, i) => (
                <FoamBubble key={i} {...data} />
            ))}
        </Instances>
    )
}

