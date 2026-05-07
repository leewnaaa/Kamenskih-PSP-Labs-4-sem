// pages/3d-detail/index.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ToastComponent } from '../../components/toast/index.js';
import { Gallery3DPage } from '../3d-gallery/index.js';

export class Detail3DPage {
    constructor(parent, modelData, toastInstance) {
        this.parent = parent;
        this.modelData = modelData;
        this.toast = toastInstance || new ToastComponent();
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.modelGroup = null;
    }

    get pageRoot() {
        return document.getElementById('detail-3d-root');
    }

    getHTML() {
        return `
            <div id="detail-3d-root" class="animated-page">
                <button id="back-gallery-btn" class="back-button"><i class="fas fa-arrow-left"></i> Назад в галерею</button>
                <div class="detail-3d-container">
                    <canvas id="detail-canvas"></canvas>
                </div>
                <div class="control-panel">
                    <button id="view-front"><i class="fas fa-eye"></i> Спереди</button>
                    <button id="view-back"><i class="fas fa-eye"></i> Сзади</button>
                    <button id="view-left"><i class="fas fa-eye"></i> Слева</button>
                    <button id="view-right"><i class="fas fa-eye"></i> Справа</button>
                    <button id="zoom-in"><i class="fas fa-search-plus"></i> +</button>
                    <button id="zoom-out"><i class="fas fa-search-minus"></i> -</button>
                </div>
                <div class="mt-2 text-center text-muted small">🖱️ Мышь — вращение / правой кнопкой — панорама</div>
            </div>
        `;
    }

    async render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        const canvas = document.getElementById('detail-canvas');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x11181f);
        this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        this.camera.position.set(3, 2, 4);
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: false });

        const resize = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', resize);
        resize();

        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.enableZoom = true;

        // Освещение
        const ambient = new THREE.AmbientLight(0x404060, 0.7);
        this.scene.add(ambient);
        const mainLight = new THREE.DirectionalLight(0xfff5e0, 1.2);
        mainLight.position.set(2, 5, 3);
        this.scene.add(mainLight);
        const fillLight = new THREE.PointLight(0xccaa88, 0.5);
        fillLight.position.set(1, 2, 2);
        this.scene.add(fillLight);
        const backLight = new THREE.PointLight(0x88aaff, 0.3);
        backLight.position.set(-2, 1, -3);
        this.scene.add(backLight);

        // Загружаем модель
        let sourceUrl;
        if (this.modelData.buffer) {
            const blob = new Blob([this.modelData.buffer], { type: 'model/gltf-binary' });
            sourceUrl = URL.createObjectURL(blob);
        } else {
            sourceUrl = this.modelData.url;
        }

        const loader = new GLTFLoader();
        try {
            const gltf = await loader.loadAsync(sourceUrl);
            const model = gltf.scene;
            // центрирование по основанию
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const minY = box.min.y;
            model.position.y -= minY;
            model.position.x -= center.x;
            model.position.z -= center.z;
            this.scene.add(model);
            this.modelGroup = model;
            if (this.modelData.buffer) URL.revokeObjectURL(sourceUrl);
        } catch (err) {
            this.toast.show('Ошибка', 'Не удалось загрузить 3D модель', 'danger');
            console.error(err);
            return;
        }

        // Анимация
        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        animate();

        // Кнопки управления
        document.getElementById('view-front').addEventListener('click', () => {
            this.camera.position.set(0, 1.2, 3.5);
            this.controls.target.set(0, 0.8, 0);
            this.controls.update();
        });
        document.getElementById('view-back').addEventListener('click', () => {
            this.camera.position.set(0, 1.2, -3.5);
            this.controls.target.set(0, 0.8, 0);
            this.controls.update();
        });
        document.getElementById('view-left').addEventListener('click', () => {
            this.camera.position.set(-3.5, 1.2, 0);
            this.controls.target.set(0, 0.8, 0);
            this.controls.update();
        });
        document.getElementById('view-right').addEventListener('click', () => {
            this.camera.position.set(3.5, 1.2, 0);
            this.controls.target.set(0, 0.8, 0);
            this.controls.update();
        });
        document.getElementById('zoom-in').addEventListener('click', () => {
            this.camera.position.multiplyScalar(0.9);
            this.controls.update();
        });
        document.getElementById('zoom-out').addEventListener('click', () => {
            this.camera.position.multiplyScalar(1.1);
            this.controls.update();
        });

        document.getElementById('back-gallery-btn').addEventListener('click', () => {
            const gallery = new Gallery3DPage(this.parent, this.toast);
            gallery.render();
        });
    }
}
