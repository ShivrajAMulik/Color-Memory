import { getColorBackground, getPlayAgainButton, getTimerElement } from './selectors.js';

function shuffle(arr) {
	if (!Array.isArray(arr) || arr.length < 2) return arr;

	for (let i = arr.length - 1; i > 1; i--) {
		const j = Math.trunc(Math.random() * i);
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

export function getRandomColorPairs(count) {
	const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];
	const colorList = [];

	for (let i = 0; i < count; i++) {
		const color = randomColor({
			luminosity: 'dark',
			hue: hueList[i % hueList.length],
		});

		colorList.push(color);
	}

	const fullColorList = [...colorList, ...colorList];
	shuffle(fullColorList);

	return fullColorList;
}

export function showPlayAgainButton() {
	const playAgainButton = getPlayAgainButton();
	if (playAgainButton) playAgainButton.classList.add('show');
}

export function hidePlayAgainButton() {
	const playAgainButton = getPlayAgainButton();
	if (playAgainButton) playAgainButton.classList.remove('show');
}

export function setTimerText(text) {
	const timerElement = getTimerElement();
	if (timerElement) timerElement.textContent = text;
}

export function createTimer({ seconds, onChange, onFinish }) {
	let intervalId = null;

	function start() {
		clear();

		let currentSecond = seconds;
		intervalId = setInterval(() => {
			onChange(currentSecond);

			currentSecond--;

			if (currentSecond < 0) {
				clear();
				onFinish();
			}
		}, 1000);
	}

	function clear() {
		clearInterval(intervalId);
	}

	return {
		start,
		clear,
	};
}

export function setBackgroundColor(color) {
	const background = getColorBackground();
	if (background) background.style.backgroundColor = color;
}
