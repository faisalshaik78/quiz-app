'use strict';

/* =========================================================
   CodeQuiz: timed quiz app
   - DOM updates: timer ring, progress bar, live score/streak
   - Scoring: 10 points + up to 5 speed bonus per correct answer
   ========================================================= */

const TIME_PER_Q = 20;          // seconds
const BASE_POINTS = 10;
const RING_LEN = 2 * Math.PI * 28;

/* ---------- Question bank (`backticks` render as code) ---------- */
const BANK = {
  html: [
    { q: 'Which tag defines the most important (largest) heading?', o: ['`<h6>`', '`<h1>`', '`<head>`', '`<header>`'], a: 1, why: '`<h1>` is the top-level heading. `<h6>` is the least important.' },
    { q: 'Which attribute makes a form field mandatory before submitting?', o: ['`required`', '`validate`', '`mandatory`', '`needed`'], a: 0, why: 'The boolean `required` attribute triggers the browser’s built-in validation.' },
    { q: 'Which element is the semantic choice for a block of site navigation links?', o: ['`<div class="links">`', '`<menu>`', '`<nav>`', '`<links>`'], a: 2, why: '`<nav>` tells browsers and screen readers that this section is for navigation.' },
    { q: 'Which attribute gives an image a text alternative for screen readers?', o: ['`title`', '`alt`', '`caption`', '`name`'], a: 1, why: '`alt` text is read aloud and shown if the image fails to load.' },
    { q: 'How do you open a link in a new browser tab?', o: ['`target="_new"`', '`open="tab"`', '`target="_blank"`', '`window="new"`'], a: 2, why: '`target="_blank"` opens a new tab. Add `rel="noopener"` for safety.' },
    { q: 'What does `<!DOCTYPE html>` do?', o: ['Loads an HTML5 CSS reset', 'Makes the browser render the page in standards mode as HTML5', 'Declares the page title', 'Links the JavaScript file'], a: 1, why: 'It is a declaration, not a tag. It stops the browser using “quirks mode”.' },
    { q: 'Which input type shows a date picker?', o: ['`type="calendar"`', '`type="datetime-text"`', '`type="date"`', '`type="day"`'], a: 2, why: '`<input type="date">` gives a native date picker in modern browsers.' },
    { q: 'Which of these is NOT a semantic element?', o: ['`<article>`', '`<section>`', '`<footer>`', '`<div>`'], a: 3, why: '`<div>` is a generic container with no meaning of its own.' },
    { q: 'Which tag creates a table row?', o: ['`<td>`', '`<tr>`', '`<th>`', '`<row>`'], a: 1, why: '`<tr>` is the row. `<td>` and `<th>` are the cells inside it.' },
    { q: 'Which attribute must be unique within a page?', o: ['`class`', '`name`', '`id`', '`type`'], a: 2, why: 'An `id` identifies exactly one element. Many elements can share a `class`.' },
    { q: 'How do you load an external JavaScript file?', o: ['`<script src="app.js"></script>`', '`<js href="app.js">`', '`<link src="app.js">`', '`<javascript file="app.js">`'], a: 0, why: 'Use `<script src="…">`. `<link>` is for stylesheets.' },
    { q: 'Why set `lang="en"` on the `<html>` element?', o: ['It makes the page load faster', 'It helps screen readers, translators and search engines know the language', 'It changes the font', 'CSS will not work without it'], a: 1, why: 'Declaring the language improves accessibility and translation.' }
  ],
  css: [
    { q: 'Which property changes the text colour?', o: ['`font-color`', '`text-color`', '`color`', '`foreground`'], a: 2, why: '`color` sets the text colour. `background-color` sets the background.' },
    { q: 'Which selector targets the element with id `main`?', o: ['`.main`', '`#main`', '`main`', '`*main`'], a: 1, why: '`#` selects by id and `.` selects by class.' },
    { q: 'In the box model, which order is correct from the inside out?', o: ['margin, border, padding, content', 'content, padding, border, margin', 'content, border, padding, margin', 'padding, content, margin, border'], a: 1, why: 'Content sits inside padding, then the border, then the outer margin.' },
    { q: 'What does `display: flex` on a container enable?', o: ['A grid of rows and columns', 'Flexbox layout for its children', 'Floating of its children', 'Hiding overflowing content'], a: 1, why: 'Flexbox arranges children along a main axis with flexible sizing.' },
    { q: 'Which unit is relative to the root element’s font size?', o: ['`em`', '`rem`', '`vh`', '`%`'], a: 1, why: '`rem` uses the `<html>` font size. `em` depends on the parent element.' },
    { q: 'Which property sets the space between flex or grid items?', o: ['`gap`', '`spacing`', '`margin-between`', '`gutter-size`'], a: 0, why: '`gap` adds space between items without extra margins.' },
    { q: 'Which `position` value keeps an element fixed relative to the viewport?', o: ['`relative`', '`absolute`', '`sticky`', '`fixed`'], a: 3, why: '`fixed` stays in place while scrolling. `sticky` only sticks inside its scroll container.' },
    { q: 'Which selector has the highest specificity?', o: ['`p`', '`.card`', '`#card`', '`*`'], a: 2, why: 'ID selectors beat class selectors, which beat element selectors.' },
    { q: 'What does `box-sizing: border-box` do?', o: ['Adds a border to every element', 'Includes padding and border in the element’s width and height', 'Removes the margin', 'Makes the box a circle'], a: 1, why: 'With `border-box`, a 200px wide box stays 200px even with padding.' },
    { q: 'What is a media query used for?', o: ['Loading images and video', 'Applying styles only when conditions such as screen width are met', 'Playing audio', 'Querying a database'], a: 1, why: 'Media queries are the basis of responsive design.' },
    { q: 'What does `z-index` control?', o: ['Zoom level', 'Stacking order of overlapping elements', 'Text size', 'Animation speed'], a: 1, why: 'A higher `z-index` is drawn on top of a lower one.' },
    { q: 'What does `grid-template-columns: repeat(3, 1fr)` create?', o: ['Three rows of equal height', 'Three equal-width columns', 'One column three times wider', 'Three columns of 1px'], a: 1, why: 'Each `1fr` takes an equal share of the available space.' }
  ],
  js: [
    { q: 'What does `typeof null` return?', o: ['`"null"`', '`"undefined"`', '`"object"`', '`"number"`'], a: 2, why: 'It is a long-standing quirk of JavaScript: `typeof null` is `"object"`.' },
    { q: 'Which keyword declares a block-scoped variable that can be reassigned?', o: ['`var`', '`let`', '`const`', '`def`'], a: 1, why: '`let` is block-scoped and reassignable. `const` cannot be reassigned.' },
    { q: 'What is the difference between `==` and `===`?', o: ['No difference', '`===` also checks the type (no coercion)', '`==` is faster', '`===` only works on numbers'], a: 1, why: '`===` is strict equality. `==` converts types first, which can surprise you.' },
    { q: 'Which array method adds an item to the end?', o: ['`push()`', '`pop()`', '`shift()`', '`unshift()`'], a: 0, why: '`push` adds to the end. `unshift` adds to the start.' },
    { q: 'What is the result of `"5" + 3`?', o: ['`8`', '`"53"`', '`NaN`', '`TypeError`'], a: 1, why: 'When one side is a string, `+` concatenates, so 3 becomes `"3"`.' },
    { q: 'What does `[1, 2, 3].map(n => n * 2)` return?', o: ['`[1, 2, 3]`', '`6`', '`[2, 4, 6]`', '`undefined`'], a: 2, why: '`map` returns a new array with each item transformed.' },
    { q: 'What does `Array.filter()` return?', o: ['The first matching item', 'A new array of items that pass the test', 'The original array, modified', 'A boolean'], a: 1, why: '`filter` keeps items where the callback returns a truthy value. (`find` returns the first match.)' },
    { q: 'Which of these values is falsy?', o: ['`"0"`', '`[]`', '`{}`', '`0`'], a: 3, why: 'Non-empty strings (even `"0"`), arrays and objects are truthy. Only `0` is falsy here.' },
    { q: 'What is event delegation?', o: ['Removing all event listeners', 'Handling events for many children with one listener on a parent', 'Triggering events from code', 'Running events in parallel'], a: 1, why: 'Events bubble up, so one parent listener can handle clicks on many children.' },
    { q: 'What does `JSON.parse()` do?', o: ['Turns an object into a string', 'Turns a JSON string into a JavaScript value', 'Validates HTML', 'Sends a request'], a: 1, why: '`JSON.parse` reads text; `JSON.stringify` does the reverse.' },
    { q: 'What does `await` do inside an `async` function?', o: ['Blocks the whole browser', 'Pauses that function until the promise settles', 'Cancels the promise', 'Runs code in a new thread'], a: 1, why: 'Only the async function pauses. The rest of the page keeps running.' },
    { q: 'What is a closure?', o: ['A function that remembers variables from its outer scope', 'A way to close the browser tab', 'A function with no parameters', 'A private class'], a: 0, why: 'A closure keeps access to the variables where it was created.' },
    { q: 'Can you add a property to an object declared with `const`?', o: ['No, it throws an error', 'Yes, `const` only stops reassigning the variable', 'Only with `Object.assign`', 'Only inside a function'], a: 1, why: '`const` protects the binding, not the object’s contents.' }
  ]
};
const CATS = { html: 'HTML', css: 'CSS', js: 'JavaScript', mixed: 'Mixed' };

/* ---------- Helpers ---------- */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const LETTERS = ['A', 'B', 'C', 'D'];

function prepare(q) {                       // shuffle options, remember the right one
  const order = shuffle(q.o.map((_, i) => i));
  return { q: q.q, options: order.map(i => q.o[i]), answer: order.indexOf(q.a), why: q.why };
}

/* ---------- Best score storage ---------- */
const bestKey = (cat, n) => `codequiz:best:${cat}:${n}`;
function getBest(cat, n) { try { return JSON.parse(localStorage.getItem(bestKey(cat, n))); } catch (_) { return null; } }
function setBest(cat, n, v) { try { localStorage.setItem(bestKey(cat, n), JSON.stringify(v)); } catch (_) {} }

/* ---------- State ---------- */
let game = null;
let timerId = null;

const screens = { start: $('screenStart'), quiz: $('screenQuiz'), result: $('screenResult') };
function show(name) {
  Object.entries(screens).forEach(([k, el]) => el.hidden = k !== name);
  $('hud').hidden = name !== 'quiz';
  const h = name === 'start' ? $('startTitle') : name === 'quiz' ? $('qText') : $('resTitle');
  h.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

/* ---------- Start screen ---------- */
const setup = $('setup');
const choice = () => {
  const formData = new FormData(setup);
  const cat = formData.get('cat') || 'js';
  const len = Number(formData.get('len')) || 10;
  return { cat, len };
};
function updateBestLine() {
  const { cat, len } = choice();
  const b = getBest(cat, len);
  $('bestLine').textContent = b ? `Your best (${CATS[cat]}, ${len} questions): ${b.score} points · ${b.pct}% accuracy` : 'No best score yet for this setup. Set one!';
}
setup.addEventListener('change', updateBestLine);
setup.addEventListener('submit', e => { e.preventDefault(); startGame(choice()); });

/* ---------- Game flow ---------- */
function startGame({ cat, len }) {
  const pool = cat === 'mixed' ? [...BANK.html, ...BANK.css, ...BANK.js] : BANK[cat];
  const qs = shuffle(pool).slice(0, Math.min(len, pool.length)).map(prepare);
  game = { cat, len: qs.length, qs, i: 0, score: 0, streak: 0, bestStreak: 0, correct: 0, log: [], answered: false };
  $('hScore').textContent = '0'; $('hStreak').textContent = '0';
  show('quiz');
  showQuestion();
}

function showQuestion() {
  const g = game, q = g.qs[g.i];
  g.answered = false;
  $('qCount').textContent = `Question ${g.i + 1} of ${g.len}`;
  $('barFill').style.width = `${(g.i / g.len) * 100}%`;
  $('qText').innerHTML = fmt(q.q);
  $('answers').innerHTML = q.options.map((opt, i) =>
    `<button class="ans" type="button" data-i="${i}"><span class="k">${LETTERS[i]}</span><span>${fmt(opt)}</span></button>`).join('');
  $('feedback').innerHTML = '';
  $('nextBtn').hidden = true;
  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  const deadline = Date.now() + TIME_PER_Q * 1000;
  game.deadline = deadline;
  const tick = () => {
    const left = Math.max(0, (deadline - Date.now()) / 1000);
    $('timeLeft').textContent = Math.ceil(left);
    $('ring').style.strokeDashoffset = RING_LEN * (1 - left / TIME_PER_Q);
    $('timer').classList.toggle('low', left <= 5);
    if (left <= 0) answer(-1);
  };
  $('ring').style.strokeDasharray = RING_LEN;
  tick();
  timerId = setInterval(tick, 100);
}

function bump(el) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }

function answer(choiceIdx) {
  const g = game;
  if (g.answered) return;
  g.answered = true;
  clearInterval(timerId);

  const q = g.qs[g.i];
  const left = Math.max(0, (g.deadline - Date.now()) / 1000);
  const used = TIME_PER_Q - left;
  const ok = choiceIdx === q.answer;
  let points = 0;
  if (ok) {
    points = BASE_POINTS + Math.floor(left / 4);          // 0–5 speed bonus
    g.score += points; g.correct++; g.streak++;
    g.bestStreak = Math.max(g.bestStreak, g.streak);
  } else g.streak = 0;
  g.log.push({ q, choice: choiceIdx, ok, used });

  document.querySelectorAll('.ans').forEach((b, i) => {
    b.disabled = true;
    if (i === q.answer) b.classList.add('correct');
    else if (i === choiceIdx) b.classList.add('wrong');
    else b.classList.add('dim');
  });

  $('hScore').textContent = g.score; $('hStreak').textContent = g.streak;
  bump($('hScore')); if (ok && g.streak > 1) bump($('hStreak'));

  const head = ok ? `Correct! +${points} points${g.streak > 2 ? ` · ${g.streak} in a row 🔥` : ''}`
                  : choiceIdx === -1 ? 'Time’s up!' : 'Not quite.';
  $('feedback').innerHTML = `<div class="fb ${ok ? 'good' : 'bad'}"><b>${head}</b>${fmt(q.why)}</div>`;

  const last = g.i === g.len - 1;
  const next = $('nextBtn');
  next.textContent = last ? 'See results →' : 'Next question →';
  next.hidden = false;
  next.focus();
}

$('answers').addEventListener('click', e => {
  const b = e.target.closest('.ans');
  if (b) answer(+b.dataset.i);
});
document.addEventListener('keydown', e => {
  if (screens.quiz.hidden || !game || game.answered) return;
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= game.qs[game.i].options.length) answer(n - 1);
});
$('nextBtn').addEventListener('click', () => {
  if (game.i === game.len - 1) return finish();
  game.i++; showQuestion();
  $('qText').focus({ preventScroll: true });
});

/* ---------- Results ---------- */
function finish() {
  clearInterval(timerId);
  const g = game;
  $('barFill').style.width = '100%';
  const pct = Math.round((g.correct / g.len) * 100);
  const avg = g.log.reduce((s, l) => s + l.used, 0) / g.len;

  const title = pct >= 90 ? 'Outstanding!' : pct >= 70 ? 'Great job!' : pct >= 50 ? 'Good start' : 'Keep practising';
  $('resTag').textContent = `${CATS[g.cat]} · ${g.len} questions`;
  $('resTitle').textContent = title;
  $('resPct').textContent = pct + '%';
  $('rScore').textContent = g.score;
  $('rCorrect').textContent = `${g.correct}/${g.len}`;
  $('rStreak').textContent = g.bestStreak;
  $('rTime').textContent = avg.toFixed(1) + 's';

  const prev = getBest(g.cat, g.len);
  const isBest = !prev || g.score > prev.score;
  if (isBest) setBest(g.cat, g.len, { score: g.score, pct });
  $('resBest').textContent = isBest ? '🏆 New personal best!' : `Personal best: ${prev.score} points`;

  $('review').innerHTML = g.log.map((l, n) => `
    <details ${l.ok ? '' : 'open'}>
      <summary><span class="mark ${l.ok ? 'ok' : 'no'}" aria-hidden="true">${l.ok ? '✓' : '✕'}</span><span>${n + 1}. ${fmt(l.q.q)}</span></summary>
      <div class="body">
        <p><b>Correct answer:</b> ${fmt(l.q.options[l.q.answer])}</p>
        ${l.ok ? '' : `<p><b>Your answer:</b> ${l.choice === -1 ? 'No answer (time ran out)' : fmt(l.q.options[l.choice])}</p>`}
        <p>${fmt(l.q.why)}</p>
      </div>
    </details>`).join('');

  show('result');
  if (pct >= 70) confetti();
}

function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = $('confetti'), colors = ['#FF5C8A', '#5CE1E6', '#FFE066', '#4ADE80'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = 2 + Math.random() * 2 + 's';
    p.style.animationDelay = Math.random() * 0.6 + 's';
    box.append(p);
  }
  setTimeout(() => box.replaceChildren(), 5000);
}

$('againBtn').addEventListener('click', () => startGame({ cat: game.cat, len: game.len }));
$('menuBtn').addEventListener('click', () => { updateBestLine(); show('start'); });

updateBestLine();
