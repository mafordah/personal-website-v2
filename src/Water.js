import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Water() {
    const gltf = useLoader(GLTFLoader, "images/3d/water.glb");
    return (
        <primitive
            object={gltf.scene}
            position={[0, -1.8, 0]}
            scale={1}
            rotation={[0, Math.PI / -2, 0]}
        />

    )
}