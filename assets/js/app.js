const myModule = (() => {
	"use strict";

	let deck = [],
		playersScore = [];

	const types = ["C", "D", "H", "S"],
		specials = ["A", "J", "Q", "K"];

	//Refs HTML
	const btnDealCard = document.querySelector("#btnDealCard"),
		btnNewGame = document.querySelector("#btnNewGame"),
		btnStop = document.querySelector("#btnStop"),
		btnGg = document.querySelector("#btnBg");

	const divPlayerCards = document.querySelectorAll(".divCards"),
		HTMLScore = document.querySelectorAll("small");

	//Change background
	let index = 1,
		imageUrl = [
			"assets/img/background1.jpg",
			"assets/img/background2.jpg",
			"assets/img/background3.jpg",
			"assets/img/background4.jpg",
		];

	/**
	 * Initialize game
	 * @param {number} playersNum
	 */
	const initGame = (playersNum = 2) => {
		deck = createDeck();

		playersScore = [];
		for (let i = 0; i < playersNum; i++) {
			playersScore.push(0);
		}

		HTMLScore.forEach((elem) => (elem.innerText = 0));
		divPlayerCards.forEach((elem) => (elem.innerHTML = ""));

		btnDealCard.disabled = false;
		btnStop.disabled = true;
	};

	/**
	 * Returns shuffle deck
	 * @returns {array}
	 */
	const createDeck = () => {
		deck = [];
		for (let i = 2; i <= 10; i++) {
			for (let type of types) {
				deck.push(i + type);
			}
		}
		for (let type of types) {
			for (let special of specials) {
				deck.push(special + type);
			}
		}
		return _.shuffle(deck);
	};

	/**
	 * Return the last card in the deck
	 * @returns {string}
	 */
	const dealCard = () => {
		return deck.length === 0 ? Swal.fire("The deck is empty") : deck.pop();
	};

	/**
	 * Returns card value
	 * @param {string} card
	 * @returns {number}
	 */
	const cardValue = (card) => {
		const value = card.substring(0, card.length - 1);
		return isNaN(value) ? (value === "A" ? 11 : 10) : value * 1;
	};

	/**
	 * Return player score. Turn: 0 = first player, last turn is a computer
	 * @param {number} card
	 * @param {string} turn
	 * @return {number}
	 */
	const accumulatePoints = (card, turn) => {
		playersScore[turn] = playersScore[turn] + cardValue(card);
		HTMLScore[turn].innerText = playersScore[turn];
		return playersScore[turn];
	};

	/**
	 * Create ref HTML card
	 * @param {number} turn
	 * @param {string} card
	 */
	const createCard = (card, turn) => {
		const imgCard = document.createElement("img");
		imgCard.src = `assets/img/cards/${card}.png`;
		imgCard.classList.add("card");
		divPlayerCards[turn].append(imgCard);
	};

	/**
	 * Conditions for win game
	 */
	const determineWinner = () => {
		const [minScore, computerScore] = playersScore;

		setTimeout(() => {
			if (computerScore === minScore) {
				Swal.fire("Draw, try again!");
			} else if (minScore > 21) {
				Swal.fire("Computer win!");
			} else if (computerScore > 21) {
				Swal.fire("You win!!");
			} else {
				Swal.fire("Computer win!");
			}
		}, 100);
	};

	/**
	 * Turn computer
	 * @param {number} minScore
	 */
	const computerTurn = (minScore) => {
		let computerScore = 0;

		do {
			const card = dealCard();
			computerScore = accumulatePoints(card, playersScore.length - 1);
			createCard(card, playersScore.length - 1);
		} while (computerScore < minScore && minScore <= 21);

		determineWinner();
	};

	// Event deal card
	btnDealCard.addEventListener("click", () => {
		btnStop.disabled = false;
		const card = dealCard();
		const playerScore = accumulatePoints(card, 0);

		createCard(card, 0);

		if (playerScore > 21) {
			btnDealCard.disabled = true;
			btnStop.disabled = true;
			computerTurn(playerScore);
		} else if (playerScore === 21) {
			btnDealCard.disabled = true;
			btnStop.disabled = true;
			computerTurn(playerScore);
		}
	});

	// Event stop game
	btnStop.addEventListener("click", () => {
		btnDealCard.disabled = true;
		btnStop.disabled = true;
		computerTurn(playersScore[0]);
	});

	// Event for change background
	btnGg.addEventListener("click", () => {
		document.body.style.backgroundImage = "url('" + imageUrl[index] + "')";
		updateIndex();
	});

	const updateIndex = () => {
		index = ++index % imageUrl.length;
	};

	return {
		newGame: initGame,
	};
})();
