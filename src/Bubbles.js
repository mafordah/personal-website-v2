import { MathUtils } from 'three'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instance, Instances } from '@react-three/drei'
import { Vector3 } from 'three'

//Bubble instance code referenced from https://codesandbox.io/s/hi-key-bubbles-i6t0j?file=/src/App.js

const particles = Array.from({ length: 60 }, () => ({
    factor: MathUtils.randInt(20, 50),
    speed: MathUtils.randFloat(0.01, 0.25),
    xFactor: MathUtils.randFloatSpread(10),
    yFactor: MathUtils.randFloatSpread(3),
    zFactor: MathUtils.randFloatSpread(3)
}));

const vec = new Vector3()

function Bubble({ factor, speed, xFactor, yFactor, zFactor }) {
    const ref = useRef();
    const [move, setMove] = useState(0);
    const delta = MathUtils.randFloat(0.001, 0.005);

    useFrame((state) => {
        const t = factor + state.clock.elapsedTime * (speed / 2);

        vec.set(
            Math.cos(t) + Math.sin(t * 1) / 100 + xFactor + Math.cos((t / 100) * factor) + (Math.sin(t * 1) * factor) / 100,
            Math.sin(t) + Math.cos(t * 2) / 100 + yFactor + Math.sin((t / 100) * factor) + (Math.cos(t * 2) * factor) / 100,
            Math.sin(t) + Math.cos(t * 2) / 100 + zFactor + Math.cos((t / 100) * factor) + (Math.sin(t * 3) * factor) / 100
        );
        
        ref.current.scale.setScalar(Math.max(0.3, Math.cos(t) * 0.7));

        if (move == 0) { //Initial state
            ref.current.position.set(
                Math.cos(t) + Math.sin(t * 1) / 100 + xFactor + Math.cos((t / 100) * factor) + (Math.sin(t * 1) * factor) / 100,
                Math.sin(t) + Math.cos(t * 2) / 100 + yFactor + Math.sin((t / 100) * factor) + (Math.cos(t * 2) * factor) / 100,
                Math.sin(t) + Math.cos(t * 2) / 100 + zFactor + Math.cos((t / 100) * factor) + (Math.sin(t * 3) * factor) / 100
            );
        } else if (move == 1) { //Move to tub
            ref.current.position.set(xFactor * 0.4, -3, zFactor * 0.5);
            setMove(2);
        } else if (move == 2) { //Transition
            ref.current.position.y += delta;
            if (ref.current.position.y >= 3){
                setMove(3);
            }
        } else if (move == 3) { //To initial state
            ref.current.position.lerp(vec, 0.0005);
        }

        console.log();
    })

    return <Instance ref={ref} onPointerDown={(e) => { setMove(1) }} />
}

export default function Bubbles() {
    const ref = useRef()
    return (
        <Instances limit={particles.length} ref={ref} position={[0, 2, 0]}>
            <sphereGeometry args={[0.35, 30, 30]} />
            <meshPhysicalMaterial
                color={"white"}
                opacity={0.9}
                transparent={true}
                depthWrite={true}
                transmission={1}
                thickness={0.1}
                metalness={0}
                roughness={0.2}
                envMapIntensity={10}
                ior={1.25}
            />
            {particles.map((data, i) => (
                <Bubble key={i} {...data} />
            ))}
        </Instances>
    )
}

