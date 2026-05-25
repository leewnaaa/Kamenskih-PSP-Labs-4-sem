// components/3d-preview-card/index.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Preview3DComponent {
    constructor(parent, modelData, onClick) {
        this.parent = parent;
        this.modelData = modelData; // { id, name, url, type, isUserModel, buffer? }
        this.onClick = onClick;
        this.canvas = null;
    }

    async renderPreview() {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'model-card';
        cardDiv.innerHTML = `
            <div class="preview-canvas" style="position:relative; background:#eef2f5;"></div>
            <div class="model-info">
                <div class="model-name">${this.escapeHtml(this.modelData.name)}</div>
                <div class="model-type">${this.modelData.isUserModel ? '📁 Загружена' : '🏦 Офис банка'}</div>
            </div>
        `;
        const canvasContainer = cardDiv.querySelector('.preview-canvas');
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvasContainer.appendChild(canvas);

        // Создаём сцену для статичного рендера
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xeef2f5);
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(2, 1.5, 3);
        camera.lookAt(0, 0.5, 0);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
        renderer.setSize(300, 300);

        // Освещение
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(2, 5, 3);
        scene.add(dirLight);
        const fillLight = new THREE.PointLight(0xccaa88, 0.4);
        fillLight.position.set(1, 2, 2);
        scene.add(fillLight);

        // Загрузка модели
        let loader = new GLTFLoader();
        let source;
        if (this.modelData.buffer) {
            const blob = new Blob([this.modelData.buffer], { type: 'model/gltf-binary' });
            source = URL.createObjectURL(blob);
        } else {
            source = this.modelData.url;
        }

        try {
            const gltf = await loader.loadAsync(source);
            const model = gltf.scene;
            // Центрирование по основанию
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const yOffset = -box.min.y; // ставим на пол
            model.position.y += yOffset;
            model.position.x -= center.x;
            model.position.z -= center.z;
            scene.add(model);

            // Первый кадр
            renderer.render(scene, camera);
            if (this.modelData.buffer) URL.revokeObjectURL(source);
        } catch (err) {
            console.warn('Preview error', err);
            canvasContainer.innerHTML = '<div class="text-center p-4"><i class="fas fa-cube fa-3x text-secondary"></i><br>Ошибка загрузки</div>';
        }

        cardDiv.addEventListener('click', () => this.onClick(this.modelData));
        this.parent.appendChild(cardDiv);
    }

    escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
}
