<script setup lang="ts">
import * as THREE from 'three';
import {
    ref,
    watch,
} from 'vue';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xAAAAAA);

const cameraOpts = {
    fov: 75,
    nearClip: 0.1,
    farClip: 1000,
};
const camera = new THREE.PerspectiveCamera(cameraOpts.fov, 4/3, cameraOpts.nearClip, cameraOpts.farClip);
camera.position.z = 5;
camera.position.y = 3;
camera.lookAt(0, 0, 0);

const material = new THREE.LineBasicMaterial({ color: 0x000000 });
material.side = THREE.DoubleSide; // no culling

const boxSize = 4;
const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
const geometry = new THREE.EdgesGeometry(boxGeometry, 15);;

const boxSize2 = 3.9;
const boxGeometry2 = new THREE.BoxGeometry(boxSize2, boxSize2, boxSize2);
const geometry2 = new THREE.EdgesGeometry(boxGeometry2, 15);;

const obj = new THREE.LineSegments(geometry, material);
scene.add(obj);
const obj2 = new THREE.LineSegments(geometry2, material);
scene.add(obj2);

/** this isn't that performant */
function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer, container: HTMLElement) {
    const canvas = renderer.domElement;
    const needResize = container.clientWidth !== canvas.clientWidth || container.clientHeight !== canvas.clientHeight;
    if (needResize) {
        renderer.setSize(container.clientWidth, container.clientHeight, true);
    }
    return needResize;
}

const container = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
let initializedRenderer = false;
watch([ canvas, container ], () => {
    if (canvas.value && container.value) {
        if (initializedRenderer) {
            console.warn('renderer already initialized, this should not happen');
        }

        const canvasElement = canvas.value;
        const containerElement = container.value;

        // initialize the renderer
        const renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true });
        renderer.setSize(containerElement.clientWidth, containerElement.clientHeight, true);

        renderer.setAnimationLoop(function animate() {
            // obj.rotation.x += 0.01;
            obj.rotation.y += 0.01;
            obj2.rotation.y += 0.01;

            if (resizeRendererToDisplaySize(renderer, containerElement)) {
                camera.aspect = containerElement.clientWidth / containerElement.clientHeight;
                camera.updateProjectionMatrix();
            }

            renderer.render(scene, camera);
        });
        
        // the first render
        renderer.render(scene, camera);

        initializedRenderer = true;
    }
});
</script>

<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" sm="7">
                <div class="container" ref="container">
                    <canvas ref="canvas" />
                </div>
            </v-col>
            <v-col cols="12" sm="5">
                Tree
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.container {
    height: 4in;
    position: relative;
}
.container >>> canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>