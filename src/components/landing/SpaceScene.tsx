'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, Trail } from '@react-three/drei'
import * as THREE from 'three'

/* ──────────────────────────────────────────────
   1. EARTH GLOBE — A sphere with a custom shader
      that simulates atmosphere glow + dark continents
   ────────────────────────────────────────────── */
function Earth() {
    const meshRef = useRef<THREE.Mesh>(null!)

    // Custom shader material for the "dark tech globe" look
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;

                // Simple noise for continent-like patterns
                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
                }

                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    float a = hash(i);
                    float b = hash(i + vec2(1.0, 0.0));
                    float c = hash(i + vec2(0.0, 1.0));
                    float d = hash(i + vec2(1.0, 1.0));
                    vec2 u = f * f * (3.0 - 2.0 * f);
                    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
                }

                void main() {
                    // Fresnel rim lighting (atmosphere glow)
                    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);

                    // Continent pattern
                    float n = noise(vUv * 8.0 + uTime * 0.01);
                    n += noise(vUv * 16.0) * 0.5;
                    n += noise(vUv * 32.0) * 0.25;
                    float continent = smoothstep(0.45, 0.55, n);

                    // Ocean: deep dark blue, Land: slightly brighter
                    vec3 oceanColor = vec3(0.02, 0.04, 0.12);
                    vec3 landColor = vec3(0.06, 0.12, 0.08);
                    vec3 baseColor = mix(oceanColor, landColor, continent);

                    // Grid lines (latitude/longitude)
                    float latLine = smoothstep(0.97, 1.0, abs(sin(vUv.y * 3.14159 * 18.0)));
                    float lonLine = smoothstep(0.97, 1.0, abs(sin(vUv.x * 3.14159 * 36.0)));
                    float grid = max(latLine, lonLine) * 0.15;

                    // Atmosphere rim
                    vec3 atmosphereColor = vec3(0.1, 0.4, 1.0);
                    vec3 finalColor = baseColor + grid + atmosphereColor * fresnel * 0.8;

                    // City lights on dark side (scattered bright dots)
                    float cities = step(0.92, hash(floor(vUv * 60.0))) * (1.0 - continent) * 0.0;
                    cities += step(0.88, hash(floor(vUv * 40.0))) * continent * 0.5;
                    finalColor += vec3(1.0, 0.9, 0.6) * cities * 0.3;

                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `,
            transparent: false,
        })
    }, [])

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.001
            material.uniforms.uTime.value = state.clock.elapsedTime
        }
    })

    return (
        <group position={[2.5, -0.5, 0]}>
            {/* Main globe */}
            <mesh ref={meshRef} material={material}>
                <sphereGeometry args={[2, 64, 64]} />
            </mesh>

            {/* Atmosphere glow ring */}
            <mesh scale={[2.15, 2.15, 2.15]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial
                    color="#4488ff"
                    transparent
                    opacity={0.08}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Outer atmosphere haze */}
            <mesh scale={[2.4, 2.4, 2.4]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color="#2255cc"
                    transparent
                    opacity={0.04}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    )
}

/* ──────────────────────────────────────────────
   2. SATELLITE — A small object orbiting the Earth
   ────────────────────────────────────────────── */
function Satellite() {
    const groupRef = useRef<THREE.Group>(null!)
    const satelliteRef = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        if (groupRef.current) {
            const t = state.clock.elapsedTime * 0.3
            groupRef.current.position.set(
                2.5 + Math.cos(t) * 3.2,
                -0.5 + Math.sin(t * 0.7) * 0.8,
                Math.sin(t) * 3.2
            )
        }
    })

    return (
        <group ref={groupRef}>
            <Trail
                width={0.8}
                length={8}
                color="#4488ff"
                attenuation={(w) => w * w}
            >
                <Float speed={4} rotationIntensity={2} floatIntensity={1}>
                    <mesh ref={satelliteRef}>
                        {/* Satellite body */}
                        <boxGeometry args={[0.08, 0.08, 0.15]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                    {/* Solar panel left */}
                    <mesh position={[-0.15, 0, 0]}>
                        <boxGeometry args={[0.2, 0.01, 0.08]} />
                        <meshBasicMaterial color="#2962FF" />
                    </mesh>
                    {/* Solar panel right */}
                    <mesh position={[0.15, 0, 0]}>
                        <boxGeometry args={[0.2, 0.01, 0.08]} />
                        <meshBasicMaterial color="#2962FF" />
                    </mesh>
                </Float>
            </Trail>
        </group>
    )
}

/* ──────────────────────────────────────────────
   3. SECOND SATELLITE — Different orbit
   ────────────────────────────────────────────── */
function Satellite2() {
    const groupRef = useRef<THREE.Group>(null!)

    useFrame((state) => {
        if (groupRef.current) {
            const t = state.clock.elapsedTime * 0.2 + 2
            groupRef.current.position.set(
                2.5 + Math.cos(t) * 4,
                -0.5 + Math.cos(t * 1.3) * 1.5,
                Math.sin(t) * 4
            )
        }
    })

    return (
        <group ref={groupRef}>
            <Trail
                width={0.5}
                length={6}
                color="#7E22CE"
                attenuation={(w) => w * w}
            >
                <Float speed={3} rotationIntensity={3} floatIntensity={0.5}>
                    <mesh>
                        <octahedronGeometry args={[0.06]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                </Float>
            </Trail>
        </group>
    )
}

/* ──────────────────────────────────────────────
   4. ORBITAL RINGS — Wireframe rings around Earth
   ────────────────────────────────────────────── */
function OrbitalRings() {
    const ring1Ref = useRef<THREE.Mesh>(null!)
    const ring2Ref = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (ring1Ref.current) {
            ring1Ref.current.rotation.x = Math.PI / 2.5 + Math.sin(t * 0.1) * 0.05
            ring1Ref.current.rotation.z = t * 0.05
        }
        if (ring2Ref.current) {
            ring2Ref.current.rotation.x = Math.PI / 3 + Math.cos(t * 0.08) * 0.05
            ring2Ref.current.rotation.z = -t * 0.03
        }
    })

    return (
        <group position={[2.5, -0.5, 0]}>
            <mesh ref={ring1Ref}>
                <torusGeometry args={[3, 0.005, 16, 100]} />
                <meshBasicMaterial color="#2962FF" transparent opacity={0.3} />
            </mesh>
            <mesh ref={ring2Ref}>
                <torusGeometry args={[3.8, 0.003, 16, 100]} />
                <meshBasicMaterial color="#7E22CE" transparent opacity={0.2} />
            </mesh>
        </group>
    )
}

/* ──────────────────────────────────────────────
   5. FLOATING PARTICLES — Dust/debris field
   ────────────────────────────────────────────── */
function FloatingParticles() {
    const pointsRef = useRef<THREE.Points>(null!)

    const particles = useMemo(() => {
        const count = 200
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20
            positions[i * 3 + 1] = (Math.random() - 0.5) * 12
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10
        }
        return positions
    }, [])

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#4488ff"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    )
}

/* ──────────────────────────────────────────────
   MAIN SCENE EXPORT
   ────────────────────────────────────────────── */
export default function SpaceScene() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
                dpr={[1, 2]}
            >
                {/* Ambient starfield */}
                <Stars
                    radius={50}
                    depth={80}
                    count={3000}
                    factor={3}
                    saturation={0}
                    fade
                    speed={0.5}
                />

                {/* Subtle ambient light */}
                <ambientLight intensity={0.1} />

                {/* Key light simulating sun */}
                <directionalLight
                    position={[-5, 3, 5]}
                    intensity={0.5}
                    color="#ffffff"
                />

                {/* 3D Objects */}
                <Earth />
                <OrbitalRings />
                <Satellite />
                <Satellite2 />
                <FloatingParticles />
            </Canvas>
        </div>
    )
}
