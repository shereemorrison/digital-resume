import { useEffect, useLayoutEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Group, Object3D } from "three";

const heroModelUrl = `${import.meta.env.BASE_URL}Meshy_AI_Purple_Code_Muse_0514125713_texture.glb`;

const HERO_MODEL_MAX_SIZE = 4.65;

const DEFAULT_HERO_ROT_Y = 0.55;
/**
 * Shift mesh in world -Y after centering so the head clears the top of the square viewport
 * (legs may extend toward the bottom — layout / next section can cover them; no GPU leg clip).
 */
const HERO_WORLD_SHIFT_Y = -0.18;

const INITIAL_ORBIT_AZIMUTHAL = 0;

const INITIAL_ORBIT_POLAR = 1.055;

const HERO_CAMERA_DISTANCE = 6.05;
const HERO_CAMERA_FOV = 42;

function harmonizeResumeMaterials(root: Object3D) {
  const baseTint = new THREE.Color("#4a4366");
  const emissiveViolet = new THREE.Color("#9b5fd8");
  const emissiveTeal = new THREE.Color("#1a6b5c");

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) {
      if (!mat) continue;
      if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
        mat.color.lerp(baseTint, 0.07);
        const e = mat.emissive.clone();
        e.lerp(emissiveViolet, 0.14).lerp(emissiveTeal, 0.06);
        mat.emissive.copy(e);
        mat.emissiveIntensity = THREE.MathUtils.clamp(
          (mat.emissiveIntensity ?? 0) * 0.92 + 0.08,
          0.06,
          0.65
        );
        mat.roughness = THREE.MathUtils.clamp(mat.roughness * 0.96 + 0.02, 0.2, 0.72);
        mat.metalness = THREE.MathUtils.clamp(mat.metalness * 0.88 + 0.06, 0.06, 0.48);
        mat.envMapIntensity = (mat.envMapIntensity ?? 1) * 1.08;
        mat.needsUpdate = true;
      } else if (mat instanceof THREE.MeshLambertMaterial || mat instanceof THREE.MeshPhongMaterial) {
        mat.color.lerp(baseTint, 0.06);
        mat.emissive?.lerp(emissiveViolet, 0.1);
        mat.needsUpdate = true;
      } else if (mat instanceof THREE.MeshBasicMaterial) {
        mat.color.lerp(baseTint, 0.05);
        mat.toneMapped = true;
        mat.needsUpdate = true;
      } else if (mat instanceof THREE.MeshToonMaterial) {
        mat.color.lerp(baseTint, 0.07);
        mat.emissive?.lerp(emissiveViolet, 0.12);
        mat.needsUpdate = true;
      }
    }
  });
}

function fitAndCenter(root: Object3D, maxSize = 2.35) {
  root.scale.set(1, 1, 1);
  root.position.set(0, 0, 0);
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z, 1e-5);
  const uniform = maxSize / maxDim;
  root.scale.setScalar(uniform);
  root.updateMatrixWorld(true);
  const box2 = new THREE.Box3().setFromObject(root);
  const c = new THREE.Vector3();
  box2.getCenter(c);
  root.position.sub(c);
}

/** Camera position for frame 0 = OrbitControls spherical(r, polar, azimuthal) so there is no “default then snap” flash. */
function heroInitialCameraPosition(): [number, number, number] {
  const sph = new THREE.Spherical(HERO_CAMERA_DISTANCE, INITIAL_ORBIT_POLAR, INITIAL_ORBIT_AZIMUTHAL);
  const v = new THREE.Vector3().setFromSpherical(sph);
  return [v.x, v.y, v.z];
}

function HeroModel() {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(heroModelUrl);
  const { actions } = useAnimations(animations, group);

  useLayoutEffect(() => {
    harmonizeResumeMaterials(scene);
    fitAndCenter(scene, HERO_MODEL_MAX_SIZE);
    scene.position.y += HERO_WORLD_SHIFT_Y;
  }, [scene]);

  useEffect(() => {
    if (!actions || animations.length === 0) return;
    const names = Object.keys(actions);
    const clipName = names.find((n) => /idle|stand|loop|breath/i.test(n)) ?? names[0];
    const action = clipName ? actions[clipName] : undefined;
    action?.reset().fadeIn(0.35).play();
    return () => {
      action?.fadeOut(0.25);
    };
  }, [actions, animations.length]);

  return (
    <group ref={group} rotation={[0, DEFAULT_HERO_ROT_Y, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(heroModelUrl);

function Scene() {
  const orbitRef = useRef<{
    target: THREE.Vector3;
    azimuthalAngle: number;
    polarAngle: number;
    update: () => void;
  } | null>(null);

  useLayoutEffect(() => {
    const oc = orbitRef.current;
    if (!oc) return;
    oc.target.set(0, 0, 0);
    oc.azimuthalAngle = INITIAL_ORBIT_AZIMUTHAL;
    oc.polarAngle = INITIAL_ORBIT_POLAR;
    oc.update();
  }, []);

  return (
    <>
      <color attach="background" args={["#050508"]} />
      <fog attach="fog" args={["#08060c", 18, 48]} />
      <ambientLight intensity={0.72} color="#dcd4f0" />
      <hemisphereLight args={["#c8bdf5", "#1a2830", 0.45]} position={[0, 3, 0]} />
      <directionalLight position={[3.8, 6.2, 4.2]} intensity={1.45} color="#fff5ff" />
      <directionalLight position={[-4.5, 2.5, -2.5]} intensity={0.62} color="#9cf0e4" />
      <pointLight position={[-2.2, 0.2, 2.8]} intensity={0.75} color="#b87aff" distance={14} decay={2} />
      <HeroModel />
      <OrbitControls
        ref={orbitRef}
        makeDefault
        enablePan={false}
        enableZoom={false}
        minDistance={HERO_CAMERA_DISTANCE}
        maxDistance={HERO_CAMERA_DISTANCE}
        minPolarAngle={0.32}
        maxPolarAngle={Math.PI - 0.32}
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.85}
      />
    </>
  );
}

export function BackgroundScene() {
  const dpr = Math.min(window.devicePixelRatio ?? 1, 2);

  return (
    <div style={{ width: "100%", height: "100%", touchAction: "none" }}>
      <Canvas
        dpr={dpr}
        camera={{
          position: heroInitialCameraPosition(),
          fov: HERO_CAMERA_FOV,
        }}
        gl={{ alpha: false, antialias: true, powerPreference: "default", localClippingEnabled: false }}
        onCreated={({ gl, camera }) => {
          camera.lookAt(0, 0, 0);
          gl.setClearColor("#050508", 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.28;
          gl.localClippingEnabled = false;
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
