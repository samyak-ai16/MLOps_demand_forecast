import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Package, AlertTriangle, Eye, Layers, RotateCw, ZoomIn,
  ShieldCheck, Info, CheckCircle2, ChevronRight, X
} from "lucide-react";

interface WarehouseSection {
  id: string;
  name: string;
  zone: string;
  category: string;
  capacity: number;
  currentStock: number;
  utilization: number;
  status: "optimal" | "warning" | "critical";
  skuCount: number;
  topProduct: string;
  position: [number, number, number];
}

const SECTIONS: WarehouseSection[] = [
  {
    id: "bay_a1",
    name: "Bay A-01 (High-Value Racks)",
    zone: "Zone A",
    category: "Electronics",
    capacity: 500,
    currentStock: 145,
    utilization: 29.0,
    status: "critical",
    skuCount: 4,
    topProduct: "UltraBook Pro 15-inch Laptop",
    position: [-6, 0, -4],
  },
  {
    id: "bay_a2",
    name: "Bay A-02 (Peripherals)",
    zone: "Zone A",
    category: "Electronics",
    capacity: 600,
    currentStock: 480,
    utilization: 80.0,
    status: "optimal",
    skuCount: 6,
    topProduct: "FitPulse Health Smartwatch V3",
    position: [-6, 0, 4],
  },
  {
    id: "bay_b1",
    name: "Bay B-01 (Fast Moving FMCG)",
    zone: "Zone B",
    category: "FMCG",
    capacity: 1200,
    currentStock: 980,
    utilization: 81.6,
    status: "optimal",
    skuCount: 8,
    topProduct: "Assam Gold CTC Tea 1kg",
    position: [0, 0, -4],
  },
  {
    id: "bay_b2",
    name: "Bay B-02 (Oils & Dry Groceries)",
    zone: "Zone B",
    category: "FMCG",
    capacity: 800,
    currentStock: 310,
    utilization: 38.7,
    status: "warning",
    skuCount: 5,
    topProduct: "Extra Virgin Olive Oil 1L",
    position: [0, 0, 4],
  },
  {
    id: "bay_c1",
    name: "Bay C-01 (Heavy Equipment & Storage)",
    zone: "Zone C",
    category: "Industrial",
    capacity: 1500,
    currentStock: 1310,
    utilization: 87.3,
    status: "optimal",
    skuCount: 4,
    topProduct: "Heavy-Duty Stackable Crates 60L",
    position: [6, 0, -4],
  },
  {
    id: "bay_c2",
    name: "Bay C-02 (Apparel & Footwear)",
    zone: "Zone D",
    category: "Apparel",
    capacity: 900,
    currentStock: 650,
    utilization: 72.2,
    status: "optimal",
    skuCount: 5,
    topProduct: "AirStride Velocity Running Shoes",
    position: [6, 0, 4],
  },
];

export function Warehouse3DScene({ warehouseName = "Nagpur Central Logistics Hub" }: { warehouseName?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedSection, setSelectedSection] = useState<WarehouseSection | null>(SECTIONS[0]);
  const [viewMode, setViewMode] = useState<"standard" | "heatmap" | "wireframe">("standard");
  const [autoRotate, setAutoRotate] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181e26);
    scene.fog = new THREE.FogExp2(0x181e26, 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(16, 14, 18);
    camera.lookAt(0, 2, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Teal Neon Accent Light
    const tealLight = new THREE.PointLight(0x00adb5, 2.5, 40);
    tealLight.position.set(0, 10, 0);
    scene.add(tealLight);

    // 4. Warehouse Concrete Floor with Grid Lines
    const floorGeo = new THREE.PlaneGeometry(36, 26);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x222831,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(36, 36, 0x00adb5, 0x393e46);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 5. Build Racking Systems & Storage Boxes
    const sectionMeshes: { mesh: THREE.Mesh; section: WarehouseSection }[] = [];
    const rackMaterial = new THREE.MeshStandardMaterial({
      color: 0x393e46,
      metalness: 0.7,
      roughness: 0.3,
    });

    SECTIONS.forEach((sec) => {
      const group = new THREE.Group();
      group.position.set(sec.position[0], sec.position[1], sec.position[2]);

      // Upright Rack Columns
      const colGeo = new THREE.BoxGeometry(0.18, 5.0, 0.18);
      const colCoords = [
        [-1.8, 2.5, -1.0],
        [1.8, 2.5, -1.0],
        [-1.8, 2.5, 1.0],
        [1.8, 2.5, 1.0],
      ];
      colCoords.forEach(([x, y, z]) => {
        const col = new THREE.Mesh(colGeo, rackMaterial);
        col.position.set(x, y, z);
        col.castShadow = true;
        group.add(col);
      });

      // Shelving Horizontal Beams (3 tiers)
      const beamGeoX = new THREE.BoxGeometry(3.6, 0.12, 0.12);
      const beamGeoZ = new THREE.BoxGeometry(0.12, 0.12, 2.0);
      [1.2, 2.8, 4.4].forEach((level) => {
        const b1 = new THREE.Mesh(beamGeoX, rackMaterial);
        b1.position.set(0, level, -1.0);
        group.add(b1);

        const b2 = new THREE.Mesh(beamGeoX, rackMaterial);
        b2.position.set(0, level, 1.0);
        group.add(b2);

        const b3 = new THREE.Mesh(beamGeoZ, rackMaterial);
        b3.position.set(-1.8, level, 0);
        group.add(b3);

        const b4 = new THREE.Mesh(beamGeoZ, rackMaterial);
        b4.position.set(1.8, level, 0);
        group.add(b4);

        // Pallet Deck Base
        const deckGeo = new THREE.BoxGeometry(3.4, 0.06, 1.8);
        const deckMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.9 });
        const deck = new THREE.Mesh(deckGeo, deckMat);
        deck.position.set(0, level + 0.04, 0);
        group.add(deck);

        // Stored Carton Boxes
        const boxCount = sec.status === "critical" ? 1 : sec.status === "warning" ? 3 : 5;
        const boxGeo = new THREE.BoxGeometry(0.65, 0.55, 0.65);

        for (let bx = 0; bx < boxCount; bx++) {
          let boxColor = 0xc89666; // cardboard
          if (viewMode === "heatmap") {
            boxColor = sec.status === "critical" ? 0xef4444 : sec.status === "warning" ? 0xf59e0b : 0x10b981;
          }

          const boxMat = new THREE.MeshStandardMaterial({
            color: boxColor,
            roughness: 0.7,
            wireframe: viewMode === "wireframe",
          });
          const box = new THREE.Mesh(boxGeo, boxMat);
          box.position.set(-1.2 + bx * 0.7, level + 0.35, (bx % 2 === 0 ? -0.3 : 0.3));
          box.castShadow = true;
          box.receiveShadow = true;
          group.add(box);
        }
      });

      // Interactive Click Target Box (Bounding Zone)
      const hitGeo = new THREE.BoxGeometry(4.0, 5.2, 2.4);
      const hitMat = new THREE.MeshBasicMaterial({
        color: 0x00adb5,
        transparent: true,
        opacity: 0.08,
        wireframe: true,
      });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.set(0, 2.6, 0);
      hitMesh.userData = { section: sec };
      group.add(hitMesh);

      sectionMeshes.push({ mesh: hitMesh, section: sec });
      scene.add(group);
    });

    // 6. Raycasting Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(sectionMeshes.map((s) => s.mesh));
      if (intersects.length > 0) {
        const sec = (intersects[0].object.userData as any).section as WarehouseSection;
        if (sec) {
          setSelectedSection(sec);
        }
      }
    };

    renderer.domElement.addEventListener("click", handleClick);

    // 7. Simple Orbit Drag & Zoom Handler
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let cameraAngle = Math.PI / 4;
    let cameraRadius = 26;
    let cameraHeight = 15;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging = true;
        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      cameraAngle -= deltaX * 0.006;
      cameraHeight = Math.max(4, Math.min(28, cameraHeight + deltaY * 0.05));

      camera.position.x = Math.sin(cameraAngle) * cameraRadius;
      camera.position.z = Math.cos(cameraAngle) * cameraRadius;
      camera.position.y = cameraHeight;
      camera.lookAt(0, 2, 0);

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraRadius = Math.max(12, Math.min(42, cameraRadius + e.deltaY * 0.02));
      camera.position.x = Math.sin(cameraAngle) * cameraRadius;
      camera.position.z = Math.cos(cameraAngle) * cameraRadius;
      camera.lookAt(0, 2, 0);
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    // 8. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate && !isDragging) {
        cameraAngle += 0.003;
        camera.position.x = Math.sin(cameraAngle) * cameraRadius;
        camera.position.z = Math.cos(cameraAngle) * cameraRadius;
        camera.lookAt(0, 2, 0);
      }
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
      dom.removeEventListener("click", handleClick);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [viewMode, autoRotate]);

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border border-border/80 bg-[#181e26] shadow-xl">
      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Header Info */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-[#222831]/85 backdrop-blur-md border border-[#393e46] px-4 py-2.5 rounded-2xl shadow-lg">
        <div className="size-3 rounded-full bg-[#00adb5] animate-pulse" />
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide">{warehouseName}</h4>
          <p className="text-[10px] text-gray-400">Interactive 3D Digital Twin • Real-time Storage Mesh</p>
        </div>
      </div>

      {/* View Mode Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-[#222831]/85 backdrop-blur-md border border-[#393e46] p-1.5 rounded-2xl shadow-lg">
        <button
          onClick={() => setViewMode("standard")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            viewMode === "standard"
              ? "bg-[#00adb5] text-[#222831] shadow-sm"
              : "text-gray-300 hover:text-white hover:bg-[#393e46]"
          }`}
        >
          Realistic
        </button>
        <button
          onClick={() => setViewMode("heatmap")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            viewMode === "heatmap"
              ? "bg-[#00adb5] text-[#222831] shadow-sm"
              : "text-gray-300 hover:text-white hover:bg-[#393e46]"
          }`}
        >
          Stock Risk Heatmap
        </button>
        <button
          onClick={() => setViewMode("wireframe")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            viewMode === "wireframe"
              ? "bg-[#00adb5] text-[#222831] shadow-sm"
              : "text-gray-300 hover:text-white hover:bg-[#393e46]"
          }`}
        >
          Wireframe
        </button>
        <div className="w-[1px] h-4 bg-[#393e46] mx-1" />
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title="Toggle Auto Rotation"
          className={`p-1.5 rounded-xl transition-all ${
            autoRotate ? "bg-[#00adb5] text-[#222831]" : "text-gray-400 hover:text-white hover:bg-[#393e46]"
          }`}
        >
          <RotateCw className="size-4" />
        </button>
      </div>

      {/* Selected Section Inspection Card */}
      {selectedSection && (
        <div className="absolute bottom-4 left-4 z-10 w-84 bg-[#222831]/95 backdrop-blur-md border border-[#393e46] rounded-2xl p-4 shadow-2xl text-white">
          <div className="flex items-start justify-between border-b border-[#393e46] pb-2.5 mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00adb5]">
                {selectedSection.zone} • {selectedSection.category}
              </span>
              <h5 className="text-sm font-bold mt-0.5">{selectedSection.name}</h5>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedSection.status === "critical"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : selectedSection.status === "warning"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {selectedSection.status.toUpperCase()}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>Capacity Utilization:</span>
              <span className="font-semibold text-white">{selectedSection.utilization}%</span>
            </div>
            <div className="w-full bg-[#393e46] rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  selectedSection.status === "critical"
                    ? "bg-rose-500"
                    : selectedSection.status === "warning"
                    ? "bg-amber-500"
                    : "bg-[#00adb5]"
                }`}
                style={{ width: `${selectedSection.utilization}%` }}
              />
            </div>

            <div className="flex justify-between text-gray-300 pt-1">
              <span>Current Stock:</span>
              <span className="font-bold text-white">{selectedSection.currentStock} / {selectedSection.capacity} units</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>SKUs in Bay:</span>
              <span className="font-medium text-white">{selectedSection.skuCount} active lines</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Primary Product:</span>
              <span className="font-semibold text-[#00adb5] truncate max-w-[160px] text-right">
                {selectedSection.topProduct}
              </span>
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-[#393e46] flex items-center justify-between text-[11px] text-gray-400">
            <span>Click any bay to inspect</span>
            <span className="text-[#00adb5] font-medium flex items-center gap-1 cursor-pointer hover:underline">
              Bay Log <ChevronRight className="size-3" />
            </span>
          </div>
        </div>
      )}

      {/* Helpful 3D Navigation Hint */}
      <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-2 bg-[#222831]/80 backdrop-blur-sm border border-[#393e46] px-3 py-1.5 rounded-xl text-[10px] text-gray-400">
        <RotateCw className="size-3 text-[#00adb5]" /> Left-drag to orbit • Scroll to zoom
      </div>
    </div>
  );
}
