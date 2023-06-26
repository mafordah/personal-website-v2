import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Tub() {
    const gltf = useLoader(GLTFLoader, "images/3d/bathtub-02.glb");
    return (
        <primitive
            object={gltf.scene}
            position = {[0, -1.8, 0]}
            scale={1}
            rotation={[0, Math.PI / -2, 0]}
            onPointerDown={(e) => { e.stopPropagation();}}
        />
    )
}