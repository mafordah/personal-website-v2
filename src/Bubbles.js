import { MathUtils } from 'three'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instance, Instances, MeshTransmissionMaterial } from '@react-three/drei'
import { Vector3 } from 'three'

//Bubble instance code adapted from https://codesandbox.io/s/hi-key-bubbles-i6t0j?file=/src/App.js

const particles = Array.from({ length: 80 }, () => ({
    factor: MathUtils.randInt(20, 50),
    speed: MathUtils.randFloat(0.01, 0.25),
    scale: MathUtils.randFloat(0.1, 0.8),
    xFactor: MathUtils.randFloatSpread(8),
    yFactor: MathUtils.randFloatSpread(1),
    zFactor: MathUtils.randFloatSpread(5)
}));

const vec = new Vector3()


function Bubble({ factor, speed, scale, xFactor, yFactor, zFactor }) {
    const ref = useRef();
    const [move, setMove] = useState(0);
    const delta = MathUtils.randFloat(0.0005, 0.005);

    useFrame((state) => {
        const t = factor + state.clock.elapsedTime * (speed / 2);

        vec.set(
            Math.cos(t) + Math.sin(t * 1) / 100 + xFactor + Math.cos((t / 100) * factor) + (Math.sin(t * 1) * factor) / 100,
            Math.sin(t) + Math.cos(t * 2) / 100 + yFactor + Math.sin((t / 100) * factor) + (Math.cos(t * 2) * factor) / 100,
            Math.sin(t) + Math.cos(t * 2) / 100 + zFactor + Math.cos((t / 100) * factor) + (Math.sin(t * 3) * factor) / 100
        );


        if (move === 0) { //Initial state
            ref.current.scale.setScalar(scale);
            ref.current.position.set(
                Math.cos(t) + Math.sin(t * 1) / 100 + xFactor + Math.cos((t / 100) * factor) + (Math.sin(t * 1) * factor) / 100,
                Math.sin(t) + Math.cos(t * 2) / 100 + yFactor + Math.sin((t / 100) * factor) + (Math.cos(t * 2) * factor) / 100,
                Math.sin(t) + Math.cos(t * 2) / 100 + zFactor + Math.cos((t / 100) * factor) + (Math.sin(t * 3) * factor) / 100
            );
        } else if (move === 1) { //Move to tub randomly
            ref.current.scale.setScalar(MathUtils.randFloat(0.1, 0.8));
            ref.current.position.set(MathUtils.randFloatSpread(3.2), -3.5, MathUtils.randFloatSpread(1.5));
            setMove(2);
        } else if (move === 2) { //Transition
            ref.current.position.y += delta;
            if (ref.current.position.y >= 2.2) {
                setMove(3);
            }
        } else if (move === 3) { //To initial state
            ref.current.position.lerp(vec, 0.00075);
        }

        console.log();
    })

    return <Instance ref={ref} onPointerDown={(e) => { e.stopPropagation(); setMove(1); }} />
}

export default function Bubbles() {
    const ref = useRef()
    return (
        <Instances limit={particles.length} ref={ref} position={[0, 2, 0]}>
            <sphereGeometry args={[0.35, 30, 30]} />
            <MeshTransmissionMaterial
                // color={"white"}
                // resolution={768}
                iridescence={1}
                transmission={1}
                thickness={0.1}
                anisotropy={0.5}
                distortion={1}
                chromaticAberration={0.5}
                roughness={0.2}
                envMapIntensity={3}
            />

            {particles.map((data, i) => (
                <Bubble key={i} {...data} />
            ))}
        </Instances>
    )
}

