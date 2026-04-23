export class ToastComponent {
    constructor(containerId = 'toastContainer') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            // создаём контейнер, если его нет
            this.container = document.createElement('div');
            this.container.id = containerId;
            this.container.className = 'toast-container-custom';
            document.body.appendChild(this.container);
        }
    }

    getHTML(title, message, type = 'success') {
        let icon = 'fa-check-circle';
        let bgClass = 'bg-success';
        if (type === 'danger') {
            icon = 'fa-exclamation-circle';
            bgClass = 'bg-danger';
        } else if (type === 'primary') {
            icon = 'fa-info-circle';
            bgClass = 'bg-primary';
        } else if (type === 'warning') {
            icon = 'fa-exclamation-triangle';
            bgClass = 'bg-warning';
        }

        return `
            <div class="toast align-items-center text-white ${bgClass} border-0 mb-3 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="3500" style="border-radius: 16px;">
                <div class="d-flex align-items-center p-2">
                    <i class="fas ${icon} me-2 fs-5"></i>
                    <div class="toast-body flex-grow-1">
                        <strong>${title}</strong><br>${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
    }

    show(title, message, type = 'success') {
        const html = this.getHTML(title, message, type);
        this.container.insertAdjacentHTML('beforeend', html);
        const toastEl = this.container.lastElementChild;
        const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 3500 });
        toast.show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }
}
