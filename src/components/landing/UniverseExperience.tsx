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
                    float daylight = smoothstep(-0.2, 0.4, NdotL);
                    vec3 viewDir = normalize(-vPosition);
                    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
                    
                    vec2 uv = vUv + vec2(uTime * 0.01, 0.0); // Earth rotation
                    
                    // Generate continents and oceans
                    float n = fbm(uv * 7.0);
                    float continent = smoothstep(0.48, 0.55, n);
                    
                    // Dark oceans and land
                    vec3 oceanColor = vec3(0.01, 0.03, 0.08);
                    vec3 landColor = vec3(0.04, 0.05, 0.04);
                    vec3 dayColor = mix(oceanColor, landColor, continent);
                    
                    // Specular reflection for oceans only
                    vec3 halfVector = normalize(uLightDir + viewDir);
                    float NdotH = max(0.0, dot(vWorldNormal, halfVector));
                    float specular = pow(NdotH, 50.0) * (1.0 - continent) * 0.8; // Only ocean reflects
                    
                    vec3 nightColor = vec3(0.002, 0.002, 0.005);
                    
                    // Combine diffuse and specular
                    vec3 surfaceColor = mix(nightColor, dayColor, daylight) + (specular * daylight * vec3(0.8, 0.9, 1.0));
                    
                    // Atmospheric scattering (rim glow)
                    vec3 atmosphereColor = vec3(0.2, 0.5, 1.0);
                    surfaceColor += atmosphereColor * fresnel * 0.6 * smoothstep(-0.5, 0.5, NdotL);

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
                    // Clouds rotate slightly faster than the earth
                    vec2 uv = vUv + vec2(uTime * 0.015, 0.0);
                    float clouds = fbm(uv * 5.0) * fbm(uv * 10.0 + uTime * 0.005); // dynamic swirling
                    clouds = smoothstep(0.4, 0.8, clouds);
                    
                    vec3 viewDir = normalize(-vPosition);
                    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);
                    
                    // Clouds are thicker at edge
                    float alpha = clouds * 0.5 + (fresnel * clouds * 0.3);
                    
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

                // Ridged noise for crisp craters
                float ridgedMF(vec2 p) {
                    float sum = 0.0;
                    float freq = 1.0;
                    float amp = 0.5;
                    for(int i=0; i<4; i++) {
                        float n = abs(noise(p * freq));
                        sum += (1.0 - n) * amp;
                        freq *= 2.0;
                        amp *= 0.5;
                    }
                    return sum;
                }

                void main() {
                    float NdotL = dot(vWorldNormal, uLightDir);
                    float daylight = smoothstep(-0.2, 0.4, NdotL);
                    vec3 viewDir = normalize(-vPosition);
                    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
                    
                    vec2 uv = vUv + vec2(uTime * 0.005, 0.0);
                    
                    // Craters and ridges
                    float n1 = fbm(uv * 4.0);
                    float craters = ridgedMF(uv * 15.0 + n1);
                    
                    // Dark, dusty red/orange palette
                    vec3 color1 = vec3(0.25, 0.08, 0.03); // Lighter rust
                    vec3 color2 = vec3(0.10, 0.02, 0.01); // Deep rust
                    vec3 dayColor = mix(color2, color1, smoothstep(0.2, 0.8, craters));
                    
                    // Ice Caps at the poles (vUv.y close to 0 or 1)
                    float distToPole = min(vUv.y, 1.0 - vUv.y);
                    float iceMask = smoothstep(0.15, 0.05, distToPole + fbm(uv * 10.0) * 0.05);
                    vec3 iceColor = vec3(0.8, 0.85, 0.9);
                    dayColor = mix(dayColor, iceColor, iceMask);
                    
                    vec3 nightColor = vec3(0.01, 0.005, 0.005);
                    vec3 surfaceColor = mix(nightColor, dayColor, daylight);
                    
                    // Thin rusty atmosphere
                    vec3 atmosphereColor = vec3(0.5, 0.2, 0.1);
                    surfaceColor += atmosphereColor * fresnel * 0.4 * smoothstep(-0.2, 0.5, NdotL);

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
                    float daylight = smoothstep(-0.2, 0.4, NdotL);
                    vec3 viewDir = normalize(-vPosition);
                    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
                    
                    vec2 uv = vUv;
                    
                    // Differential rotation (bands move at different speeds based on latitude)
                    // uv.y maps 0 to 1 top to bottom.
                    float bandSpeed = sin(uv.y * 15.0) * 0.02; 
                    uv.x += uTime * bandSpeed + uTime * 0.01;
                    
                    // Complex fluid turbulence
                    vec2 noiseUv = uv * vec2(4.0, 15.0);
                    float n1 = fbm(noiseUv);
                    float n2 = fbm(noiseUv + vec2(n1, n1) + uTime * 0.02);
                    
                    // Horizontal stretching for gas giant look, perturbed by turbulence
                    float bands = sin(uv.y * 40.0 + n2 * 5.0);
                    
                    // Vivid but slightly muted gas giant colors
                    vec3 color1 = vec3(0.25, 0.20, 0.15); // Beige
                    vec3 color2 = vec3(0.12, 0.08, 0.06); // Deep brown
                    vec3 color3 = vec3(0.30, 0.28, 0.25); // Cream/White
                    
                    vec3 dayColor = mix(color1, color2, smoothstep(-0.5, 0.5, bands));
                    // Introduce storms/cream clouds in highly turbulent areas
                    dayColor = mix(dayColor, color3, smoothstep(0.6, 1.0, n2));
                    
                    vec3 nightColor = vec3(0.01, 0.01, 0.01);
                    vec3 surfaceColor = mix(nightColor, dayColor, daylight);

                    // Soft atmospheric rim
                    surfaceColor += vec3(0.2, 0.15, 0.1) * fresnel * 0.5 * daylight;
                    
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

                            {/* DEMO VIDEO SECTION */}
                            <div className="w-full py-12 md:py-24 relative z-10">
                                <div className="max-w-5xl mx-auto px-6">
                                    <div className="text-center mb-10 md:mb-16">
                                        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                                            See StockPulse in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1848FF] to-[#7E22CE]">Action</span>
                                        </h2>
                                        <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg px-4">
                                            Watch how professional-grade charting, AI sentiment analysis, and instant fuzzy-search come together in one distraction-free dashboard.
                                        </p>
                                    </div>

                                    {/* Video Player Container */}
                                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(24,72,255,0.15)] bg-black/40 aspect-[1920/1032] backdrop-blur-md group mx-auto">
                                        <video
                                            src="/videos/demo-optimized.mp4"
                                            controls
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover rounded-2xl"
                                        >
                                            Your browser does not support the video tag.
                                        </video>

                                        {/* Decorative glow behind video */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[#1848FF] to-[#7E22CE] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-1000 -z-10 rounded-3xl" />
                                    </div>
                                </div>
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
