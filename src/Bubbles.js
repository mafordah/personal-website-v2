import { MathUtils } from 'three'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instance, Instances } from '@react-three/drei'

//Bubble instance code referenced from https://codesandbox.io/s/hi-key-bubbles-i6t0j?file=/src/App.js

const particles = Array.from({ length: 80 }, () => ({
    factor: MathUtils.randInt(20, 50),
    speed: MathUtils.randFloat(0.01, 0.25),
    xFactor: MathUtils.randFloatSpread(10),
    yFactor: MathUtils.randFloatSpread(1),
    zFactor: MathUtils.randFloatSpread(3)
}))

function Bubble({ factor, speed, xFactor, yFactor, zFactor }) {
    const ref = useRef()
    const [visible, setVisible] = useState(true)
    useFrame((state) => {
        const t = factor + state.clock.elapsedTime * (speed / 2)
        ref.current.scale.setScalar(visible? Math.max(0.4, Math.cos(t) * 0.8) : 0)
        ref.current.position.set(
            Math.cos(t) + Math.sin(t * 1) / 100 + xFactor + Math.cos((t / 100) * factor) + (Math.sin(t * 1) * factor) / 100,
            Math.sin(t) + Math.cos(t * 2) / 100 + yFactor + Math.sin((t / 100) * factor) + (Math.cos(t * 2) * factor) / 100,
            Math.sin(t) + Math.cos(t * 2) / 100 + zFactor + Math.cos((t / 100) * factor) + (Math.sin(t * 3) * factor) / 100
        )
    })
    return <Instance ref={ref} onClick={(e) => setVisible(false) } />
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
                <Bubble key={i} {...data}/>
            ))}
        </Instances>
    )
}



// import Bubble from './Bubble';

// export default function Bubbles(props) {
//     const positions = [...Array(24)].map(() => ({
//         position: [(Math.random() - 0.5) * 10, Math.random() * 5, (Math.random() - 0.5) * 10],
//     }))
//     return (
//         <>
//             {positions.map((props, i) => (
//                 <Bubble key={i} onClick={(e) => console.log(i)} {...props} />
//             ))}
//         </>
//     )
// }

