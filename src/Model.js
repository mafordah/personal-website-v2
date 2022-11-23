import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Model(props) {
    const gltf = useLoader(GLTFLoader, props.path);
    console.log();
    return (
        <primitive object={gltf.scene} />
    )
}