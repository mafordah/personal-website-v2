export default function Ground() {
  
    return (
        <mesh position={[0, -2.15, 0]} rotation={[Math.PI / -2, 0, 0]}>
          <planeGeometry args={[40, 10]} />
          <meshPhysicalMaterial
            color={"#000000"} 
            opacity={1}
            roughness={0.25}
          />
        </mesh>
    )
}