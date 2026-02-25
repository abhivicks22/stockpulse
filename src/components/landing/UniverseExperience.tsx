'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Stars, Float, Trail, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import MissionStats from '@/components/landing/MissionStats'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

// --- UNIVERSE PHENOMENA COMPONENT ---
// This component reads the `useScroll()` progress and animates the camera/objects accordingly.
function UniverseFlight() {
    const scroll = useScroll()
    const cameraGroup = useRef<THREE.Group>(null!)

    // We will organize phenomena into distinct groups along the Z-axis
    // Space is vast. We fly down the Z-axis as we scroll.
    // Earth: z=0
    // Comet: z=-40
    // BlackHole: z=-80
    // Supernova: z=-120

    useFrame((state, delta) => {
        // scroll.offset goes from 0 to 1
        // we map it to our Z flight path: 0 to -120
        const targetZ = -scroll.offset * 120

        // Damp the camera group movement for buttery smoothness
        if (cameraGroup.current) {
            cameraGroup.current.position.z = THREE.MathUtils.damp(
                cameraGroup.current.position.z,
                targetZ,
                4, // damping factor
                delta
            )

            // Add some gentle breathing/swaying to the camera
            cameraGroup.current.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.5
            cameraGroup.current.position.y = Math.cos(state.clock.elapsedTime * 0.15) * 0.3
        }
    })

    return (
        <group>
            {/* The moving camera rig */}
            <group ref={cameraGroup}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
                <directionalLight position={[-5, 3, 5]} intensity={0.6} color="#ffffff" />
                <pointLight position={[-8, 2, 3]} intensity={0.3} color="#4488ff" />
            </group>

            {/* Deep space starfield (global) */}
            <Stars radius={100} depth={200} count={6000} factor={4} saturation={0.5} fade speed={0.5} />
            <ambientLight intensity={0.08} />

            {/* STAGE 1: Earth (z=0) */}
            <EarthStage position={[3, -1, 0]} />

            {/* STAGE 2: Comet passing by (z=-40) */}
            <CometStage position={[-2, 1, -40]} />

            {/* STAGE 3: Supermassive Black Hole (z=-80) */}
            <BlackHoleStage position={[2, 0, -80]} />

            {/* STAGE 4: Supernova Remnant (z=-120) */}
            <SupernovaStage position={[0, 0, -120]} />
        </group>
    )
}

/* --- STAGE 1: EARTH --- */
function EarthStage({ position }: { position: [number, number, number] }) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const cloudRef = useRef<THREE.Mesh>(null!)

    // Reuse the advanced Earth shader we built previously
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uLightDir: { value: new THREE.Vector3(-1, 0.5, 1).normalize() },
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;
                varying vec3 vWorldNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
                    vUv = uv;
                    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec3 uLightDir;
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;
                varying vec3 vWorldNormal;

                float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
                float noise(vec2 p) {
                    vec2 i = floor(p); vec2 f = fract(p);
                    float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
                    float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
                    vec2 u = f * f * (3.0 - 2.0 * f);
                    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
                }
                float fbm(vec2 p) {
                    float f = 0.0;
                    f += 0.5000 * noise(p); p *= 2.02;
                    f += 0.2500 * noise(p); p *= 2.03;
                    f += 0.1250 * noise(p);
                    return f / 0.875;
                }

                void main() {
                    float NdotL = dot(vWorldNormal, uLightDir);
                    float daylight = smoothstep(-0.1, 0.3, NdotL);
                    vec3 viewDir = normalize(-vPosition);
                    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 4.0);
                    
                    vec2 uv = vUv + vec2(uTime * 0.003, 0.0);
                    float n = fbm(uv * 6.0);
                    float continent = smoothstep(0.42, 0.52, n);
                    
                    vec3 oceanDay = vec3(0.02, 0.08, 0.25);
                    vec3 landColor = vec3(0.05, 0.18, 0.04);
                    vec3 dayColor = mix(oceanDay, landColor, continent);
                    
                    vec3 halfVec = normalize(uLightDir + viewDir);
                    float specular = pow(max(dot(vWorldNormal, halfVec), 0.0), 80.0);
                    dayColor += vec3(0.3, 0.4, 0.6) * specular * (1.0 - continent) * 0.6;

                    vec3 nightColor = vec3(0.005, 0.005, 0.02);
                    float cityNoise = fbm(vUv * 40.0);
                    float cityMask = continent * step(0.65, cityNoise) * 0.8;
                    vec3 cityColor = vec3(1.0, 0.85, 0.4);
                    nightColor += cityColor * cityMask;

                    vec3 surfaceColor = mix(nightColor, dayColor, daylight);
                    surfaceColor += vec3(0.3, 0.6, 1.0) * fresnel * 1.2;

                    gl_FragColor = vec4(surfaceColor, 1.0);
                }
            `,
            transparent: false,
        })
    }, [])

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.05
            material.uniforms.uTime.value = t
        }
    })

    return (
        <group position={position}>
            <mesh ref={meshRef} material={material}>
                <sphereGeometry args={[2.5, 64, 64]} />
            </mesh>
            {/* Inner atmosphere glow */}
            <mesh scale={[2.65, 2.65, 2.65]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial color="#4488ff" transparent opacity={0.08} side={THREE.BackSide} />
            </mesh>
            <mesh scale={[3.0, 3.0, 3.0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="#2255cc" transparent opacity={0.03} side={THREE.BackSide} />
            </mesh>

            {/* Satellite orbiting Earth */}
            <Trail width={0.8} length={10} color="#2962FF" attenuation={(w) => w * w}>
                <mesh position={[3.5, 0, 0]}>
                    <boxGeometry args={[0.1, 0.1, 0.1]} />
                    <meshStandardMaterial color="#ffffff" emissive="#1848FF" />
                </mesh>
            </Trail>
        </group>
    )
}

/* --- STAGE 2: COMET --- */
function CometStage({ position }: { position: [number, number, number] }) {
    const cometRef = useRef<THREE.Group>(null!)

    useFrame((state) => {
        if (cometRef.current) {
            cometRef.current.rotation.x = state.clock.elapsedTime * 0.5
            cometRef.current.rotation.z = state.clock.elapsedTime * 0.3
            // Comet flies past slightly
            cometRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.2) * 2
            cometRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 0.2) * 1
        }
    })

    return (
        <group position={position} ref={cometRef}>
            <Trail width={4} length={30} color="#00ffff" attenuation={(w) => w * w}>
                <mesh>
                    <dodecahedronGeometry args={[0.8, 1]} />
                    <meshStandardMaterial color="#88ddff" emissive="#00aaff" emissiveIntensity={2} roughness={0.2} />
                </mesh>
            </Trail>
            <pointLight intensity={2} color="#00ffff" distance={20} />
            {/* Ice debris around comet */}
            {[...Array(10)].map((_, i) => (
                <mesh key={i} position={[(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3]}>
                    <boxGeometry args={[0.1, 0.1, 0.1]} />
                    <meshStandardMaterial color="#ffffff" emissive="#00ffff" />
                </mesh>
            ))}
        </group>
    )
}

/* --- STAGE 3: BLACK HOLE --- */
function BlackHoleStage({ position }: { position: [number, number, number] }) {
    const ringRef = useRef<THREE.Mesh>(null!)
    const particlesRef = useRef<THREE.Points>(null!)

    const count = 1000
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2
            const radius = 3 + Math.random() * 5
            positions[i * 3] = Math.cos(angle) * radius
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5
            positions[i * 3 + 2] = Math.sin(angle) * radius
        }
        return positions
    }, [])

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (ringRef.current) {
            ringRef.current.rotation.z = -t * 0.2
            ringRef.current.rotation.x = Math.PI / 2.5
        }
        if (particlesRef.current) {
            particlesRef.current.rotation.y = t * 0.5
            particlesRef.current.rotation.x = Math.PI / 2.5
        }
    })

    return (
        <group position={position}>
            {/* The Event Horizon (Pure Black) */}
            <mesh>
                <sphereGeometry args={[2, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Accretion Disk Base */}
            <mesh ref={ringRef}>
                <torusGeometry args={[4, 1.5, 16, 100]} />
                <meshBasicMaterial color="#ff5500" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh rotation-x={Math.PI / 2.5}>
                <torusGeometry args={[3.2, 0.3, 16, 100]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
            </mesh>

            {/* Superheated particles swirling */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[particles, 3]} />
                </bufferGeometry>
                <pointsMaterial size={0.08} color="#ffcc00" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
            </points>
            <pointLight intensity={3} color="#ff55ff" distance={30} />
        </group>
    )
}

/* --- STAGE 4: SUPERNOVA --- */
function SupernovaStage({ position }: { position: [number, number, number] }) {
    const coreRef = useRef<THREE.Mesh>(null!)
    const shockwaveRef = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (coreRef.current) {
            const scale = 1 + Math.sin(t * 2) * 0.1
            coreRef.current.scale.set(scale, scale, scale)
        }
        if (shockwaveRef.current) {
            const expand = (t % 3) * 3
            shockwaveRef.current.scale.set(1 + expand, 1 + expand, 1 + expand)
                ; (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = 1 - (t % 3) / 3
        }
    })

    return (
        <group position={position}>
            {/* Pulsing Core */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[3, 32, 32]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh>
                <sphereGeometry args={[3.5, 32, 32]} />
                <meshBasicMaterial color="#cc00ff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Expanding Shockwaves */}
            <mesh ref={shockwaveRef}>
                <sphereGeometry args={[4, 64, 64]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.5} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
            </mesh>
            <pointLight intensity={5} color="#cc00ff" distance={50} />
        </group>
    )
}

/* ──────────────────────────────────────────────
   PAGE WRAPPER
   ────────────────────────────────────────────── */
export default function UniverseExperience() {
    return (
        <div className="w-full h-screen bg-black">
            {/* Fixed Navbar on top of everything */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar />
            </div>

            <Canvas gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} dpr={[1, 2]}>
                {/* 
                  pages={4} defines how tall the scroll area is (4x viewport height)
                  damping={0.2} makes the scroll buttery smooth
                */}
                <ScrollControls pages={4} damping={0.2}>

                    {/* The 3D Scene reacting to scroll */}
                    <Scroll>
                        <UniverseFlight />
                    </Scroll>

                    {/* The HTML Overlay scrolling normally over the 3D scene */}
                    <Scroll html style={{ width: '100%' }}>

                        {/* 
                          Each block needs a predefined height or to be allowed to natural scroll.
                          We'll space them out effectively to match the 4 "pages" of scroll.
                        */}
                        <div className="relative w-full">

                            {/* PAGE 1: Earth / Hero */}
                            <div className="min-h-screen">
                                <Hero />
                            </div>

                            {/* PAGE 2: Comet passing / Aurora Stats */}
                            <div className="min-h-screen">
                                <MissionStats />
                            </div>

                            {/* PAGE 3: Black Hole / CTA */}
                            <div className="min-h-screen pt-32 pb-32">
                                <CTA />
                            </div>

                            {/* PAGE 4: Supernova / Footer */}
                            <div className="min-h-screen flex flex-col justify-end">
                                <Footer />
                            </div>

                        </div>
                    </Scroll>
                </ScrollControls>
            </Canvas>
        </div>
    )
}
