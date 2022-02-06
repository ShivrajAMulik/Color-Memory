import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js';
import {
	getColorBackground,
	getColorItemList,
	getColorListElement,
	getInactiveColorElementList,
	getPlayAgainButton,
} from './selectors.js';
import {
	createTimer,
	getRandomColorPairs,
	hidePlayAgainButton,
	setBackgroundColor,
	setTimerText,
	showPlayAgainButton,
} from './utils.js';

let selections = [];
let gameStatus = GAME_STATUS.PLAYING;
let timer = createTimer({
	seconds: GAME_TIME,
	onChange: handleTimerChange,
	onFinish: handleTimerFinish,
});

function handleTimerChange(second) {
	setTimerText(`${second}s`);
}

function handleTimerFinish() {
	gameStatus = GAME_STATUS.FINISHED;
	setTimerText('Get faster at this, LOSER');
	showPlayAgainButton();
}


function handleColorItemClick(liElement) {
	const isBlocked = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus);
	const isClicked = liElement.classList.contains('active');
	if (!liElement || isBlocked || isClicked) return;

	liElement.classList.add('active');

	selections.push(liElement);
	if (selections.length < 2) return;

	const firstColor = selections[0].dataset.color;
	const secondColor = selections[1].dataset.color;
	const isMatch = firstColor === secondColor;

	if (isMatch) {
		setBackgroundColor(firstColor);

		const isWin = getInactiveColorElementList().length === 0;
		if (isWin) {
			showPlayAgainButton();
			setTimerText('Nice...you won!');
			gameStatus = GAME_STATUS.FINISHED;
			timer.clear();
		}

		selections = [];
		return;
	}

	gameStatus = GAME_STATUS.BLOCKING;
	setTimeout(() => {
		selections[0].classList.remove('active');
		selections[1].classList.remove('active');
		selections = [];

		if (gameStatus !== GAME_STATUS.FINISHED) {
			gameStatus = GAME_STATUS.PLAYING;
		}
	}, 500);
}

function initColorList() {
	const colorList = getRandomColorPairs(PAIRS_COUNT);

	const liList = getColorItemList();

	liList.forEach((liElement, index) => {
		liElement.dataset.color = colorList[index];
		const overlayElement = liElement.querySelector('.overlay');
		if (overlayElement) overlayElement.style.backgroundColor = colorList[index];
	});
}

function attachEventForColorList() {
	const colorListElement = getColorListElement();
	if (!colorListElement) return;

	colorListElement.addEventListener('click', (e) => {
		if (e.target.tagName !== 'LI') return;
		handleColorItemClick(e.target);
	});
}

function resetGame() {

	selections = [];
	gameStatus = GAME_STATUS.PLAYING;

	const colorElementList = getColorItemList();
	if (!colorElementList) return;

	for (const colorElement of colorElementList) {
		colorElement.classList.remove('active');
	}

	hidePlayAgainButton();
	setTimerText('');

	initColorList();

	startTimer();
}

function startTimer() {
	timer.start();
}

function attachEventForPlayAgainButton() {
	const playAgainButton = getPlayAgainButton();
	if (!playAgainButton) return;
	playAgainButton.addEventListener('click', resetGame);
}

(() => {
	initColorList();
	attachEventForColorList();
	attachEventForPlayAgainButton();
	startTimer();
})();
