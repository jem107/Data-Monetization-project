document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            processCSV(contents);
        };
        reader.readAsText(file);
    }
});

function processCSV(csvContent) {
    const rows = csvContent.split('\n');
    const qnaContainer = document.getElementById('qnaContainer');
    qnaContainer.innerHTML = ''; // Clear previous content

    rows.forEach((row, rowIndex) => {
        const columns = row.split(',');

        if (rowIndex === 0) {
            // First row, treat it as a question
            const question = document.createElement('h3');
            question.textContent = columns[0]; // First column is the question
            qnaContainer.appendChild(question);

            // Create radio buttons for each answer
            columns.slice(1).forEach((answer, answerIndex) => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'question' + rowIndex;
                input.value = answer;

                label.appendChild(input);
                label.appendChild(document.createTextNode(answer));
                qnaContainer.appendChild(label);
                qnaContainer.appendChild(document.createElement('br')); // Line break
            });
        }
    });
}
