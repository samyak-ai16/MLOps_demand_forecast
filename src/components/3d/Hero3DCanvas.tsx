import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function Hero3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x11161d, 0.03);

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(12, 10, 15);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(20, 30, 20);
    scene.add(dirLight);

    // Glowing Teal Point Light
    const tealPointLight = new THREE.PointLight(0x00adb5, 4.0, 35);
    tealPointLight.position.set(0, 6, 0);
    scene.add(tealPointLight);

    // Subtle Purple Secondary Accent
    const purpleLight = new THREE.PointLight(0x818cf8, 2.0, 30);
    purpleLight.position.set(-8, 5, -8);
    scene.add(purpleLight);

    // Isometric Grid Floor
    const grid = new THREE.GridHelper(30, 30, 0x00adb5, 0x242d38);
    grid.position.y = -0.01;
    scene.add(grid);

    // 1. Futuristic Warehouse Building Block
    const buildingGeo = new THREE.BoxGeometry(7, 4, 10);
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x222831,
      metalness: 0.6,
      roughness: 0.3,
    });
    const building = new THREE.Mesh(buildingGeo, buildingMat);
    building.position.set(-3, 2, -2);
    scene.add(building);

    // Illuminated Architectural Roof Struts
    const roofGeo = new THREE.BoxGeometry(7.2, 0.2, 10.2);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x393e46,
      metalness: 0.8,
      roughness: 0.2,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(-3, 4.1, -2);
    scene.add(roof);

    // Glowing Warehouse Entrance Bay
    const bayGeo = new THREE.BoxGeometry(2.4, 2.2, 0.2);
    const bayMat = new THREE.MeshBasicMaterial({ color: 0x00adb5, transparent: true, opacity: 0.4 });
    const bay = new THREE.Mesh(bayGeo, bayMat);
    bay.position.set(-3, 1.1, 3.01);
    scene.add(bay);

    // 2. Floating Futuristic Product Crates
    const crateGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const crateMat = new THREE.MeshStandardMaterial({
      color: 0x00adb5,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0x00adb5,
      emissiveIntensity: 0.2,
    });

    const floatingCrates: THREE.Mesh[] = [];
    const crateOffsets = [
      [3, 3, 2],
      [4.5, 4.2, -1],
      [2, 5, -3],
      [5, 2.5, 3.5],
      [-1, 5.5, 3],
    ];

    crateOffsets.forEach(([x, y, z], idx) => {
      const crate = new THREE.Mesh(crateGeo, crateMat);
      crate.position.set(x, y, z);
      crate.rotation.set(0.3 * idx, 0.4 * idx, 0.2 * idx);
      scene.add(crate);
      floatingCrates.push(crate);
    });

    // 3. Moving Logistics Delivery Vehicle
    const truckGroup = new THREE.Group();
    const cabGeo = new THREE.BoxGeometry(1.0, 0.9, 1.2);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.4 });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0, 0.6, 0.8);
    truckGroup.add(cab);

    const cargoGeo = new THREE.BoxGeometry(1.2, 1.3, 2.2);
    const cargoMat = new THREE.MeshStandardMaterial({
      color: 0x222831,
      metalness: 0.7,
      roughness: 0.3,
    });
    const cargo = new THREE.Mesh(cargoGeo, cargoMat);
    cargo.position.set(0, 0.9, -0.7);
    truckGroup.add(cargo);

    // Neon Headlights
    const lightGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x00adb5 });
    const l1 = new THREE.Mesh(lightGeo, lightMat);
    l1.position.set(-0.35, 0.4, 1.4);
    const l2 = new THREE.Mesh(lightGeo, lightMat);
    l2.position.set(0.35, 0.4, 1.4);
    truckGroup.add(l1, l2);

    truckGroup.position.set(4, 0, 4);
    scene.add(truckGroup);

    // 4. Floating Data Particles Field
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 25;
      positions[i + 1] = Math.random() * 10;
      positions[i + 2] = (Math.random() - 0.5) * 25;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00adb5,
      size: 0.15,
      transparent: true,
      opacity: 0.7,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Parallax Interaction
    let targetX = 12;
    let targetY = 10;
    const onMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetX = 12 + normX * 3;
      targetY = 10 + normY * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animation Loop
    let animId: number;
    let truckAngle = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 1.5, 0);

      // Rotate & hover floating crates
      floatingCrates.forEach((c, idx) => {
        c.rotation.x += 0.008;
        c.rotation.y += 0.01;
        c.position.y += Math.sin(elapsedTime * 2 + idx) * 0.004;
      });

      // Move delivery truck along rectangular route
      truckAngle += 0.012;
      const radiusX = 6.5;
      const radiusZ = 6.0;
      const newX = 3 + Math.cos(truckAngle) * radiusX;
      const newZ = 1 + Math.sin(truckAngle) * radiusZ;
      const dx = newX - truckGroup.position.x;
      const dz = newZ - truckGroup.position.z;
      truckGroup.rotation.y = Math.atan2(dx, dz);
      truckGroup.position.set(newX, 0, newZ);

      // Rotate particle cloud gently
      particleSystem.rotation.y += 0.001;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
