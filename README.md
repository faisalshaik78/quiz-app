# CodeQuiz — Interactive Web Development Quiz

CodeQuiz is a browser-based quiz app for practising **HTML, CSS, and JavaScript**. Choose a topic, answer timed multiple-choice questions, track your score, and review explanations at the end.

## Features

- **Three topics plus Mixed mode** — practise HTML, CSS, JavaScript, or questions from all three.
- **Flexible quiz length** — choose a quick 5-question round or a 10-question round.
- **Timed questions** — answer each question within 20 seconds.
- **Speed-based scoring** — earn 10 points for a correct answer, plus a time bonus.
- **Live score and streaks** — track your points and consecutive correct answers while playing.
- **Shuffled questions and options** — each round is presented in a different order.
- **Answer explanations** — learn why an answer is correct after each question.
- **Result summary** — view accuracy, correct answers, points, best streak, and average answer time.
- **Answer review** — revisit every question and see the correct answer and explanation.
- **Personal bests** — best scores are saved in your browser with `localStorage`.
- **Keyboard shortcuts** — use 1–4 to answer, N to move to the next question, and R to replay from the results screen.
- **Responsive and accessible interface** — includes visible focus styles, live feedback, and reduced-motion support.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Browser `localStorage`

## Getting Started

No installation, dependencies, or build tools are required.

1. Clone the repository:

   ```bash
   git clone https://github.com/faisalshaik78/quiz-app.git
   ```

2. Open the project folder.
3. Open `index.html` in your browser.

Alternatively, run the folder with the VS Code Live Server extension.

## Project Structure

```text
quiz-app/
├── index.html   # Page structure and quiz screens
├── style.css    # Styling, layout, and responsive behaviour
├── script.js    # Question bank, timer, scoring, and quiz logic
└── README.md    # Project documentation
```

## How to Play

1. Select HTML, CSS, JavaScript, or Mixed.
2. Choose 5 or 10 questions.
3. Select one of the four answer options before the 20-second timer ends.
4. Earn points for correct answers and extra points for answering quickly.
5. Continue through the quiz to see your final score and answer review.

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `1`–`4` | Select an answer |
| `N` | Move to the next question after answering |
| `R` | Replay from the results screen |

Keyboard shortcuts are ignored when a key is held down or combined with Ctrl, Alt, or Command.

## Scoring

- Correct answer: **10 base points**
- Speed bonus: **up to 5 additional points**
- Incorrect answer or timeout: **0 points**

Your current score and streak are displayed during the quiz. Personal bests are stored separately for each topic and quiz length.

## Data and Privacy

This is a front-end-only project. Personal best scores are saved in the browser's `localStorage`; the app does not require an account or send quiz results to a backend. Saved scores are specific to the browser and device in use.

## Future Improvements

- Add more question categories and difficulty levels.
- Allow users to create custom quizzes.
- Add a leaderboard with a backend database.
- Include progress history and topic-wise performance charts.

## Author

**Shaik Faisal**

- GitHub: [@faisalshaik78](https://github.com/faisalshaik78)

---

If you have suggestions or find an issue, feel free to open an issue or contribute.
