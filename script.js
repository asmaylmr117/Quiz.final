const quizData = [];
const quiz = document.getElementById('quiz');
const nextBtn = document.getElementById('next-btn');
const startQuizBtn = document.getElementById('start-quiz-btn');
const clearQuizBtn = document.getElementById('clear-quiz-btn'); // الحصول على الزر الجديد
const addQuestionForm = document.getElementById('add-question-form');
let currentQuiz = 0;
let score = 0;
let answeredQuestions = 0;

addQuestionForm.addEventListener('submit', addQuestion);
nextBtn.addEventListener('click', loadNextQuestion);
startQuizBtn.addEventListener('click', startQuiz);
clearQuizBtn.addEventListener('click', clearAllQuestions); // إضافة مستمع الحدث

function addQuestion(event) {
    event.preventDefault();
    let newQuestion = document.getElementById('new-question').value.trim();
    let newAnswerA = document.getElementById('new-answer-a').value.trim();
    let newAnswerB = document.getElementById('new-answer-b').value.trim();
    let newAnswerC = document.getElementById('new-answer-c').value.trim();
    let newAnswerD = document.getElementById('new-answer-d').value.trim();
    let newCorrectAnswer = document.getElementById('new-correct-answer').value.trim();

    if (!newQuestion || !newAnswerA || !newAnswerB || !newAnswerC || !newAnswerD || !newCorrectAnswer) {
        alert("Please fill out all fields.");
        return;
    }

    const newQuizData = {
        question: newQuestion,
        a: newAnswerA,
        b: newAnswerB,
        c: newAnswerC,
        d: newAnswerD,
        correct: newCorrectAnswer
    };

    quizData.push(newQuizData);

    // تخزين السؤال في Local Storage
    localStorage.setItem('quizData', JSON.stringify(quizData));

    addQuestionForm.reset();
    alert('Question added successfully');

    if (quizData.length > 0) {
        startQuizBtn.style.display = 'inline-block'; // إظهار زر Start Quiz
        clearQuizBtn.style.display = 'inline-block'; // إظهار زر Clear Quiz
    }
}

function startQuiz() {
    currentQuiz = 0;
    score = 0;
    answeredQuestions = 0;

    // تحميل الأسئلة من Local Storage
    const storedQuizData = localStorage.getItem('quizData');
    if (storedQuizData) {
        quizData.length = 0;
        quizData.push(...JSON.parse(storedQuizData));
    }

    addQuestionForm.style.display = 'none';
    startQuizBtn.style.display = 'none'; // إخفاء زر Start Quiz عند بدء الاختبار
    clearQuizBtn.style.display = 'none'; // إخفاء زر Clear Quiz عند بدء الاختبار
    nextBtn.style.display = 'inline-block'; // إظهار زر Next عند بدء الاختبار
    loadQuiz();
}

function loadQuiz() {
    if (quizData.length === 0) {
        quiz.innerHTML = '<h2>No questions available yet</h2>';
        nextBtn.style.display = 'none'; // إخفاء زر Next عند عدم وجود أسئلة
        return;
    }

    const currentQuizData = quizData[currentQuiz];
    quiz.innerHTML = `
        <h2>${currentQuizData.question}</h2>
        <label class="form-check">
            <input class="form-check-input" type="radio" name="answer" value="a"> ${currentQuizData.a}
        </label><br>
        <label class="form-check">
            <input class="form-check-input" type="radio" name="answer" value="b"> ${currentQuizData.b}
        </label><br>
        <label class="form-check">
            <input class="form-check-input" type="radio" name="answer" value="c"> ${currentQuizData.c}
        </label><br>
        <label class="form-check">
            <input class="form-check-input" type="radio" name="answer" value="d"> ${currentQuizData.d}
        </label>
    `;
}

function loadNextQuestion() {
    const answerEls = document.querySelectorAll('input[name="answer"]');
    let selectedAnswer;

    answerEls.forEach(answerEl => {
        if (answerEl.checked) {
            selectedAnswer = answerEl.value;
        }
    });

    if (selectedAnswer) {
        if (selectedAnswer === quizData[currentQuiz].correct) {
            score++;
        }
        answeredQuestions++;
        currentQuiz++;
        if (currentQuiz < quizData.length) {
            loadQuiz();
        } else {
            showResults();
        }
    } else {
        alert('Please choose an answer before moving on to the next question');
    }
}

function showResults() {
    quiz.innerHTML = `
        <h2>You have answered ${score} out of ${quizData.length} questions correctly</h2>
        <button class="btn btn-primary" onclick="location.reload()">Reload</button>
    `;
    nextBtn.style.display = 'none'; // إخفاء زر Next عند انتهاء الاختبار
}

function clearAllQuestions() {
    localStorage.removeItem('quizData');
    alert('All questions have been cleared.');
    location.reload(); // إعادة تحميل الصفحة لتحديث العرض
}

window.onload = function() {
    const storedQuizData = localStorage.getItem('quizData');
    if (storedQuizData) {
        quizData.length = 0;
        quizData.push(...JSON.parse(storedQuizData));
    }

    nextBtn.style.display = 'none'; // إخفاء زر Next عند تحميل الصفحة

    if (quizData.length === 0) {
        startQuizBtn.style.display = 'none'; // إخفاء زر Start Quiz عند عدم وجود أسئلة
        clearQuizBtn.style.display = 'none'; // إخفاء زر Clear Quiz عند عدم وجود أسئلة
    } else {
        startQuizBtn.style.display = 'inline-block'; // إظهار زر Start Quiz عند وجود أسئلة
        clearQuizBtn.style.display = 'inline-block'; // إظهار زر Clear Quiz عند وجود أسئلة
    }
};
function goBack() {
    window.history.back();
}
