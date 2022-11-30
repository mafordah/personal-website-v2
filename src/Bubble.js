import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instance } from '@react-three/drei'


export default function Bubble(props) {
    const geometry = new THREE.SphereGeometry((0.4 - Math.random() * 0.3), 30, 30);
    const material = new THREE.MeshPhysicalMaterial({
        color: "white",
        opacity: 0.9,
        transparent: true,
        depthWrite: true,
        transmission: 1,
        thickness: 0.1,
        metalness: 0,
        roughness: 0,
        envMapIntensity: 10,
        ior: 1.25
    });

    return (
        <mesh {...props} geometry={geometry} material={material}>
            {/* <sphereGeometry args={[0.4 - Math.random() * 0.3, 30, 30]}/> */}
            {/* <meshPhysicalMaterial
                color={"white"}
                opacity={0.9}
                transparent={true}
                depthWrite={true}
                transmission={1}
                thickness={0.1}
                metalness={0}
                roughness={0}
                envMapIntensity={10}
                ior={1.25}
            /> */}
        </mesh>
    )
}