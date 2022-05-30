import "./style.css";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

function init() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // camera.position.set(0, 5, 32);
  // camera.position.x = 0;
  // camera.position.y = 5;
  // camera.position.z = 32;

  const hlight = new THREE.AmbientLight(0xffffffff, 1);
  scene.add(hlight);

  const directionalLight = new THREE.DirectionalLight(0xffffffff, 1);
  directionalLight.position.set(0, 10, 0);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const pointlight1 = new THREE.PointLight(0xffffffff, 1);
  pointlight1.position.set(0, 300, 500);
  scene.add(pointlight1);
  const pointlight2 = new THREE.PointLight(0xffffffff, 1);
  pointlight2.position.set(500, 100, 0);
  scene.add(pointlight2);
  const pointlight3 = new THREE.PointLight(0xffffffff, 1);
  pointlight3.position.set(0, 100, -500);
  scene.add(pointlight3);
  const pointlight4 = new THREE.PointLight(0xffffffff, 1);
  pointlight4.position.set(-500, 300, 500);
  scene.add(pointlight4);

  const rectanglelightwidth = 100;
  const rectanglelightheight = 100;
  const rectLight = new THREE.RectAreaLight(
    0xffffffff,
    10,
    rectanglelightwidth,
    rectanglelightheight
  );
  rectLight.position.set(0, 6, 0);
  rectLight.lookAt(0, 0, 0);
  scene.add(rectLight);

  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement);

  let loader = new GLTFLoader();
  loader.load("scene.gltf", function (gltf1) {
    // car = gltf.scene.children[0];
    // car.scale.set(0.5, 0.5, 0.5);
    gltf1.scene.scale.set(9, 9, 9);

    // camera.lookAt(gltf1);
    scene.add(gltf1.scene);
    renderer.render(scene, camera);
  });
  const carlocationvector = new THREE.Vector3(0, 0, 0);
  camera.lookAt(carlocationvector);

  let loader2 = new GLTFLoader();
  loader2.load("./crater/scene.gltf", function (gltf2) {
    scene.add(gltf2.scene);
    gltf2.scene.scale.set(1000, 1000, 1000);
    gltf2.scene.translateX(380);
    gltf2.scene.translateY(9);
    gltf2.scene.translateZ(-250);
    renderer.render(scene.camera);
  });

  const skybackground = new THREE.TextureLoader().load("sky3.jpg");
  skybackground.repeat.set(1, 1);
  skybackground.wrapS = THREE.RepeatWrapping;
  skybackground.wrapT = THREE.RepeatWrapping;

  scene.background = skybackground;

  const groundTexture = new THREE.TextureLoader().load("ground.jpg");
  const normalGroundTexture = new THREE.TextureLoader().load("normal.jpg");
  // groundTexture.wrapS = THREE.RepeatWrapping;
  // groundTexture.wrapT = THREE.RepeatWrapping;
  const geometry = new THREE.PlaneGeometry(1, 1, 32);
  groundTexture.repeat;
  const plane_material = new THREE.MeshMatcapMaterial({
    map: groundTexture,
    side: THREE.DoubleSide,
    normalMap: normalGroundTexture,
  });
  const plane = new THREE.Mesh(geometry, plane_material);
  plane.position.set(0, -5.8, 0);
  plane.scale.x = 1000;
  plane.scale.y = 1000;
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);

  // const controls = new OrbitControls(camera, renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  let scrollY = window.scrollY;
  // console.log(Math.max(window.scrollY));
  window.addEventListener("scroll", () => {
    const carlocationvector = new THREE.Vector3(0, 0, 0);
    camera.lookAt(carlocationvector);

    scrollY = window.scrollY;
    if (scrollY < 1890) {
      camera.position.x = 0;
      camera.position.y = 1 + scrollY * 0.0075; //remove scrollY from here and use fixed values for fixed percentages
      camera.position.z = 32;
      scene.background.rotation = scrollY * 0.00005;
    } else if (scrollY > 1890 && scrollY < 3780) {
      camera.position.x = -8;
      camera.position.y = 17 + (1890 - scrollY) * 0.0075;
      camera.position.z = -33;
      scene.background.rotation = -scrollY * 0.00005;
    } else if (scrollY > 3780 && scrollY < 5670) {
      camera.position.x = (scrollY / 1.5) * 0.01;
      camera.position.y = (scrollY / 3) * 0.0075;
      camera.position.z = 0;
      scene.background.rotation = scrollY * 0.00005;
    } else if (scrollY > 5670) {
      camera.position.x = 10;
      camera.position.y = (scrollY / 12) * 0.0075;
      camera.position.z = 25;
      scene.background.rotation = scrollY * 0.00005;
    }

    console.log(scrollY); // take the final value as a parameter and remove scrollY from above and use percentages
  });

  //parallax using cursor

  const cursor = {};
  cursor.x = 0;
  cursor.y = 0;
  window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = event.clientY / window.innerHeight - 0.5;

    camera.position.y = (-scrollY / window.innerHeight) * 1;

    const parallaxX = cursor.x * 1.5;
    const parallaxY = cursor.y * 1.5;

    scrollY = window.scrollY;
    if (scrollY < 1890) {
      camera.position.x = 0 + parallaxX;
      camera.position.y = 1 + scrollY * 0.0075 + parallaxY; //remove scrollY from here and use fixed values for fixed percentages
      camera.position.z = 32;
    } else if (scrollY > 1890 && scrollY < 3780) {
      camera.position.x = -8 + parallaxX;
      camera.position.y = 17 + (1890 - scrollY) * 0.0075 + parallaxY;
      camera.position.z = -33;
    } else if (scrollY > 3780 && scrollY < 5670) {
      camera.position.x = (scrollY / 1.5) * 0.01 + parallaxX;
      camera.position.y = (scrollY / 3) * 0.0075 + parallaxY;
      camera.position.z = 0;
    } else if (scrollY > 5670) {
      camera.position.x = 10 + parallaxX;
      camera.position.y = (scrollY / 12) * 0.0075 + parallaxY;
      camera.position.z = 25;
    }

    // console.log(cursor);
  });
}
init();
