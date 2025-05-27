import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function GlobeModel() {
  const ref = useRef();
  const { scene } = useGLTF("");

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002; // slow rotation
    }
  });

  return <primitive object={scene} ref={ref} scale={1.5} />;
}

export default function Globe() {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Suspense fallback={null}>
          <GlobeModel />
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  );
}
