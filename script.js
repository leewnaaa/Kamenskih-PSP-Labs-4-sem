// Переключение темы (светлая/тёмная)
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});

// Выпадающий список для смены цветовой схемы
const colorSelect = document.getElementById('color-select');
colorSelect.addEventListener('change', (e) => {
    const theme = e.target.value;
    // Удаляем предыдущие классы темы
    document.body.classList.remove('green-theme', 'blue-theme');
    if (theme === 'green') {
        document.body.classList.add('green-theme');
    } else if (theme === 'blue') {
        document.body.classList.add('blue-theme');
    } else {
        // Сброс к стандартному (текущий тёмный)
        document.body.classList.remove('green-theme', 'blue-theme');
    }
});
