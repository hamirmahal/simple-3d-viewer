/* eslint-disable no-param-reassign */
/* eslint-disable prefer-template */
import { useEffect, useState } from "react";
import * as THREE from "three";
import { useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import modelPath from "./models/Cube.obj";
import "./App.css";

export default function LoadObject() {
  const [childMaterials, setChildMaterials] = useState({});
  const { scene } = useThree();

  const object = useLoader(OBJLoader, modelPath);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const materialsChildren = {};
      object.traverse((child) => {
        if (child.isMesh) {
          materialsChildren[child.uuid] = child.material;
        }
      });
      setChildMaterials(materialsChildren);
    }
    return () => {
      mounted = false;
    };
  }, [object]);

  useEffect(() => {
    let mounted = true;
    if (mounted && childMaterials && Object.keys(childMaterials).length > 0) {
      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (childMaterials[child.uuid]) {
            child.material = new THREE.MeshPhongMaterial({
              color: child.material,
              wireframe: false,
            });
            const geo = new THREE.WireframeGeometry(child.geometry); // or WireframeGeometry
            const mat = new THREE.LineBasicMaterial({
              color: 0x000000,
              linewidth: 4,
            });
            const mesh = new THREE.LineSegments(geo, mat);
            scene.add(mesh);
            scene.add(child);
          }
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [childMaterials]);
}
