let currentQuestionIndex = 0;
let selectedAnswers = [];

// Fetch the CSV file and load the questions
document.addEventListener('DOMContentLoaded', function () {
    const csvUrl = 'https://raw.githubusercontent.com/jem107/Data-Monetization-project/refs/heads/main/Q%26A%20Final.csv';

    fetch(csvUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvText => {
            processCSV(csvText);  // Call the function to process the CSV
        })
        .catch(error => console.error('Error fetching CSV:', error));
});

let questions = [];
let strategies = [];

function processCSV(csvText) {
    const rows = csvText.split('\n').map(row => row.split(','));

    strategies = rows[0].slice(1);  // Ignore the first column (questions)

    // Process questions and answers
    for (let i = 1; i < rows.length; i++) {
        const question = rows[i][0];  // First column is the question
        let answers = rows[i].slice(1);  // Remaining columns are the answers

        answers = answers.map(answer => answer.replace(/["']/g, '').trim());  // Clean up answers
        const uniqueAnswers = [...new Set(answers)];  // Remove duplicates

        questions.push({ question, answers: uniqueAnswers });
    }

    // Start with the first question
    displayQuestion(0);
}

function displayQuestion(index) {
    const questionContainer = document.getElementById('questions-container');
    const nextButton = document.getElementById('next-btn');

    questionContainer.innerHTML = '';  // Clear previous question

    const q = questions[index];
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question-container', 'active');

    const label = document.createElement('h3');
    label.textContent = q.question;
    questionDiv.appendChild(label);

    q.answers.forEach((answer, answerIndex) => {
        const checkboxLabel = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = answer;
        checkbox.name = `question-${index}`;
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(document.createTextNode(answer));
        questionDiv.appendChild(checkboxLabel);
        questionDiv.appendChild(document.createElement('br'));
    });

    questionContainer.appendChild(questionDiv);

    // Show the next button after the question is displayed
    nextButton.style.display = 'inline-block';
}

function nextQuestion() {
    const questionContainer = document.querySelector('.question-container');
    const checkboxes = document.querySelectorAll(`input[name=question-${currentQuestionIndex}]:checked`);

    if (checkboxes.length === 0) {
        alert('Please select at least one answer');
        return;
    }

    checkboxes.forEach(checkbox => {
        selectedAnswers.push(checkbox.value);
    });

    questionContainer.classList.remove('active');
    questionContainer.style.opacity = '0';

    // Move to the next question or show the result
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        setTimeout(() => {
            displayQuestion(currentQuestionIndex);
        }, 500);  // Delay to create a smooth transition
    } else {
        calculateResult();
    }
}

function calculateResult() {
    let score = Array(strategies.length).fill(0);

    selectedAnswers.forEach(answer => {
        questions.forEach((q, index) => {
            q.answers.forEach((ans, answerIndex) => {
                if (answer === ans) {
                    score[answerIndex]++;
                }
            });
        });
    });

    const maxScore = Math.max(...score);
    const bestStrategyIndex = score.indexOf(maxScore);
    const bestStrategy = strategies[bestStrategyIndex];

    document.getElementById('result').textContent = bestStrategy;
    document.getElementById('qna').style.display = 'none';  // Hide the Q&A
    document.getElementById('result-section').style.display = 'block';  // Show the result
}
