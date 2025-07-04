'use strict'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function Airplane({
  radius = 4,    // Радиус облёта (горизонтальный)
  speed = 0.3,   // Скорость облёта
  height = 5,    // Высота полёта (постоянная)
  ...props
}) {
  const ref = useRef()
  const { nodes, materials } = useGLTF('/models/airplane.glb')

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed
    const x = Math.cos(t) * radius
    const z = Math.sin(t) * radius

    if (ref.current) {
      // Позиция по кругу, без изм. высоты
      ref.current.position.set(x, height, z)
      // Наворачиваем нос по направлению движения
      ref.current.rotation.set(0, -t + Math.PI / 2, 0)
    }
  })

  return (
    <group ref={ref} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0,-1]} scale={0.021}>
        <group position={[0, 0, 0.357]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cylinder_0.geometry}
            material={materials.Material}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cylinder_1.geometry}
            material={materials.Metal_PBR}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cylinder_2.geometry}
            material={materials['Metal_PBR.001']}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/airplane.glb')
