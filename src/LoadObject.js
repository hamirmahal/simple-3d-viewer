/* eslint-disable no-param-reassign */
/* eslint-disable prefer-template */
import { useLoader, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import './App.css';
import cubePath from './models/Cube.obj';
import cubeHalfTrianglesPath from './models/Cube_Half_Triangles.obj';
import animalPath from './models/animal.obj';
import bagPath from './models/bag.obj';

export default function LoadObject() {
  const [childMaterials, setChildMaterials] = useState({});
  const { scene } = useThree();

  const cube = useLoader(OBJLoader, cubePath);
  const animal = useLoader(OBJLoader, animalPath);
  const cubeHalfTriangles = useLoader(OBJLoader, cubeHalfTrianglesPath);
  const bag = useLoader(OBJLoader, bagPath);
  const object = bag;

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
              wireframe: false
            });

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
