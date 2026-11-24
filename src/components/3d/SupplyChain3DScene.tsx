import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Network, Activity, AlertCircle, CheckCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface NetworkNode {
  id: string;
  name: string;
  type: "supplier" | "hub" | "warehouse" | "channel";
  city?: string;
  throughput: string;
  status: "optimal" | "congested" | "critical";
  leadTimeDays: number;
  inventoryUnits: number;
  position: [number, number, number];
}

const NETWORK_NODES: NetworkNode[] = [
  // Suppliers
  { id: "sup_1", name: "Foxconn Electronics India", type: "supplier", city: "Chennai", throughput: "1,200 units/wk", status: "optimal", leadTimeDays: 7, inventoryUnits: 5000, position: [-12, 5, -8] },
  { id: "sup_2", name: "Assam Tea Planters Guild", type: "supplier", city: "Guwahati", throughput: "3,500 units/wk", status: "optimal", leadTimeDays: 4, inventoryUnits: 12000, position: [-12, 5, 0] },
  { id: "sup_3", name: "Supreme Industrial Polymers", type: "supplier", city: "Gujarat", throughput: "2,100 units/wk", status: "congested", leadTimeDays: 8, inventoryUnits: 4200, position: [-12, 5, 8] },

  // Central Hub
  { id: "hub_nagpur", name: "Nagpur Central Strategic Hub", type: "hub", city: "Nagpur", throughput: "12,400 units/wk", status: "optimal", leadTimeDays: 2, inventoryUnits: 28400, position: [-2, 1, 0] },

  // Regional Warehouses
  { id: "wh_mumbai", name: "Mumbai Harbor Fulfillment Port", type: "warehouse", city: "Mumbai", throughput: "4,800 units/wk", status: "congested", leadTimeDays: 3, inventoryUnits: 11200, position: [6, 2, -7] },
  { id: "wh_pune", name: "Pune High-Tech Distribution", type: "warehouse", city: "Pune", throughput: "3,900 units/wk", status: "critical", leadTimeDays: 3, inventoryUnits: 8100, position: [6, 2, 0] },
  { id: "wh_nashik", name: "Nashik Regional Facility", type: "warehouse", city: "Nashik", throughput: "2,200 units/wk", status: "optimal", leadTimeDays: 2, inventoryUnits: 6500, position: [6, 2, 7] },

  // Distribution Channels
  { id: "ch_ecom", name: "Tier-1 Quick-Commerce & E-Com", type: "channel", throughput: "6,500 units/wk", status: "optimal", leadTimeDays: 1, inventoryUnits: 0, position: [14, -2, -5] },
  { id: "ch_retail", name: "Omnichannel Superstore Retail", type: "channel", throughput: "4,100 units/wk", status: "optimal", leadTimeDays: 2, inventoryUnits: 0, position: [14, -2, 5] },
];

const CONNECTIONS: [string, string][] = [
  ["sup_1", "hub_nagpur"],
  ["sup_2", "hub_nagpur"],
  ["sup_3", "hub_nagpur"],
  ["hub_nagpur", "wh_mumbai"],
  ["hub_nagpur", "wh_pune"],
  ["hub_nagpur", "wh_nashik"],
  ["wh_mumbai", "ch_ecom"],
  ["wh_pune", "ch_ecom"],
  ["wh_pune", "ch_retail"],
  ["wh_nashik", "ch_retail"],
];

export function SupplyChain3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(NETWORK_NODES[3]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181e26);
    scene.fog = new THREE.FogExp2(0x181e26, 0.02);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 22, 28);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 30, 20);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00adb5, 3.0, 50);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    // Grid Floor
    const grid = new THREE.GridHelper(40, 40, 0x00adb5, 0x2d343f);
    grid.position.y = -4;
    scene.add(grid);

    // Render Nodes
    const nodeMeshes: { mesh: THREE.Mesh; node: NetworkNode }[] = [];
    const nodeMap = new Map<string, NetworkNode>();
    NETWORK_NODES.forEach((n) => nodeMap.set(n.id, n));

    NETWORK_NODES.forEach((node) => {
      let color = 0x00adb5; // default hub/wh
      let radius = 1.0;
      if (node.type === "hub") {
        color = 0x00adb5;
        radius = 1.6;
      } else if (node.type === "supplier") {
        color = 0x6366f1; // Indigo
        radius = 1.1;
      } else if (node.type === "channel") {
        color = 0x10b981; // Emerald
        radius = 1.2;
      } else if (node.status === "critical") {
        color = 0xef4444; // Red alert
        radius = 1.3;
      }

      const geo = new THREE.SphereGeometry(radius, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.2,
        metalness: 0.8,
        emissive: color,
        emissiveIntensity: node.status === "critical" ? 0.6 : 0.25,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...node.position);
      mesh.userData = { node };
      scene.add(mesh);
      nodeMeshes.push({ mesh, node });

      // Pulsing outer orbit ring for central hub or critical bottlenecks
      if (node.type === "hub" || node.status === "critical") {
        const ringGeo = new THREE.RingGeometry(radius * 1.3, radius * 1.5, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(...node.position);
        scene.add(ring);
      }
    });

    // Render Connection Tubes & Flow Particles
    const particleSystems: { curve: THREE.QuadraticBezierCurve3; particles: THREE.Points }[] = [];

    CONNECTIONS.forEach(([srcId, dstId]) => {
      const src = nodeMap.get(srcId);
      const dst = nodeMap.get(dstId);
      if (!src || !dst) return;

      const v1 = new THREE.Vector3(...src.position);
      const v2 = new THREE.Vector3(...dst.position);
      const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      mid.y += 2.5; // arc height

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.06, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x393e46,
        transparent: true,
        opacity: 0.6,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);

      // Flowing particle pulses
      const pCount = 8;
      const pPositions = new Float32Array(pCount * 3);
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));

      const pMat = new THREE.PointsMaterial({
        color: 0x00adb5,
        size: 0.35,
        transparent: true,
        opacity: 0.9,
      });

      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);
      particleSystems.push({ curve, particles });
    });

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(nodeMeshes.map((m) => m.mesh));
      if (hits.length > 0) {
        const found = hits[0].object.userData.node as NetworkNode;
        if (found) setSelectedNode(found);
      }
    };
    renderer.domElement.addEventListener("click", onClick);

    // Camera Orbiting
    let angle = 0;
    let animId: number;
    let particleOffset = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      angle += 0.002;
      camera.position.x = Math.sin(angle) * 32;
      camera.position.z = Math.cos(angle) * 32;
      camera.lookAt(0, 1, 0);

      // Update flow particles
      particleOffset = (particleOffset + 0.006) % 1.0;
      particleSystems.forEach(({ curve, particles }) => {
        const posAttr = particles.geometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        for (let i = 0; i < 8; i++) {
          const t = (particleOffset + i * 0.125) % 1.0;
          const pt = curve.getPoint(t);
          arr[i * 3] = pt.x;
          arr[i * 3 + 1] = pt.y;
          arr[i * 3 + 2] = pt.z;
        }
        posAttr.needsUpdate = true;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener("click", onClick);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-border/80 bg-[#181e26] shadow-xl">
      <div ref={containerRef} className="w-full h-full cursor-pointer" />

      {/* Title Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-[#222831]/85 backdrop-blur-md border border-[#393e46] px-4 py-2.5 rounded-2xl shadow-lg">
        <Network className="size-4 text-[#00adb5]" />
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide">3D End-to-End Supply Network</h4>
          <p className="text-[10px] text-gray-400">Suppliers → Central Hub → Regional Warehouses → Channels</p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-3 bg-[#222831]/85 backdrop-blur-md border border-[#393e46] px-4 py-2 rounded-2xl text-[11px] text-gray-300">
        <div className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-indigo-500" /> Suppliers</div>
        <div className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#00adb5]" /> Central Hub</div>
        <div className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-emerald-500" /> Channels</div>
        <div className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-rose-500 animate-ping" /> Bottleneck</div>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 z-10 w-80 bg-[#222831]/95 backdrop-blur-md border border-[#393e46] rounded-2xl p-4 shadow-2xl text-white">
          <div className="flex items-start justify-between border-b border-[#393e46] pb-2 mb-2.5">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#00adb5]">
                {selectedNode.type} Node • {selectedNode.city || "Strategic Hub"}
              </span>
              <h5 className="text-sm font-bold mt-0.5">{selectedNode.name}</h5>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedNode.status === "critical"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : selectedNode.status === "congested"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {selectedNode.status.toUpperCase()}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-gray-300">
            <div className="flex justify-between">
              <span>Weekly Throughput:</span>
              <span className="font-semibold text-white">{selectedNode.throughput}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Lead Time:</span>
              <span className="font-semibold text-white">{selectedNode.leadTimeDays} days</span>
            </div>
            {selectedNode.inventoryUnits > 0 && (
              <div className="flex justify-between">
                <span>Current On-Hand Stock:</span>
                <span className="font-bold text-[#00adb5]">{selectedNode.inventoryUnits.toLocaleString()} units</span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-[#393e46] text-[10px] text-gray-400 flex items-center justify-between">
            <span>Click any node to view routing analytics</span>
            <span className="text-[#00adb5] font-semibold flex items-center gap-1">Live Feed</span>
          </div>
        </div>
      )}
    </div>
  );
}
