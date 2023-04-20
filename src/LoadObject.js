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
  const object = cube;
  const geometry = new THREE.SphereGeometry(100, 100, 100);
  const wireframe = new THREE.WireframeGeometry(geometry);
  console.log(wireframe);

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
    const line = new THREE.LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.opacity = 0.25;
    line.material.transparent = true;

    scene.add(line);
    let mounted = true;
    return () => {
      mounted = false;
    };
  }, [childMaterials]);
}
