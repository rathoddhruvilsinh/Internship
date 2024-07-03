// script.js
document.addEventListener('DOMContentLoaded', () => {
    const texts = [
        "The quick brown fox jumps over the lazy dog.",
        "A journey of a thousand miles begins with a single step.",
        "To be or not to be, that is the question.",
        "All that glitters is not gold.",
        "The only thing we have to fear is fear itself."
    ];

    const textToTypeElement = document.getElementById('text-to-type');
    const typingArea = document.getElementById('typing-area');
    const timerElement = document.getElementById('timer');
    const errorsElement = document.getElementById('errors');
    const wpmElement = document.getElementById('wpm');
    const startButton = document.getElementById('start-button');
    const historyList = document.getElementById('history-list');

    let timer = 0;
    let errors = 0;
    let interval;
    let startTime;
    let currentIndex = 0;
    let currentText = '';
    const history = [];

    function startPractice() {
        currentText = texts[Math.floor(Math.random() * texts.length)];
        textToTypeElement.innerHTML = currentText.split('').map(char => `<span>${char}</span>`).join('');
        typingArea.value = '';
        typingArea.disabled = false;
        typingArea.focus();
        timer = 0;
        errors = 0;
        startTime = new Date();
        updateStats();
        clearInterval(interval);
        interval = setInterval(updateTimer, 1000);
    }

    startButton.addEventListener('click', startPractice);

    typingArea.addEventListener('input', () => {
        const typedText = typingArea.value;
        const textSpans = textToTypeElement.querySelectorAll('span');
        currentIndex = typedText.length - 1;

        // Reset classes for all spans
        textSpans.forEach(span => {
            span.classList.remove('correct', 'incorrect', 'space-error');
        });

        errors = 0;
        for (let i = 0; i < typedText.length; i++) {
            if (typedText[i] === currentText[i]) {
                textSpans[i].classList.add('correct');
                textSpans[i].classList.remove('incorrect', 'space-error');
            } else {
                textSpans[i].classList.add('incorrect');
                textSpans[i].classList.remove('correct');
                if (typedText[i] === ' ' && currentText[i] !== ' ') {
                    textSpans[i].classList.add('space-error');
                }
                errors++;
            }
        }

        // Check if the entire paragraph has been typed correctly
        if (typedText === currentText) {
            clearInterval(interval);
            typingArea.disabled = true;
            const endTime = new Date();
            const timeTaken = (endTime - startTime) / 1000;
            const wpm = calculateWPM(typedText, timeTaken);
            addToHistory(timeTaken, errors, wpm);
            alert(`Practice complete! Time: ${timeTaken.toFixed(2)}s, Errors: ${errors}, WPM: ${wpm}`);
        }

        updateStats();
    });

    function updateTimer() {
        timer++;
        updateStats();
    }

    function updateStats() {
        timerElement.textContent = timer;
        errorsElement.textContent = errors;
        wpmElement.textContent = calculateWPM(typingArea.value, timer);
    }

    function calculateWPM(text, timeInSeconds) {
        const wordsTyped = text.trim().split(/\s+/).length;
        const minutes = timeInSeconds / 60;
        return Math.round(wordsTyped / minutes);
    }

    function addToHistory(time, errors, wpm) {
        history.push({ time: time.toFixed(2), errors, wpm });
        const historyItem = document.createElement('li');
        historyItem.textContent = `Time: ${time.toFixed(2)}s, Errors: ${errors}, WPM: ${wpm}`;
        historyList.appendChild(historyItem);
    }
});
