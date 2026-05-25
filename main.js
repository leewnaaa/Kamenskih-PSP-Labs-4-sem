// main.js
import { MainPage } from "./pages/main/index.js";
import { Gallery3DPage } from "./pages/3d-gallery/index.js";
import { ToastComponent } from "./components/toast/index.js";

const root = document.getElementById('root');
const toast = new ToastComponent();

let currentPage = 'accounts'; // 'accounts' or 'gallery'

function renderAccounts() {
    const mainPage = new MainPage(root);
    mainPage.render();
}

function renderGallery() {
    const galleryPage = new Gallery3DPage(root, toast);
    galleryPage.render();
}

// Навешиваем события на кнопки в хедере (они уже есть в index.html)
document.addEventListener('DOMContentLoaded', () => {
    renderAccounts(); // по умолчанию счета

    const btnAccounts = document.getElementById('nav-main-btn');
    const btnGallery = document.getElementById('nav-gallery-btn');
    if (btnAccounts) btnAccounts.addEventListener('click', renderAccounts);
    if (btnGallery) btnGallery.addEventListener('click', renderGallery);

    // Обработка загрузки пользовательской модели
    const fileInput = document.getElementById('uploadModelInput');
    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file && file.name.endsWith('.glb')) {
                const reader = new FileReader();
                reader.onload = async (ev) => {
                    const buffer = ev.target.result;
                    await saveUserModel(file, buffer, file.name);
                    toast.show('Успех', `Модель "${file.name}" сохранена! Перейдите в 3D Галерею`, 'success');
                    if (currentPage === 'gallery') renderGallery(); // обновить если на галерее
                };
                reader.readAsArrayBuffer(file);
            } else {
                toast.show('Ошибка', 'Нужен GLB файл', 'danger');
            }
            fileInput.value = '';
        });
    }
});
