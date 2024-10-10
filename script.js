document.addEventListener('DOMContentLoaded', function () {
    const csvUrl = 'https://raw.githubusercontent.com/jem107/Data-Monetization-project/refs/heads/main/Q%26A%20Final.csv'; // Update with the actual GitHub URL

    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => processCSV(csvText))
        .catch(error => console.error('Error fetching CSV:', error));
});

let questions = [];
let strategies = [];

function processCSV(csvText) {
    const rows = csvText.split('\n').map(row => row.split(','));

    // First row is the strategy names
    strategies = rows[0].slice(1);  // Ignore the first column (questions)

    // Process questions and answers
    for (let i = 1; i < rows.length; i++) {
        const question = rows[i][0];  // First column is the question
        let answers = rows[i].slice(1);  // Remaining columns are the answers

        // Clean up answers (remove quotation marks and trim spaces)
        answers = answers.map(answer => answer.replace(/["']/g, '').trim());

        // Remove duplicate answers
        const uniqueAnswers = [...new Set(answers)];

        questions.push({ question, answers: uniqueAnswers });
    }

    // Display the questions in the form
    displayQuestions();
}

function displayQuestions() {
    const form = document.getElementById('qna-form');
    form.innerHTML = '';  // Clear the form

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const label = document.createElement('label');
        label.textContent = q.question;
        questionDiv.appendChild(label);

        // Create a multiple select dropdown
        const select = document.createElement('select');
        select.id = `question-${index}`;
        select.name = `question-${index}`;
        select.multiple = true;  // Enable multiple selection

        q.answers.forEach(answer => {
            const option = document.createElement('option');
            option.value = answer;
            option.textContent = answer;
            select.appendChild(option);
        });

        questionDiv.appendChild(select);
        form.appendChild(questionDiv);
    });
}

function calculateResult() {
    const form = document.getElementById('qna-form');
    let score = Array(strategies.length).fill(0);

    questions.forEach((q, index) => {
        const selectedOptions = Array.from(form[`question-${index}`].selectedOptions);
        selectedOptions.forEach(option => {
            // Find which strategy contains the selected option
            q.answers.forEach((answer, answerIndex) => {
                if (option.value === answer) {
                    score[answerIndex]++;
                }
            });
        });
    });

    // Find the strategy with the most matching answers
    const maxScore = Math.max(...score);
    const bestStrategyIndex = score.indexOf(maxScore);
    const bestStrategy = strategies[bestStrategyIndex];

    // Display the result
    document.getElementById('result').textContent = bestStrategy;
    document.getElementById('result-section').style.display = 'block';
}
