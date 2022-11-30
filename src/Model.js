import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Model(props) {
    const gltf = useLoader(GLTFLoader, props.path);
    return (
        <primitive
            object={gltf.scene}
            position = {props.position}
            scale={props.scale}
            rotation={props.rotation}
        />
    )
}