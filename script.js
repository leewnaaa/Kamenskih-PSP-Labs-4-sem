// ========== 1. ТЕМЫ (ЛР №1 + кнопка сброса) ==========
const themeToggle = document.getElementById('theme-toggle');
const colorSelect = document.getElementById('color-select');
const resetThemeBtn = document.getElementById('reset-theme');
const outputElement = document.getElementById('result');

function resetFullTheme() {
    document.body.classList.remove('light-theme', 'green-theme', 'blue-theme');
    document.body.style.backgroundColor = '';
    outputElement.style.backgroundColor = '';
    if (colorSelect) colorSelect.value = 'default';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });
}
if (colorSelect) {
    colorSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        document.body.classList.remove('green-theme', 'blue-theme');
        if (theme === 'green') {
            document.body.classList.add('green-theme');
        } else if (theme === 'blue') {
            document.body.classList.add('blue-theme');
        } else {
            document.body.classList.remove('green-theme', 'blue-theme');
        }
    });
}
if (resetThemeBtn) {
    resetThemeBtn.addEventListener('click', resetFullTheme);
}

// ========== 2. ЛОГИКА КАЛЬКУЛЯТОРА ==========
document.addEventListener('DOMContentLoaded', () => {
    let currentOperand = '0';
    let previousOperand = '';
    let operation = null;
    let waitingForNewOperand = false;

    function updateDisplay() {
        if (operation && previousOperand !== '' && !waitingForNewOperand) {
            outputElement.innerHTML = `${previousOperand} ${operation} ${currentOperand}`;
        } else if (operation && previousOperand !== '' && waitingForNewOperand) {
            outputElement.innerHTML = `${previousOperand} ${operation}`;
        } else {
            outputElement.innerHTML = currentOperand;
        }
    }

    function clearAll() {
        currentOperand = '0';
        previousOperand = '';
        operation = null;
        waitingForNewOperand = false;
        updateDisplay();
    }

    function applyUnaryOperation(fn, errorMsg = 'Ошибка') {
        try {
            let num = parseFloat(currentOperand);
            if (isNaN(num)) throw new Error('Не число');
            let result = fn(num);
            if (isNaN(result) || !isFinite(result)) throw new Error(errorMsg);
            currentOperand = result.toString();
            waitingForNewOperand = true;
            previousOperand = '';
            operation = null;
            updateDisplay();
        } catch (e) {
            currentOperand = 'Ошибка';
            updateDisplay();
            setTimeout(() => {
                if (currentOperand === 'Ошибка') clearAll();
            }, 1500);
        }
    }

    function compute() {
        if (operation === null || previousOperand === '' || waitingForNewOperand) return;
        let prev = parseFloat(previousOperand);
        let curr = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(curr)) return;

        let result;
        switch (operation) {
            case '+': result = prev + curr; break;
            case '-': result = prev - curr; break;
            case 'x': result = prev * curr; break;
            case '/':
                if (curr === 0) {
                    currentOperand = 'Ошибка (деление на 0)';
                    updateDisplay();
                    setTimeout(clearAll, 1500);
                    return;
                }
                result = prev / curr;
                break;
            default: return;
        }
        currentOperand = result.toString();
        previousOperand = '';
        operation = null;
        waitingForNewOperand = true;
        updateDisplay();
    }

    function appendDigit(digit) {
        if (currentOperand === 'Ошибка') clearAll();
        if (waitingForNewOperand) {
            currentOperand = digit;
            waitingForNewOperand = false;
        } else {
            if (currentOperand.replace(/\./g, '').length >= 16) return;
            if (digit === '.' && currentOperand.includes('.')) return;
            if (currentOperand === '0' && digit !== '.') {
                currentOperand = digit;
            } else {
                currentOperand += digit;
            }
        }
        updateDisplay();
    }

    function backspace() {
        if (currentOperand === 'Ошибка') {
            clearAll();
            return;
        }
        if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
            currentOperand = '0';
            waitingForNewOperand = false;
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
        updateDisplay();
    }

    function toggleSign() {
        let num = parseFloat(currentOperand);
        if (isNaN(num)) return;
        currentOperand = (num * -1).toString();
        updateDisplay();
    }

    function percent() {
        let num = parseFloat(currentOperand);
        if (isNaN(num)) return;
        currentOperand = (num / 100).toString();
        updateDisplay();
        waitingForNewOperand = true;
    }

    function square() {
        applyUnaryOperation(num => num * num);
    }
    function squareRoot() {
        applyUnaryOperation(num => {
            if (num < 0) throw new Error('Корень из отриц.');
            return Math.sqrt(num);
        }, 'Корень из отриц.');
    }
    function factorial() {
        applyUnaryOperation(num => {
            if (num < 0 || !Number.isInteger(num)) throw new Error('Факториал только для неотр. целых');
            let res = 1;
            for (let i = 2; i <= num; i++) res *= i;
            return res;
        }, 'Факториал?');
    }
    function tripleZero() {
        if (currentOperand === 'Ошибка') clearAll();
        if (waitingForNewOperand) {
            currentOperand = '0';
            waitingForNewOperand = false;
        }
        if ((currentOperand.replace(/\./g, '').length + 3) <= 18) {
            currentOperand += '000';
        }
        updateDisplay();
    }
    function cube() {
        applyUnaryOperation(num => num * num * num);
    }

    function setOperation(op) {
        if (currentOperand === 'Ошибка') clearAll();
        if (operation !== null && !waitingForNewOperand && previousOperand !== '') {
            compute();
        }
        previousOperand = currentOperand;
        operation = op;
        waitingForNewOperand = true;
        updateDisplay();
    }

    function changeOutputColor() {
        outputElement.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
    function changeBackgroundColor() {
        document.body.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    // === НАЗНАЧЕНИЕ ОБРАБОТЧИКОВ ===
    const digitButtons = document.querySelectorAll('[id^="btn_digit_"]');
    digitButtons.forEach(btn => {
        btn.addEventListener('click', () => appendDigit(btn.innerHTML));
    });

    document.getElementById('btn_op_plus')?.addEventListener('click', () => setOperation('+'));
    document.getElementById('btn_op_minus')?.addEventListener('click', () => setOperation('-'));
    document.getElementById('btn_op_mult')?.addEventListener('click', () => setOperation('x'));
    document.getElementById('btn_op_div')?.addEventListener('click', () => setOperation('/'));

    document.getElementById('btn_op_equal')?.addEventListener('click', () => {
        if (operation && previousOperand !== '' && !waitingForNewOperand) compute();
    });

    document.getElementById('btn_op_clear')?.addEventListener('click', clearAll);
    document.getElementById('btn_op_backspace')?.addEventListener('click', backspace);
    document.getElementById('btn_op_sign')?.addEventListener('click', toggleSign);
    document.getElementById('btn_op_percent')?.addEventListener('click', percent);
    document.getElementById('btn_op_square')?.addEventListener('click', square);
    document.getElementById('btn_op_sqrt')?.addEventListener('click', squareRoot);
    document.getElementById('btn_op_factorial')?.addEventListener('click', factorial);
    document.getElementById('btn_op_triple_zero')?.addEventListener('click', tripleZero);
    document.getElementById('btn_op_cube')?.addEventListener('click', cube);

    document.getElementById('btn_change_output_color')?.addEventListener('click', changeOutputColor);
    document.getElementById('btn_change_bg_color')?.addEventListener('click', changeBackgroundColor);
});
