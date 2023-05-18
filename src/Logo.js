import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Logo() {
    const gltf = useLoader(GLTFLoader, "/images/3d/logo.glb");
    return (
        <primitive
            object={gltf.scene}
            position = {[0, -1.5, 0]}
            scale={1}
            rotation={[0, Math.PI / -2, 0]}
        />
    )
}