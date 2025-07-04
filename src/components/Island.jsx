import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Island(props) {
  const { nodes, materials } = useGLTF('models/island.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[-0.094, 0.837, -0.937]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane096_M_Building_0.geometry}
          material={materials.M_Building}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane096_M_Vegetation_0.geometry}
          material={materials.M_Vegetation}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane096_M_Vegetation_WithAlpha_0.geometry}
          material={materials.M_Vegetation_WithAlpha}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane098_M_Vegetation_0.geometry}
        material={materials.M_Vegetation}
        position={[-0.094, 0.837, -0.937]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane099_M_Building_0.geometry}
        material={materials.M_Building}
        position={[-0.094, 0.837, -0.937]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane100_M_Vegetation_0.geometry}
        material={materials.M_Vegetation}
        position={[-0.094, 0.837, -0.937]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane101_M_Building_0.geometry}
        material={materials.M_Building}
        position={[-0.094, 0.837, -0.937]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane102_M_Building_0.geometry}
        material={materials.M_Building}
        position={[-0.094, 0.837, -0.937]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane103_M_Building_0.geometry}
        material={materials.M_Building}
        position={[-0.094, 0.837, -0.937]}
      />
    </group>
  )
}

useGLTF.preload('models/island.glb')
