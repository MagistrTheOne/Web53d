import { useRef, useEffect, useState } from 'react'
import { Sun, Moon, Music2 } from 'lucide-react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Sky, Cloud } from '@react-three/drei'
import * as THREE from 'three'

import Island from './components/Island'
import Airplane from './components/Airplane'
import ambientDay from './assets/sound/ambient-day.mp3'
import ambientNight from './assets/sound/ambient-night.mp3'

//
// Простейшая система дождя
//
function Rain({ count = 5000, area = 30, speed = 0.5 }) {
  const points = useRef()
  useEffect(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() * 2 - 1) * area
      pos[i * 3 + 1] = Math.random() * area + 5
      pos[i * 3 + 2] = (Math.random() * 2 - 1) * area
    }
    points.current.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(pos, 3)
    )
  }, [count, area])

  useFrame(() => {
    const attr = points.current.geometry.attributes.position
    const pos = attr.array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= speed
      if (pos[i * 3 + 1] < 0) pos[i * 3 + 1] = area + Math.random() * 5
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry />
      <pointsMaterial
        color="#99ccff"
        size={0.1}
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </points>
  )
}

function App() {
  const audioRef = useRef(null)
  const [isDay, setIsDay] = useState(true)
  const [weather, setWeather] = useState(null)

  // 1) Определяем локальное время, чтобы переключать день/ночь автоматически
  useEffect(() => {
    const updateDay = () => {
      const h = new Date().getHours()
      setIsDay(h >= 6 && h < 18)
    }
    updateDay()
    const iv = setInterval(updateDay, 60_000)
    return () => clearInterval(iv)
  }, [])

  // 2) Получаем реальную погоду разово (GPS + OpenWeatherMap)
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const key = import.meta.env.VITE_WEATHER_API_KEY // положи сюда свой ключ
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${key}`
        const res = await fetch(url)
        const data = await res.json()
        setWeather(data)
      } catch (e) {
        console.warn('Weather fetch failed', e)
      }
    })
  }, [])

  // 3) Меняем трек при смене дня/ночи
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.pause()
    a.src = isDay ? ambientDay : ambientNight
    setTimeout(() => a.play().catch(() => {}), 100)
  }, [isDay])

  // 4) Автостарт звука после первого взаимодействия
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onFirst = () => {
      a.play().catch(() => {})
      window.removeEventListener('pointerdown', onFirst)
    }
    window.addEventListener('pointerdown', onFirst)
    return () => window.removeEventListener('pointerdown', onFirst)
  }, [])

  // Флаги погоды
  const isRaining = weather?.weather?.[0]?.main === 'Rain'
  const showClouds = weather?.weather?.[0]?.main !== 'Clear'

  return (
    <div
      className={`relative w-full h-full min-h-screen ${
        isDay
          ? 'bg-gradient-to-b from-blue-100 to-blue-900'
          : 'bg-gradient-to-b from-gray-800 to-black'
      }`}
    >
      {/* Скрытый аудио-плеер */}
      <audio
        ref={audioRef}
        src={isDay ? ambientDay : ambientNight}
        loop
        autoPlay
        style={{ display: 'none' }}
      />

      {/* UI-кнопки */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsDay((d) => !d)}
          className="bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition"
        >
          {isDay ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <div className="bg-black/70 text-white text-xs px-3 py-1 rounded shadow flex items-center gap-1">
          <Music2 size={14} /> {isDay ? 'Day Track' : 'Night Track'}
        </div>
      </div>

      {/* Заголовок */}
      <header className="absolute top-0 w-full p-6 text-white text-center bg-gradient-to-b from-black/60 to-transparent z-10">
        <h1 className="text-3xl font-bold">M♾️1-3d Developers</h1>
        <p className="text-sm opacity-80">
          Crafting interactive 3D experiences in the browser
        </p>
      </header>

      {/* Three.js Сцена */}
      <Canvas shadows camera={{ position: [0, 8, 16], fov: 50 }}>
        {/* Объёмное небо */}
        <Sky
          distance={450000}
          sunPosition={isDay ? [100, 20, 100] : [-100, -20, -100]}
          turbidity={isDay ? 10 : 2}
          rayleigh={isDay ? 2 : 0.5}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />

        {/* Облака над островом */}
        {showClouds && (
          <>
            <Cloud position={[-10, 20, -5]} opacity={0.5} speed={0.2} width={50} depth={1.5} segments={30} />
            <Cloud position={[15, 22, 0]} opacity={0.4} speed={0.15} width={40} depth={1.2} segments={25} />
          </>
        )}

        {/* Дождь только ночью и если реально идёт дождь */}
        {!isDay && isRaining && <Rain count={8000} area={40} speed={0.7} />}

        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        <Island scale={1} />

        {/* Самолёт */}
        <Airplane radius={15} speed={0.32} height={20} position={[0, 18, 0]} scale={4.5} />

        <OrbitControls />
        <Environment preset={isDay ? 'sunset' : 'night'} />
      </Canvas>

      {/* Подвал */}
      <footer className="absolute bottom-0 w-full p-4 text-center text-gray-300 text-xs bg-black/50 z-10">
        © 2025 M♾️1. All rights reserved.
      </footer>
    </div>
  )
}

export default App
