'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Stars, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import MissionStats from '@/components/landing/MissionStats'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

// --- SHARED NOISE FUNCTIONS ---
const noiseShaderCode = `
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
`

// --- UNIVERSE PHENOMENA COMPONENT ---
function UniverseFlight() {
    const scroll = useScroll()
    const cameraGroup = useRef<THREE.Group>(null!)

    useFrame((state, delta) => {
        // Map 0-1 scroll to 0 to -120 z-depth
        const targetZ = -scroll.offset * 120

        // Very tight damping, NO bobbing/swaying so text is easy to read
        if (cameraGroup.current) {
            cameraGroup.current.position.z = THREE.MathUtils.damp(
                cameraGroup.current.position.z,
                targetZ,
                6, // Faster damping, tighter feel
                delta
            )
        }
    })

    return (
        <group>
            {/* The moving camera rig */}
            <group ref={cameraGroup}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
                <directionalLight position={[-5, 3, 5]} intensity={0.8} color="#ffffff" />
                <pointLight position={[5, -3, -5]} intensity={0.2} color="#ffffff" />
            </group>

            {/* Subdued global starfield (no spinning, fewer stars, no bright colors) */}
            <Stars radius={100} depth={200} count={1500} factor={2} saturation={0} fade speed={0.1} />
            <ambientLight intensity={0.05} />

            {/* STAGE 1: Minimalist Earth (z=0) */}
            <EarthStage position={[3.5, 0, 0]} />

            {/* STAGE 2: Minimalist Mars (z=-40) */}
            <MarsStage position={[-3.5, 0, -40]} />

            {/* STAGE 3: Minimalist Jupiter (z=-80) */}
            <JupiterStage position={[4.0, 0, -80]} />

            {/* STAGE 4: Black Hole (z=-120) */}
            <BlackHoleStage position={[-2.5, 0, -120]} />
        </group>
    )
}

/* --- STAGE 1: EARTH (Minimalist Dark Mode) --- */
function EarthStage({ position }: { position: [number, number, number] }) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const cloudRef = useRef<THREE.Mesh>(null!)

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

                ${noiseShaderCode}

                void main() {
                    float NdotL = dot(vWorldNormal, uLightDir);
                    float daylight = smoothstep(-0.1, 0.3, NdotL);
                    vec3 viewDir = normalize(-vPosition);
                    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 4.0);
                    
                    vec2 uv = vUv + vec2(uTime * 0.002, 0.0);
                    float n = fbm(uv * 6.0);
                    float continent = smoothstep(0.45, 0.55, n);
                    
                    // Very dark oceans and land
                    vec3 oceanColor = vec3(0.01, 0.02, 0.05);
                    vec3 landColor = vec3(0.02, 0.02, 0.02);
                    vec3 dayColor = mix(oceanColor, landColor, continent);
                    
                    vec3 nightColor = vec3(0.002, 0.002, 0.005);
                    
                    vec3 surfaceColor = mix(nightColor, dayColor, daylight);
                    
                    // Thin blue atmosphere edge
                    surfaceColor += vec3(0.1, 0.3, 0.8) * fresnel * 0.8 * daylight;

                    gl_FragColor = vec4(surfaceColor, 1.0);
                }
            `,
            transparent: false,
        })
    }, [])

    const cloudMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                ${noiseShaderCode}
                void main() {
                    vec2 uv = vUv + vec2(uTime * 0.004, 0.0);
                    float clouds = fbm(uv * 4.0);
                    clouds = smoothstep(0.5, 0.7, clouds);
                    vec3 viewDir = normalize(-vPosition);
                    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);
                    float alpha = clouds * 0.15 * (1.0 - fresnel * 0.5);
                    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
        })
    }, [])

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.02
            material.uniforms.uTime.value = t
        }
        if (cloudRef.current) {
            cloudRef.current.rotation.y = t * 0.025
            cloudMaterial.uniforms.uTime.value = t
        }
    })

    return (
        <group position={position}>
            <mesh ref={meshRef} material={material}>
                <sphereGeometry args={[2.5, 64, 64]} />
            </mesh>
            <mesh ref={cloudRef} material={cloudMaterial}>
                <sphereGeometry args={[2.52, 64, 64]} />
            </mesh>
        </group>
    )
}

/* --- STAGE 2: MARS (Minimalist) --- */
function MarsStage({ position }: { position: [number, number, number] }) {
    const meshRef = useRef<THREE.Mesh>(null!)

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

                ${noiseShaderCode}

                void main() {
                    float NdotL = dot(vWorldNormal, uLightDir);
                    float daylight = smoothstep(-0.1, 0.3, NdotL);
                    vec3 viewDir = normalize(-vPosition);
                    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
                    
                    vec2 uv = vUv + vec2(uTime * 0.001, 0.0);
                    float n1 = fbm(uv * 3.0);
                    float n2 = fbm(uv * 10.0 + n1);
                    
                    // Dark, dusty red/orange palette
                    vec3 color1 = vec3(0.15, 0.04, 0.01);
                    vec3 color2 = vec3(0.08, 0.02, 0.01);
                    vec3 dayColor = mix(color1, color2, smoothstep(0.3, 0.7, n2));
                    
                    vec3 nightColor = vec3(0.005, 0.001, 0.001);
                    vec3 surfaceColor = mix(nightColor, dayColor, daylight);
                    
                    // Thin rusty atmosphere
                    surfaceColor += vec3(0.3, 0.1, 0.05) * fresnel * 0.4 * daylight;

                    gl_FragColor = vec4(surfaceColor, 1.0);
                }
            `,
            transparent: false,
        })
    }, [])

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.015
            material.uniforms.uTime.value = t
        }
    })

    return (
        <group position={position}>
            <mesh ref={meshRef} material={material}>
                <sphereGeometry args={[2.0, 64, 64]} />
            </mesh>
        </group>
    )
}

/* --- STAGE 3: JUPITER (Minimalist Gas Giant) --- */
function JupiterStage({ position }: { position: [number, number, number] }) {
    const meshRef = useRef<THREE.Mesh>(null!)

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

                ${noiseShaderCode}

                void main() {
                    float NdotL = dot(vWorldNormal, uLightDir);
                    float daylight = smoothstep(-0.1, 0.3, NdotL);
                    
                    // Gas giant bands (horizontal stretching)
                    vec2 uv = vUv;
                    uv.x += uTime * 0.005;
                    float bands = sin(uv.y * 30.0 + fbm(uv * vec2(2.0, 10.0)) * 4.0);
                    
                    // Muted gas giant colors (beige, brown, grey-white)
                    vec3 bandColor1 = vec3(0.12, 0.10, 0.08);
                    vec3 bandColor2 = vec3(0.06, 0.05, 0.04);
                    vec3 dayColor = mix(bandColor1, bandColor2, smoothstep(-0.5, 0.5, bands));
                    
                    vec3 nightColor = vec3(0.002, 0.002, 0.002);
                    vec3 surfaceColor = mix(nightColor, dayColor, daylight);
                    
                    gl_FragColor = vec4(surfaceColor, 1.0);
                }
            `,
            transparent: false,
        })
    }, [])

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.03
            material.uniforms.uTime.value = t
        }
    })

    return (
        <group position={position}>
            <mesh ref={meshRef} material={material}>
                {/* Jupiter is larger */}
                <sphereGeometry args={[3.2, 64, 64]} />
            </mesh>
            {/* Dark faint ring system */}
            <mesh rotation-x={Math.PI / 2.2}>
                <torusGeometry args={[4.5, 0.2, 2, 100]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.03} />
            </mesh>
            <mesh rotation-x={Math.PI / 2.2}>
                <torusGeometry args={[5.2, 0.1, 2, 100]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.01} />
            </mesh>
        </group>
    )
}

/* --- STAGE 4: RESTING BLACK HOLE (Subdued) --- */
function BlackHoleStage({ position }: { position: [number, number, number] }) {
    const ringRef = useRef<THREE.Mesh>(null!)
    const particlesRef = useRef<THREE.Points>(null!)

    // Exact request: 1000 bright swirling particles
    const count = 1000
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2
            const radius = 2.5 + Math.random() * 4
            positions[i * 3] = Math.cos(angle) * radius
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2 // Very flat disk
            positions[i * 3 + 2] = Math.sin(angle) * radius
        }
        return positions
    }, [])

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (ringRef.current) {
            ringRef.current.rotation.z = -t * 0.1 // slower
            ringRef.current.rotation.x = Math.PI / 2.5
        }
        if (particlesRef.current) {
            particlesRef.current.rotation.y = t * 0.2 // slower
            particlesRef.current.rotation.x = Math.PI / 2.5
        }
    })

    return (
        <group position={position}>
            {/* The Event Horizon (Pure Black) */}
            <mesh>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Subdued Accretion Disk */}
            <mesh ref={ringRef}>
                <torusGeometry args={[3, 1.0, 16, 100]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* 1000 Bright Swirling Particles */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[particles, 3]} />
                </bufferGeometry>
                <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.8} />
            </points>
        </group>
    )
}

/* ──────────────────────────────────────────────
   PAGE WRAPPER
   ────────────────────────────────────────────── */
export default function UniverseExperience() {
    return (
        <div className="w-full h-screen bg-[#020202]">
            {/* Fixed Navbar on top of everything */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar />
            </div>

            <Canvas gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} dpr={[1, 2]}>
                <ScrollControls pages={4} damping={0.25}>

                    {/* The 3D Camera Flight reacting to scroll */}
                    <Scroll>
                        <UniverseFlight />
                    </Scroll>

                    {/* The HTML Overlay scrolling normally over the 3D scene */}
                    <Scroll html style={{ width: '100%' }}>
                        <div className="relative w-full">
                            {/* PAGE 1: Earth / Hero */}
                            <div className="min-h-screen">
                                <Hero />
                            </div>

                            {/* PAGE 2: Mars / Analytics Stats */}
                            <div className="min-h-screen">
                                <MissionStats />
                            </div>

                            {/* PAGE 3: Jupiter / CTA */}
                            <div className="min-h-screen pt-32 pb-32">
                                <CTA />
                            </div>

                            {/* PAGE 4: Black Hole / Footer */}
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
