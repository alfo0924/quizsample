// 測驗題目
const questions = [
    {"question": "5 - 9", "answer": -4, "options": [-4, -9.99, -10.01, -11.77], "operation": "subtraction"},
    {"question": "6 - 17", "answer": -11, "options": [-11.36, -4.3, -11, -1.14], "operation": "subtraction"},
    {"question": "98 / 14", "answer": 7.0, "options": [2.64, 7.0, 10.84, 1.14], "operation": "division"},
    {"question": "10 * 1", "answer": 10, "options": [17.27, 10, 7.54, 0.44], "operation": "multiplication"},
    {"question": "20 - 1", "answer": 19, "options": [12.85, 19, 23.1, 18.3], "operation": "subtraction"},
    {"question": "8 + 15", "answer": 23, "options": [17.96, 17.2, 23, 32.7], "operation": "addition"},
    {"question": "2 - 1", "answer": 1, "options": [9.14, 1, -8.61, -1.95], "operation": "subtraction"},
    {"question": "19 + 16", "answer": 35, "options": [25.32, 39.43, 35, 37.51], "operation": "addition"},
    {"question": "13 * 13", "answer": 169, "options": [169, 177.69, 172.09, 169.51], "operation": "multiplication"},
    {"question": "55 / 11", "answer": 5.0, "options": [3.99, 11.47, 8.6, 5.0], "operation": "division"}
];

// 頁面載入時生成測驗題目
function loadQuiz() {
    const form = document.getElementById('quizForm');
    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = 'question';
        div.id = `question-${index}`;

        const questionHeader = document.createElement('div');
        questionHeader.className = 'question-header';
        questionHeader.textContent = `第${index + 1}題: ${q.question} = ?`;
        div.appendChild(questionHeader);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';

        // 打亂選項順序
        const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);

        shuffledOptions.forEach((opt, i) => {
            const id = `q${index}_opt${i}`;
            const label = document.createElement('label');
            label.htmlFor = id;

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `q${index}`;
            input.id = id;
            input.value = opt;

            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${opt}`));
            optionsDiv.appendChild(label);
        });

        div.appendChild(optionsDiv);

        // 新增一個區域顯示題目的結果
        const resultDiv = document.createElement('div');
        resultDiv.className = 'question-result';
        resultDiv.id = `result-${index}`;
        resultDiv.style.display = 'none';
        div.appendChild(resultDiv);

        form.appendChild(div);
    });
}

// 提交測驗並顯示結果
function submitQuiz() {
    let score = 0;
    let resultHTML = '';
    let unanswered = 0;

    // 記錄每種運算的錯誤數量
    const operationErrors = {
        addition: { total: 0, errors: 0 },
        subtraction: { total: 0, errors: 0 },
        multiplication: { total: 0, errors: 0 },
        division: { total: 0, errors: 0 }
    };

    questions.forEach((q, index) => {
        const questionDiv = document.getElementById(`question-${index}`);
        const resultDiv = document.getElementById(`result-${index}`);
        const selected = document.querySelector(`input[name=q${index}]:checked`);

        // 更新運算類型的總題數
        operationErrors[q.operation].total++;

        if (!selected) {
            resultDiv.innerHTML = `<p class="error">未作答</p>`;
            resultDiv.style.display = 'block';
            unanswered++;
            return;
        }

        const userAnswer = parseFloat(selected.value);
        if (userAnswer === q.answer) {
            score++;
            questionDiv.classList.add('correct-question');
            resultDiv.innerHTML = `<p class="correct">✓ 正確</p>`;
        } else {
            questionDiv.classList.add('incorrect-question');
            resultDiv.innerHTML = `<p class="error">✗ 錯誤，正確答案是 ${q.answer}</p>`;
            operationErrors[q.operation].errors++;
        }
        resultDiv.style.display = 'block';
    });

    // 計算分數和百分比
    const percentage = Math.round((score / questions.length) * 100);

    // 顯示分數
    const scoreDisplay = document.getElementById('score-display');
    scoreDisplay.innerHTML = `
        <div class="score">您的分數：${score} / ${questions.length} (${percentage}%)</div>
        ${unanswered > 0 ? `<p class="error">您有 ${unanswered} 題未作答</p>` : ''}
    `;

    // 分析錯誤類型
    const analysisDiv = document.getElementById('analysis');
    let analysisHTML = '<div class="operation-analysis"><h3>運算類型分析</h3>';

    // 檢查每種運算類型的錯誤率
    const weaknesses = [];

    for (const [operation, data] of Object.entries(operationErrors)) {
        if (data.total > 0) {
            const errorRate = Math.round((data.errors / data.total) * 100);
            let operationName;

            switch (operation) {
                case 'addition': operationName = '加法'; break;
                case 'subtraction': operationName = '減法'; break;
                case 'multiplication': operationName = '乘法'; break;
                case 'division': operationName = '除法'; break;
            }

            analysisHTML += `<div class="operation-item">${operationName}：${data.total - data.errors} 對 ${data.errors} 錯 (正確率: ${100 - errorRate}%)</div>`;

            if (errorRate >= 50) {
                weaknesses.push(operationName);
            }
        }
    }

    // 提供改進建議
    analysisHTML += '<h3>學習建議</h3>';
    if (weaknesses.length > 0) {
        analysisHTML += `<p>您需要加強的運算：${weaknesses.join('、')}</p>`;
    } else if (score < questions.length) {
        analysisHTML += '<p>您的表現不錯，但仍有改進空間。請檢查錯誤題目，了解您的失誤。</p>';
    } else {
        analysisHTML += '<p>太棒了！您已完全掌握這些運算。</p>';
    }

    analysisHTML += '</div>';
    analysisDiv.innerHTML = analysisHTML;

    // 顯示結果區域
    document.getElementById('result').style.display = 'block';

    // 滾動到頁面頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 禁用提交按鈕，防止重複提交
    document.getElementById('submitBtn').disabled = true;
}

// 頁面載入時初始化測驗
window.onload = loadQuiz;
