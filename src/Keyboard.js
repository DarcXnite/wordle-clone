import React, { useEffect, useState } from 'react';
import dictionary from './dictionary.json';
import targetWords from './targetWords.json';

function Keyboard() {
	useEffect(() => {
		startInteraction();
	}, []);

	const WORD_LENGTH = 5;
	const FLIP_ANIMATION_DURATION = 500;
	const DANCE_ANIMATION_DURATION = 500;
	const offsetFromDate = new Date(2022, 0, 1);
	const msOffset = Date.now() - offsetFromDate;
	const dayOffset = msOffset / 1000 / 60 / 60 / 24;
	const targetWord = targetWords[Math.floor(dayOffset)];

	const startInteraction = () => {
		document.addEventListener('click', handleClick);
		document.addEventListener('keydown', handleKeyPress);
	};

	const stopInteraction = () => {
		document.removeEventListener('click', handleClick);
		document.removeEventListener('keydown', handleKeyPress);
	};

	const handleClick = (e) => {
		if (e.target.matches('[data-key]')) {
			pressKey(e.target.dataset.key);
			return;
		}
		if (e.target.matches('[data-enter]')) {
			submitGuess();
			return;
		}
		if (e.target.matches('[data-delete]')) {
			deleteKey();
			return;
		}
	};

	const getActiveTiles = () => {
		const guessGrid = document.querySelector('[data-guess-grid]');
		return guessGrid.querySelectorAll('[data-state="active"]');
	};

	const pressKey = (key) => {
		const guessGrid = document.querySelector('[data-guess-grid]');
		const activeTiles = getActiveTiles();
		if (activeTiles.length >= WORD_LENGTH) return;
		const nextTile = guessGrid.querySelector(':not([data-letter])');
		nextTile.dataset.letter = key.toLowerCase();
		nextTile.textContent = key;
		nextTile.dataset.state = 'active';
		return;
	};

	const submitGuess = () => {
		const activeTiles = [...getActiveTiles()];

		if (activeTiles.length !== WORD_LENGTH) {
			showAlert('Not enough letters');
			shakeTiles(activeTiles);
		}

		const guess = activeTiles.reduce((word, tile) => {
			return word + tile.dataset.letter;
		}, '');

		if (!dictionary.includes(guess)) {
			showAlert('Not in word list');
			shakeTiles(activeTiles);
			return;
		}

		stopInteraction();
		activeTiles.map((...params) => {
			flipTiles(...params, guess);
		});
		return;
	};

	const flipTiles = (tile, index, array, guess) => {
		const keyboard = document.querySelector('[data-keyboard]');
		const letter = tile.dataset.letter;
		const key = keyboard.querySelector(`[data-key="${letter}"i]`); // the i is for case insensitive
		setTimeout(() => {
			tile.classList.add('flip');
		}, (index * FLIP_ANIMATION_DURATION) / 2);

		tile.addEventListener(
			'transitionend',
			() => {
				tile.classList.remove('flip');
				if (targetWord[index] === letter) {
					tile.dataset.state = 'correct';
					key.classList.add('correct');
				} else if (targetWord.includes(letter)) {
					tile.dataset.state = 'wrong-location';
					key.classList.add('wrong-location');
				} else {
					tile.dataset.state = 'wrong';
					key.classList.add('wrong');
				}

				if (index === array.length - 1) {
					tile.addEventListener(
						'transitionend',
						() => {
							startInteraction();
							checkWinLose(guess, array);
						},
						{ once: true }
					);
				}
			},
			{ once: true }
		);
	};

	const checkWinLose = (guess, tiles) => {
		const guessGrid = document.querySelector('[data-guess-grid]');

		if (guess === targetWord) {
			showAlert('You Got it!', 5000);
			danceTiles(tiles);
			stopInteraction();
			return;
		}

		const remainingTiles = guessGrid.querySelectorAll(':not([data-letter])');
		if (remainingTiles.length === 0) {
			showAlert(targetWord.toUpperCase(), null);
			stopInteraction();
		}
	};

	const deleteKey = () => {
		const activeTiles = getActiveTiles();
		const lastTile = activeTiles[activeTiles.length - 1];
		if (lastTile == null) return;
		lastTile.textContent = '';
		delete lastTile.dataset.state;
		delete lastTile.dataset.letter;
		return;
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			submitGuess();
			return;
		}
		if (e.key === 'Backspace' || e.key === 'Delete') {
			deleteKey();
			return;
		}
		if (e.key.match(/^[a-z]$/)) {
			pressKey(e.key);
			return;
		}
		console.log(e.key);
	};

	const showAlert = (message, duration = 1000) => {
		const alertContainer = document.querySelector('[data-alert-container]');
		const alert = document.createElement('div');
		alert.textContent = message;
		alert.classList.add('alert');
		alertContainer.prepend(alert);
		if (duration == null) return;
		setTimeout(() => {
			alert.classList.add('hide');
			alert.addEventListener('transitionend', () => {
				alert.remove();
			});
		}, duration);
	};

	const shakeTiles = (tiles) => {
		tiles.map((tile) => {
			tile.classList.add('shake');
			tile.addEventListener(
				'animationend',
				() => {
					tile.classList.remove('shake');
				},
				{ once: true }
			);
		});
	};

	const danceTiles = (tiles) => {
		tiles.map((tile, index) => {
			setTimeout(() => {
				tile.classList.add('dance');
				tile.addEventListener(
					'animationend',
					() => {
						tile.classList.remove('dance');
					},
					{ once: true }
				);
			}, (index * DANCE_ANIMATION_DURATION) / 5);
		});
	};

	return (
		<React.Fragment>
			<div className="alert-container" data-alert-container></div>
			<div data-guess-grid className="guess-grid">
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
				<div className="tile"></div>
			</div>
			<div data-keyboard className="keyboard">
				<button className="key" data-key="Q">
					Q
				</button>
				<button className="key" data-key="W">
					W
				</button>
				<button className="key" data-key="E">
					E
				</button>
				<button className="key" data-key="R">
					R
				</button>
				<button className="key" data-key="T">
					T
				</button>
				<button className="key" data-key="Y">
					Y
				</button>
				<button className="key" data-key="U">
					U
				</button>
				<button className="key" data-key="I">
					I
				</button>
				<button className="key" data-key="O">
					O
				</button>
				<button className="key" data-key="P">
					P
				</button>
				<div className="space"></div>
				<button className="key" data-key="A">
					A
				</button>
				<button className="key" data-key="S">
					S
				</button>
				<button className="key" data-key="D">
					D
				</button>
				<button className="key" data-key="F">
					F
				</button>
				<button className="key" data-key="G">
					G
				</button>
				<button className="key" data-key="H">
					H
				</button>
				<button className="key" data-key="J">
					J
				</button>
				<button className="key" data-key="K">
					K
				</button>
				<button className="key" data-key="L">
					L
				</button>
				<div className="space"></div>
				<button className="key large" data-enter>
					Enter
				</button>
				<button className="key" data-key="Z">
					Z
				</button>
				<button className="key" data-key="X">
					X
				</button>
				<button className="key" data-key="C">
					C
				</button>
				<button className="key" data-key="V">
					V
				</button>
				<button className="key" data-key="B">
					B
				</button>
				<button className="key" data-key="N">
					N
				</button>
				<button className="key" data-key="M">
					M
				</button>
				<button className="key large" data-delete>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 0 24 24"
						width="24"
						data-delete
					>
						<path
							data-delete
							fill="var(--color-tone-1)"
							d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
						></path>
					</svg>
				</button>
			</div>
		</React.Fragment>
	);
}

export default Keyboard;
