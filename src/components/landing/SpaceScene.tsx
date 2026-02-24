'use client'

import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Float, Trail } from '@react-three/drei'
import * as THREE from 'three'

/* ──────────────────────────────────────────────
   1. EARTH GLOBE — Realistic shader with clouds,
      ocean shimmer, atmospheric scattering, city
      lights on the night side
   ────────────────────────────────────────────── */
function Earth() {
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
                varying vec3 vWorldPos;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
                    vUv = uv;
                    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
                    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
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
                varying vec3 vWorldPos;

                // Improved noise
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
                float fbm(vec2 p) {
                    float f = 0.0;
                    f += 0.5000 * noise(p); p *= 2.02;
                    f += 0.2500 * noise(p); p *= 2.03;
                    f += 0.1250 * noise(p); p *= 2.01;
                    f += 0.0625 * noise(p);
                    return f / 0.9375;
                }

                void main() {
                    // Lighting
                    float NdotL = dot(vWorldNormal, uLightDir);
                    float daylight = smoothstep(-0.1, 0.3, NdotL);
                    
                    // Fresnel rim
                    vec3 viewDir = normalize(-vPosition);
                    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 4.0);
                    
                    // Continents via FBM
                    vec2 uv = vUv + vec2(uTime * 0.003, 0.0);
                    float n = fbm(uv * 6.0);
                    float continent = smoothstep(0.42, 0.52, n);
                    
                    // --- DAY SIDE ---
                    vec3 oceanDay = vec3(0.02, 0.08, 0.25);
                    vec3 shallowOcean = vec3(0.04, 0.15, 0.35);
                    vec3 landLow = vec3(0.05, 0.18, 0.04);
                    vec3 landHigh = vec3(0.12, 0.25, 0.08);
                    
                    float elevation = fbm(uv * 12.0);
                    vec3 oceanColor = mix(oceanDay, shallowOcean, smoothstep(0.35, 0.42, n));
                    vec3 landColor = mix(landLow, landHigh, elevation);
                    vec3 dayColor = mix(oceanColor, landColor, continent);
                    
                    // Ocean specular highlight
                    vec3 halfVec = normalize(uLightDir + viewDir);
                    float specular = pow(max(dot(vWorldNormal, halfVec), 0.0), 80.0);
                    dayColor += vec3(0.3, 0.4, 0.6) * specular * (1.0 - continent) * 0.6;

                    // --- NIGHT SIDE ---
                    vec3 nightBase = vec3(0.005, 0.005, 0.02);
                    // City lights
                    float cityNoise = fbm(vUv * 40.0);
                    float cityMask = continent * step(0.65, cityNoise) * 0.8;
                    vec3 cityColor = mix(vec3(1.0, 0.85, 0.4), vec3(1.0, 0.6, 0.2), hash(floor(vUv * 80.0)));
                    vec3 nightColor = nightBase + cityColor * cityMask;

                    // Blend day/night
                    vec3 surfaceColor = mix(nightColor, dayColor, daylight);
                    
                    // Atmosphere rim glow
                    vec3 atmosphereDay = vec3(0.3, 0.6, 1.0);
                    vec3 atmosphereNight = vec3(0.05, 0.1, 0.3);
                    vec3 atmosphere = mix(atmosphereNight, atmosphereDay, daylight);
                    surfaceColor += atmosphere * fresnel * 1.2;
                    
                    // Subtle aurora near poles  
                    float polarRegion = smoothstep(0.7, 0.95, abs(vUv.y - 0.5) * 2.0);
                    float auroraWave = sin(vUv.x * 30.0 + uTime * 0.5) * 0.5 + 0.5;
                    vec3 auroraColor = mix(vec3(0.1, 0.8, 0.4), vec3(0.2, 0.3, 1.0), auroraWave);
                    surfaceColor += auroraColor * polarRegion * auroraWave * 0.15 * (1.0 - daylight);

                    gl_FragColor = vec4(surfaceColor, 1.0);
                }
            `,
            transparent: false,
        })
    }, [])

    // Cloud layer shader
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
                float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
                float noise(vec2 p) {
                    vec2 i = floor(p); vec2 f = fract(p);
                    float a = hash(i); float b = hash(i+vec2(1,0));
                    float c = hash(i+vec2(0,1)); float d = hash(i+vec2(1,1));
                    vec2 u = f*f*(3.0-2.0*f);
                    return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
                }
                float fbm(vec2 p) {
                    float f = 0.0;
                    f += 0.5*noise(p); p*=2.02;
                    f += 0.25*noise(p); p*=2.03;
                    f += 0.125*noise(p);
                    return f / 0.875;
                }
                void main() {
                    vec2 uv = vUv + vec2(uTime * 0.005, uTime * 0.001);
                    float clouds = fbm(uv * 5.0);
                    clouds = smoothstep(0.45, 0.7, clouds);
                    
                    vec3 viewDir = normalize(-vPosition);
                    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);
                    
                    float alpha = clouds * 0.35 * (1.0 - fresnel * 0.5);
                    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            side: THREE.FrontSide,
        })
    }, [])

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.05
            material.uniforms.uTime.value = t
        }
        if (cloudRef.current) {
            cloudRef.current.rotation.y = t * 0.06
            cloudMaterial.uniforms.uTime.value = t
        }
    })

    return (
        <group position={[2.8, -0.3, 0]}>
            {/* Core planet */}
            <mesh ref={meshRef} material={material}>
                <sphereGeometry args={[2.2, 128, 128]} />
            </mesh>

            {/* Cloud layer */}
            <mesh ref={cloudRef} material={cloudMaterial}>
                <sphereGeometry args={[2.23, 96, 96]} />
            </mesh>

            {/* Inner atmosphere glow */}
            <mesh scale={[2.35, 2.35, 2.35]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial color="#4488ff" transparent opacity={0.06} side={THREE.BackSide} />
            </mesh>

            {/* Mid atmosphere */}
            <mesh scale={[2.5, 2.5, 2.5]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial color="#6699ff" transparent opacity={0.04} side={THREE.BackSide} />
            </mesh>

            {/* Outer atmospheric haze */}
            <mesh scale={[2.8, 2.8, 2.8]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="#2255cc" transparent opacity={0.02} side={THREE.BackSide} />
            </mesh>
        </group>
    )
}

/* ──────────────────────────────────────────────
   2. SATELLITE with realistic solar panels
   ────────────────────────────────────────────── */
function Satellite() {
    const groupRef = useRef<THREE.Group>(null!)

    useFrame((state) => {
        if (groupRef.current) {
            const t = state.clock.elapsedTime * 0.25
            groupRef.current.position.set(
                2.8 + Math.cos(t) * 3.5,
                -0.3 + Math.sin(t * 0.6) * 1.0,
                Math.sin(t) * 3.5
            )
            groupRef.current.rotation.z = t * 0.5
        }
    })

    return (
        <group ref={groupRef}>
            <Trail width={1.2} length={12} color="#2962FF" attenuation={(w) => w * w}>
                <Float speed={3} rotationIntensity={1.5} floatIntensity={0.5}>
                    <mesh>
                        <boxGeometry args={[0.1, 0.06, 0.18]} />
                        <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} emissive="#333333" />
                    </mesh>
                    <mesh position={[-0.2, 0, 0]}>
                        <boxGeometry args={[0.25, 0.005, 0.1]} />
                        <meshStandardMaterial color="#2962FF" emissive="#1848FF" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
                    </mesh>
                    <mesh position={[0.2, 0, 0]}>
                        <boxGeometry args={[0.25, 0.005, 0.1]} />
                        <meshStandardMaterial color="#2962FF" emissive="#1848FF" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
                    </mesh>
                    {/* Antenna */}
                    <mesh position={[0, 0.06, 0]}>
                        <cylinderGeometry args={[0.003, 0.003, 0.12]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                    {/* Signal light */}
                    <mesh position={[0, 0.12, 0]}>
                        <sphereGeometry args={[0.01]} />
                        <meshBasicMaterial color="#ff3333" />
                    </mesh>
                </Float>
            </Trail>
        </group>
    )
}

/* ──────────────────────────────────────────────
   3. SECOND SATELLITE — Different orbit plane
   ────────────────────────────────────────────── */
function Satellite2() {
    const groupRef = useRef<THREE.Group>(null!)

    useFrame((state) => {
        if (groupRef.current) {
            const t = state.clock.elapsedTime * 0.18 + 3.5
            groupRef.current.position.set(
                2.8 + Math.cos(t) * 4.5,
                -0.3 + Math.cos(t * 1.2) * 2.0,
                Math.sin(t) * 4.5
            )
        }
    })

    return (
        <group ref={groupRef}>
            <Trail width={0.7} length={8} color="#7E22CE" attenuation={(w) => w * w}>
                <Float speed={2} rotationIntensity={2} floatIntensity={0.3}>
                    <mesh>
                        <octahedronGeometry args={[0.05]} />
                        <meshStandardMaterial color="#ffffff" emissive="#7E22CE" emissiveIntensity={0.5} />
                    </mesh>
                </Float>
            </Trail>
        </group>
    )
}

/* ──────────────────────────────────────────────
   4. SHOOTING STARS — Random fast streaks
   ────────────────────────────────────────────── */
function ShootingStar({ delay }: { delay: number }) {
    const ref = useRef<THREE.Mesh>(null!)
    const startTime = useRef(delay)

    const reset = useCallback(() => {
        startTime.current = 0
        if (ref.current) {
            ref.current.position.set(
                (Math.random() - 0.5) * 30,
                (Math.random()) * 8 + 3,
                (Math.random() - 0.5) * 10 - 5
            )
        }
    }, [])

    useFrame((state, delta) => {
        if (!ref.current) return
        startTime.current += delta

        // Wait for the delay, then streak
        if (startTime.current > 4 + delay) {
            ref.current.position.x -= delta * 25
            ref.current.position.y -= delta * 12
            ref.current.visible = true

            if (ref.current.position.x < -20) {
                reset()
            }
        } else {
            ref.current.visible = false
        }
    })

    return (
        <mesh ref={ref} position={[15, 8, -5]}>
            <boxGeometry args={[0.6, 0.003, 0.003]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
    )
}

/* ──────────────────────────────────────────────
   5. ORBITAL RINGS — Animated torus rings
   ────────────────────────────────────────────── */
function OrbitalRings() {
    const ring1Ref = useRef<THREE.Mesh>(null!)
    const ring2Ref = useRef<THREE.Mesh>(null!)
    const ring3Ref = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (ring1Ref.current) {
            ring1Ref.current.rotation.x = Math.PI / 2.5 + Math.sin(t * 0.1) * 0.05
            ring1Ref.current.rotation.z = t * 0.04
        }
        if (ring2Ref.current) {
            ring2Ref.current.rotation.x = Math.PI / 3 + Math.cos(t * 0.08) * 0.05
            ring2Ref.current.rotation.z = -t * 0.025
        }
        if (ring3Ref.current) {
            ring3Ref.current.rotation.x = Math.PI / 4
            ring3Ref.current.rotation.z = t * 0.015
        }
    })

    return (
        <group position={[2.8, -0.3, 0]}>
            <mesh ref={ring1Ref}>
                <torusGeometry args={[3.2, 0.006, 16, 200]} />
                <meshBasicMaterial color="#2962FF" transparent opacity={0.25} />
            </mesh>
            <mesh ref={ring2Ref}>
                <torusGeometry args={[4.0, 0.004, 16, 200]} />
                <meshBasicMaterial color="#7E22CE" transparent opacity={0.15} />
            </mesh>
            <mesh ref={ring3Ref}>
                <torusGeometry args={[5.0, 0.003, 16, 200]} />
                <meshBasicMaterial color="#1848FF" transparent opacity={0.08} />
            </mesh>
        </group>
    )
}

/* ──────────────────────────────────────────────
   6. NEBULA CLOUD — Volumetric fog-like particles
   ────────────────────────────────────────────── */
function NebulaCloud() {
    const pointsRef = useRef<THREE.Points>(null!)

    const { positions, colors, sizes } = useMemo(() => {
        const count = 500
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            // Cluster around the top-left area for atmosphere
            positions[i * 3] = (Math.random() - 0.7) * 25
            positions[i * 3 + 1] = Math.random() * 15 - 2
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5

            // Color: mix of purples, blues, cyans
            const colorChoice = Math.random()
            if (colorChoice < 0.33) {
                colors[i * 3] = 0.15; colors[i * 3 + 1] = 0.1; colors[i * 3 + 2] = 0.5  // Deep blue
            } else if (colorChoice < 0.66) {
                colors[i * 3] = 0.3; colors[i * 3 + 1] = 0.05; colors[i * 3 + 2] = 0.4  // Purple
            } else {
                colors[i * 3] = 0.05; colors[i * 3 + 1] = 0.2; colors[i * 3 + 2] = 0.35 // Teal
            }

            sizes[i] = Math.random() * 0.15 + 0.02
        }
        return { positions, colors, sizes }
    }, [])

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.005
            pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.02
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.12}
                vertexColors
                transparent
                opacity={0.3}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    )
}

/* ──────────────────────────────────────────────
   7. FLOATING DEBRIS FIELD
   ────────────────────────────────────────────── */
function FloatingParticles() {
    const pointsRef = useRef<THREE.Points>(null!)

    const particles = useMemo(() => {
        const count = 300
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 25
            positions[i * 3 + 1] = (Math.random() - 0.5) * 15
            positions[i * 3 + 2] = (Math.random() - 0.5) * 12
        }
        return positions
    }, [])

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.008
            pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.02) * 0.01
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[particles, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.015}
                color="#88aaff"
                transparent
                opacity={0.5}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

/* ──────────────────────────────────────────────
   8. CAMERA RIG — Subtle breathing motion
   ────────────────────────────────────────────── */
function CameraRig() {
    const { camera } = useThree()

    useFrame((state) => {
        const t = state.clock.elapsedTime
        camera.position.x = Math.sin(t * 0.05) * 0.3
        camera.position.y = Math.cos(t * 0.03) * 0.15
        camera.lookAt(2, 0, 0)
    })

    return null
}

/* ──────────────────────────────────────────────
   MAIN SCENE EXPORT
   ────────────────────────────────────────────── */
export default function SpaceScene() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 7], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                style={{ background: 'transparent' }}
                dpr={[1, 2]}
            >
                {/* Camera breathing */}
                <CameraRig />

                {/* Deep space starfield */}
                <Stars radius={60} depth={100} count={4000} factor={3} saturation={0.2} fade speed={0.3} />

                {/* Lighting */}
                <ambientLight intensity={0.08} />
                <directionalLight position={[-5, 3, 5]} intensity={0.6} color="#ffffff" />
                <pointLight position={[-8, 2, 3]} intensity={0.3} color="#4488ff" />
                <pointLight position={[5, -3, -5]} intensity={0.15} color="#7E22CE" />

                {/* 3D Objects */}
                <Earth />
                <OrbitalRings />
                <Satellite />
                <Satellite2 />
                <NebulaCloud />
                <FloatingParticles />

                {/* Shooting stars */}
                <ShootingStar delay={0} />
                <ShootingStar delay={2.5} />
                <ShootingStar delay={5} />
                <ShootingStar delay={7.5} />
            </Canvas>
        </div>
    )
}
