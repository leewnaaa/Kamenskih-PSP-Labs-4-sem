export class ToastComponent {
    constructor(toastContainer) {
        this.container = toastContainer;
    }

    getHTML(title, message, type = 'success') {
        const bgClass = type === 'success' ? 'bg-success' : (type === 'danger' ? 'bg-danger' : 'bg-primary');
        return `
            <div class="toast align-items-center text-white ${bgClass} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="3000">
                <div class="d-flex">
                    <div class="toast-body">
                        <strong>${title}</strong><br>${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
    }

    show(title, message, type = 'success') {
        const html = this.getHTML(title, message, type);
        this.container.insertAdjacentHTML('beforeend', html);
        const toastEl = this.container.lastElementChild;
        const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 3000 });
        toast.show();
        // Автоудаление из DOM после скрытия
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }
}
