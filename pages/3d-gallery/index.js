// pages/3d-gallery/index.js
import { Preview3DComponent } from '../../components/3d-preview-card/index.js';
import { getAllUserModels, deleteUserModel, saveUserModel } from '../../services/idb.js';
import { ToastComponent } from '../../components/toast/index.js';
import { Detail3DPage } from '../3d-detail/index.js';

export class Gallery3DPage {
    constructor(parent, toastInstance) {
        this.parent = parent;
        this.toast = toastInstance || new ToastComponent();
        this.models = []; // массив объектов { id, name, url, buffer?, isUserModel }
    }

    get pageRoot() {
        return document.getElementById('gallery-root');
    }

    getHTML() {
        return `<div id="gallery-root" class="animated-page"><div class="gallery-grid" id="gallery-grid"></div></div>`;
    }

    async loadPredefinedModels() {
        // Предустановленные модели: офис банка (Bank.glb) и пара дополнительных для демо
        const predefined = [
            { id: 'bank_office', name: 'Офис Альфа-Банка', url: '/models/Bank.glb', isUserModel: false, buffer: null },
            // При желании добавьте ещё: { id: 'car', name: 'Авто', url: '/models/car.glb', isUserModel: false }
        ];
        return predefined;
    }

    async loadUserModels() {
        const userRecords = await getAllUserModels();
        return userRecords.map(rec => ({
            id: rec.id,
            name: rec.name,
            buffer: rec.data,
            isUserModel: true,
            url: null
        }));
    }

    async render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        const gridContainer = document.getElementById('gallery-grid');

        const predefined = await this.loadPredefinedModels();
        const userModels = await this.loadUserModels();
        this.models = [...predefined, ...userModels];

        if (this.models.length === 0) {
            gridContainer.innerHTML = '<div class="alert alert-secondary">Нет моделей. Загрузите .glb или добавьте Bank.glb в папку /models/</div>';
            return;
        }

        for (let model of this.models) {
            const preview = new Preview3DComponent(gridContainer, model, this.onCardClick.bind(this));
            await preview.renderPreview();
        }

        // Добавляем кнопку удаления для пользовательских моделей (опционально)
        // но для простоты - будет очистка через долгий клик? оставим пока без, но можно добавить.
    }

    onCardClick(modelData) {
        const detailPage = new Detail3DPage(this.parent, modelData, this.toast);
        detailPage.render();
    }
}
