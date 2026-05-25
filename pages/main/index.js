import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";
import { ToastComponent } from "../../components/toast/index.js";
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.toast = new ToastComponent();
        this.threeCleanup = null; // для уничтожения сцены при повторном рендере
    }

    getData() {
        return [
            {
                id: 1,
                accountName: "Дебетовая карта Premium",
                accountNumber: "5536 9148 2345 6789",
                balance: 125_800,
                type: "Дебетовая",
                expiry: "08/28",
                bgColor: "white"
            },
            {
                id: 2,
                accountName: "Кредитная карта 100 дней",
                accountNumber: "4276 8901 2345 1112",
                balance: 50_000,
                type: "Кредитная",
                expiry: "03/26",
                creditLimit: "150 000 ₽"
            },
            {
                id: 3,
                accountName: "Накопительный счёт",
                accountNumber: "4081 7810 9023 4567",
                balance: 450_300,
                type: "Сберегательный",
                expiry: "—",
                percent: "6%"
            }
        ];
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `
            <div id="main-page">
                <div class="row g-4 animated-page" id="cards-grid"></div>
                <div id="bank-3d-container" class="mt-5 pt-3 animated-page">
                    <h3 class="text-center mb-3"><i class="fas fa-building"></i> Наш головной офис (3D)</h3>
                    <div id="three-canvas-wrapper" style="position: relative; width: 100%; height: 500px; background: #eef2f5; border-radius: 28px; overflow: hidden; box-shadow: 0 12px 28px rgba(0,0,0,0.1);"></div>
                    <p class="text-center text-muted small mt-2">🖱️ Вращайте мышью, приближайте колесиком</p>
                </div>
            </div>
        `;
    }

    clickCard = (e) => {
        const cardId = e.target.closest('button').dataset.id;
        const productPage = new ProductPage(this.parent, cardId, this.toast);
        productPage.render();
    };

    // Очистка предыдущей 3D сцены, если есть
    destroyThree() {
        if (this.threeCleanup) {
            this.threeCleanup();
            this.threeCleanup = null;
        }
    }

    async init3DModel(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Очищаем предыдущие сцены
        this.destroyThree();

        // Создаем сцену
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xeef2f5); // светлый фон под стиль сайта

        // Камера
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(3, 2, 4);
        camera.lookAt(0, 0.8, 0);

        // Рендерер
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Орбит контрол
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.enableZoom = true;
        controls.target.set(0, 0.8, 0);

        // Освещение
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xfff5e0, 1.2);
        mainLight.position.set(2, 5, 3);
        scene.add(mainLight);

        const fillLight = new THREE.PointLight(0xccaa88, 0.5);
        fillLight.position.set(1, 2, 2);
        scene.add(fillLight);

        const backLight = new THREE.PointLight(0x88aaff, 0.3);
        backLight.position.set(-2, 1, -3);
        scene.add(backLight);

        // Загрузка модели Bank.glb
        const loader = new GLTFLoader();
        let modelGroup = null;

        try {
            const gltf = await loader.loadAsync('/models/Bank.glb');
            modelGroup = gltf.scene;

            // Корректировка: ставим модель на пол (основание по lowest Y)
            const box = new THREE.Box3().setFromObject(modelGroup);
            const minY = box.min.y;
            modelGroup.position.y -= minY;

            // Центрируем по X и Z
            const center = box.getCenter(new THREE.Vector3());
            modelGroup.position.x -= center.x;
            modelGroup.position.z -= center.z;

            scene.add(modelGroup);
        } catch (error) {
            console.error('Ошибка загрузки 3D модели:', error);
            // Показываем заглушку
            const fallback = document.createElement('div');
            fallback.className = 'd-flex flex-column align-items-center justify-content-center h-100';
            fallback.innerHTML = '<i class="fas fa-cube fa-4x text-secondary"></i><p class="mt-2">Модель офиса временно недоступна</p>';
            container.appendChild(fallback);
            return;
        }

        // Анимация
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update(); // обновляет управление
            renderer.render(scene, camera);
        };
        animate();

        // Обработка изменения размера окна
        const handleResize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        // Функция очистки (вызывается при уходе со страницы)
        this.threeCleanup = () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (renderer) {
                renderer.dispose();
                renderer.domElement.remove();
            }
            if (controls) controls.dispose();
            // Удаляем модель из сцены
            if (modelGroup) scene.remove(modelGroup);
        };
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        // Рендер карточек счетов
        const cardsGrid = document.getElementById('cards-grid');
        const data = this.getData();
        data.forEach(item => {
            const card = new ProductCardComponent(cardsGrid);
            card.render(item, this.clickCard);
        });

        // Инициализация 3D модели после того, как DOM готов
        setTimeout(() => {
            this.init3DModel('three-canvas-wrapper');
        }, 100);
    }
}
