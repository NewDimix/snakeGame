window.onload = function () {
	document.body.classList.add("loaded_hiding");
	window.setTimeout(function () {
		document.body.classList.add("loaded");
		document.body.classList.remove("loaded_hiding");
	}, 500);
};

try {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	window.audioContext = new window.AudioContext();
} catch (e) {
	console.log("No Web Audio API support");
}

const WebAudioAPISoundManager = function (context) {
	this.context = context;
	this.bufferList = {};
	this.playingSounds = {};
};

WebAudioAPISoundManager.prototype = {
	addSound: function (url) {
		// Load buffer asynchronously
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = "arraybuffer";

		var self = this;

		request.onload = function () {
			// Asynchronously decode the
			// audio file data in request.response
			self.context.decodeAudioData(
				request.response,

				function (buffer) {
					if (!buffer) {
						console.log("error decoding file data: " + url);
						return;
					}
					self.bufferList[url] = buffer;
				}
			);
		};

		request.onerror = function () {
			console.log("BufferLoader: XHR error");
		};

		request.send();
	},

	stopSoundWithUrl: function (url) {
		if (this.playingSounds.hasOwnProperty(url)) {
			for (var i in this.playingSounds[url]) {
				if (this.playingSounds[url].hasOwnProperty(i)) {
					this.playingSounds[url][i].stop();
				}
			}
		}
	},
};

const WebAudioAPISound = function (url) {
	this.url = url + ".mp3";
	window.webAudioAPISoundManager = window.webAudioAPISoundManager || new WebAudioAPISoundManager(window.audioContext);
	this.manager = window.webAudioAPISoundManager;
	this.manager.addSound(this.url);
};

WebAudioAPISound.prototype = {
	play: function (options) {
		var buffer = this.manager.bufferList[this.url];

		this.settings = {
			loop: false,
			volume: 0.5,
		};

		for (var i in options) {
			if (options.hasOwnProperty(i)) {
				this.settings[i] = options[i];
			}
		}

		//Only play if it's loaded yet
		if (typeof buffer !== "undefined") {
			var source = this.makeSource(buffer);
			source.loop = this.settings.loop;
			source.start(0);

			if (!this.manager.playingSounds.hasOwnProperty(this.url)) {
				this.manager.playingSounds[this.url] = [];
			}
			this.manager.playingSounds[this.url].push(source);
		}
	},

	stop: function () {
		this.manager.stopSoundWithUrl(this.url);
	},

	makeSource: function (buffer) {
		var source = this.manager.context.createBufferSource();
		var gainNode = this.manager.context.createGain();
		gainNode.gain.value = this.settings.volume;
		source.buffer = buffer;
		source.connect(gainNode);
		gainNode.connect(this.manager.context.destination);
		return source;
	},
};

let cyberSpeed = new Audio();
cyberSpeed.preload = "auto";
cyberSpeed.src = "sounds/cyberSpeed.mp3";
cyberSpeed.volume = 0.25;

const stepTetris = new WebAudioAPISound("sounds/stepTetris");
const eatingTetris = new WebAudioAPISound("sounds/eatingTetris");
const eatingCyber = new WebAudioAPISound("sounds/eatingCyber");
const crashTetris = new WebAudioAPISound("sounds/crashTetris");
const crashCyber = new WebAudioAPISound("sounds/crashCyber");
const winTetris = new WebAudioAPISound("sounds/winTetris");
const winCyberpunk = new WebAudioAPISound("sounds/winCyberpunk");
const settingsChange = new WebAudioAPISound("sounds/settingsChange");
const cyberBtnClick = new WebAudioAPISound("sounds/cyberBtnClick");
const timerAudio = new WebAudioAPISound("sounds/timer");
const clickAudio = new WebAudioAPISound("sounds/switch");
const cyberPauseAudio = new WebAudioAPISound("sounds/cyberPause");
const pauseAudio = new WebAudioAPISound("sounds/pause");
const newRouteSound = new WebAudioAPISound("sounds/newRoute");
const glitchAudio = new WebAudioAPISound("sounds/glitch");
const hackAudio = new WebAudioAPISound("sounds/hack");
const eggFind = new WebAudioAPISound("sounds/eggFind");
const cyberpunkEgg = new WebAudioAPISound("sounds/cyberpunkEgg");

// stepTetris.play({
//     volume: 0.05
// });

// let stepTetris = new Audio();
// stepTetris.preload = 'auto';
// stepTetris.src = 'sounds/stepTetris.mp3';
// stepTetris.volume = 0.005;

// let stepTetris2 = new Audio();
// stepTetris2.preload = 'auto';
// stepTetris2.src = 'sounds/stepTetris.mp3';
// stepTetris2.volume = 0.005;

// let eatingTetris = new Audio();
// eatingTetris.preload = 'auto';
// eatingTetris.src = 'sounds/eatingTetris.mp3';
// eatingTetris.volume = 0.02;

// let eatingCyber = new Audio();
// eatingCyber.preload = 'auto';
// eatingCyber.src = 'sounds/eatingCyber.mp3';
// eatingCyber.volume = 0.05;

// let eatingCyber2 = new Audio();
// eatingCyber2.preload = 'auto';
// eatingCyber2.src = 'sounds/eatingCyber2.mp3';
// eatingCyber2.volume = 0.5;

// let crashTetris = new Audio();
// crashTetris.preload = 'auto';
// crashTetris.src = 'sounds/crashTetris.mp3';
// crashTetris.volume = 0.03;

// let crashCyber = new Audio();
// crashCyber.preload = 'auto';
// crashCyber.src = 'sounds/crashCyber.mp3';
// crashCyber.volume = 0.3;

// let winTetris = new Audio();
// winTetris.preload = 'auto';
// winTetris.src = 'sounds/winTetris.mp3';
// winTetris.volume = 0.03;

// let timerAudio = new Audio();
// timerAudio.preload = 'auto';
// timerAudio.src = 'sounds/timer.mp3';
// timerAudio.volume = 0.5;

// let clickAudio = new Audio();
// clickAudio.preload = 'auto';
// clickAudio.src = 'sounds/switch.mp3';
// clickAudio.volume = 0.2;

// let pauseAudio = new Audio();
// pauseAudio.preload = 'auto';
// pauseAudio.src = 'sounds/pause.mp3';
// pauseAudio.volume = 0.5;

// let newRouteSound = new Audio();
// newRouteSound.preload = 'auto';
// newRouteSound.src = 'sounds/newRoute.mp3';
// newRouteSound.volume = 0.2;

// let glitchAudio = new Audio();
// glitchAudio.preload = 'auto';
// glitchAudio.src = 'sounds/glitch.mp3';
// glitchAudio.volume = 0.035;

// let hackAudio = new Audio();
// hackAudio.preload = 'auto';
// hackAudio.src = 'sounds/hack.mp3';
// hackAudio.volume = 0.3;

// let eggFind = new Audio();
// eggFind.preload = 'auto';
// eggFind.src = 'sounds/eggFind.mp3';
// eggFind.volume = 0.2;

// let cyberpunkEgg = new Audio();
// cyberpunkEgg.preload = 'auto';
// cyberpunkEgg.src = 'sounds/cyberpunkEgg.mp3';
// cyberpunkEgg.volume = 0.2;

const game = {
	elements: {
		score: document.getElementById("scoreEl"),
		scoreValue: document.getElementById("score"),
		timer: document.getElementById("timer"),
		timerCount: document.getElementById("timerCount"),
		cyberBackground: document.getElementById("cyberBackground"),
		winText: document.getElementById("gameWinTextEl"),
		gameOverText: document.getElementById("gameOverTextEl"),
		field: document.getElementById("field"),
		td: document.getElementsByClassName("table__cell"),
		tr: document.getElementsByClassName("table__line"),
		settingsForm: document.getElementById("settingsForm"),
		cyberpunkEgg: document.getElementById("cyberpunkRange"),
		wakeUpText: document.getElementById("wakeUpTextEl"),
		hack: document.getElementById("hack"),
		hackText: document.getElementById("hackText"),
		reloadBtn: document.getElementById("reloadBtn"),
		settingsBtn: document.getElementById("settingsBtn"),
		settingsSaveBtn: document.getElementById("settingsSave"),
		touchBtnTop: document.getElementById("touchBtnTop"),
		touchBtnRight: document.getElementById("touchBtnRight"),
		touchBtnBottom: document.getElementById("touchBtnBottom"),
		touchBtnLeft: document.getElementById("touchBtnLeft"),
		touchControl: document.getElementById("touchControl"),
		dark: document.getElementById("dark"),
		timerDark: document.getElementById("timerDark"),
	},
	sets: {
		steps: null,
		cyberBackground: null,
		hackPlay: null,
		wakeUpVisible: null,
		experiment: null,
	},
	timer: {
		set: 0,
		sec: 3,
		add: function () {
			game.timer.sec--;
			game.timer.start();
		},
		start: function () {
			game.states.pause = false;
			game.elements.timerCount.textContent = game.timer.sec;
			letterText(game.elements.timerCount, 4, 15);

			if (game.timer.sec == 0) {
				game.timer.reset();
				game.states.playing = true;

				snake.move();
				game.elements.dark.style.animationDuration = game.darkSec + "s";
				game.elements.dark.classList.add("field__dark_visible");
				game.elements.timerDark.style.animationDuration = game.darkSec + "s";
				game.elements.timerDark.classList.add("timerDark_run");
				return;
			}

			timerAudio.play({
				volume: 0.5,
			});

			game.elements.timer.classList.add("timer_start");
			game.timer.set = setTimeout(game.timer.add, 500);
		},
		reset: function () {
			clearTimeout(game.timer.set);
			game.elements.timer.classList.remove("timer_start");
			game.timer.sec = 3;
			game.elements.timerCount.textContent = game.timer.sec;

			game.elements.touchControl.classList.remove("touchControl_none");

			if (game.states.pause == true) {
				game.elements.timer.classList.add("timer_start");
				game.elements.timerCount.textContent = "Пауза";
				letterText(game.elements.timerCount, 5, 10);
			} else {
				game.elements.timer.classList.remove("timer_start");
				letterText(game.elements.timerCount, 5, 10);
			}
		},
	},
	settings: {
		speed: "medium",
		theme: "tetris",
	},
	states: {
		playing: false,
		pause: false,
		gameOver: true,
		gameWin: false,
	},
	count: 0,
	speed: 200,
	darkSec: 3,
	start: function () {
		game.timer.start();

		game.states.gameOver = false;
		game.states.gameWin = false;

		if (game.settings.theme == "tetris") {
			clearTimeout(game.sets.cyberBackground);
		} else if (game.settings.theme == "cyberpunk") {
			clearTimeout(game.sets.cyberBackground);

			let cyberBackgroundText = [];
			for (let i = 0; i < 3; i++) {
				cyberBackgroundText.push(randomText(3, 3000, "lettersEng"));
			}
			let i = 2;
			game.sets.cyberBackground = setInterval(function () {
				i++;
				game.elements.cyberBackground.textContent = cyberBackgroundText[i % 3];
			}, 1000);
		}
	},
	stop: function () {
		if (game.states.pause == false) {
			game.states.playing = false;
		}

		clearTimeout(game.sets.steps);

		clearTimeout(game.sets.hackPlay);
		clearTimeout(game.sets.wakeUpVisible);

		cyberpunkEgg.stop();
		hackAudio.stop();

		winCyberpunk.stop();
		winTetris.stop();

		game.timer.reset();
	},
	snakeDefault: function () {
		for (let i = 0; i < game.elements.td.length; i++) {
			// if (game.elements.td[i].classList.contains("win")) {
			// 	game.elements.td[i].classList.remove("win");
			// }

			game.elements.td[i].className = "table__cell";
			game.elements.td[i].removeEventListener("click", egg);

			if (game.elements.td[i].hasAttribute("style")) {
				game.elements.td[i].removeAttribute("style");
			}
		}

		game.elements.td[0].classList.add("head");

		if (game.settings.speed == "low") {
			game.darkSec = 0.35 * playingField.numberOfCellsInOneRow;
		} else if (game.settings.speed == "medium") {
			game.darkSec = 0.3 * playingField.numberOfCellsInOneRow;
		} else if (game.settings.speed == "high") {
			game.darkSec = 0.25 * playingField.numberOfCellsInOneRow;
		}

		// if (playingField.numberOfCellsInOneRow == 8) {
		// 	if (game.settings.speed == "low") {
		// 		game.darkSec = 3;
		// 	} else if (game.settings.speed == "medium") {
		// 		game.darkSec = 2.5;
		// 	} else if (game.settings.speed == "high") {
		// 		game.darkSec = 2;
		// 	}
		// } else if (playingField.numberOfCellsInOneRow == 10) {
		// 	if (game.settings.speed == "low") {
		// 		game.darkSec = 3.5;
		// 	} else if (game.settings.speed == "medium") {
		// 		game.darkSec = 3;
		// 	} else if (game.settings.speed == "high") {
		// 		game.darkSec = 2.5;
		// 	}
		// } else if (playingField.numberOfCellsInOneRow == 14) {
		// 	if (game.settings.speed == "low") {
		// 		game.darkSec = 4.25;
		// 	} else if (game.settings.speed == "medium") {
		// 		game.darkSec = 3.75;
		// 	} else if (game.settings.speed == "high") {
		// 		game.darkSec = 3.25;
		// 	}
		// }

		snake.routeArray.length = 0;

		if (game.elements.score.hasAttribute("style")) {
			game.elements.score.removeAttribute("style");
		}

		if (game.elements.hack.classList.contains("hack_animation")) {
			game.elements.hack.classList.remove("hack_animation");
		}

		if (game.elements.wakeUpText.classList.contains("info__wakeUpText_visible")) {
			game.elements.wakeUpText.classList.remove("info__wakeUpText_visible");
		}

		if (game.elements.field.classList.contains("field_bgBlack")) {
			game.elements.field.classList.remove("field_bgBlack");
		}
		// cyberpunkEgg.pause();
		// cyberpunkEgg.currentTime = 0;

		if (game.elements.field.classList.contains("field_hack")) {
			game.elements.field.classList.remove("field_hack");
		}

		if (game.elements.field.classList.contains("field_image")) {
			game.elements.field.classList.remove("field_image");
		}

		if (game.elements.hack.hasAttribute("style")) {
			game.elements.hack.removeAttribute("style");
		}

		// winTetris.pause();
		// winTetris.currentTime = 0;

		game.states.pause = false;
		// game.timer.reset();
		if (game.elements.gameOverText.classList.contains("info__overText_visible")) {
			game.elements.gameOverText.classList.remove("info__overText_visible");
		}
		if (game.elements.winText.classList.contains("info__winText_visible")) {
			game.elements.winText.classList.remove("info__winText_visible");
		}
		game.count = 0;
		snake.long = 0;
		snake.route = "right";
		snake.newRoute = snake.route;
		if (game.elements.field.classList.contains("shake")) {
			game.elements.field.classList.remove("shake");
		}

		document.getElementById("wtf__text").textContent = "";

		// if (typeof snake.apple != "undefined" && typeof game.elements.td[snake.apple] != "undefined") {
		// 	game.elements.td[snake.apple].classList.remove("apple");
		// 	game.elements.td[snake.apple].removeEventListener("click", egg);
		// }

		// if (typeof game.elements.td[snake.headPosition - 1] != "undefined") {
		// 	game.elements.td[snake.headPosition - 1].classList.remove("head", "crash", "eating");
		// 	game.elements.td[snake.headPosition - 1].removeEventListener("click", egg);
		// }

		let wtfEl = document.getElementById("wtf");
		let wtfBtntEl = document.getElementById("wtf__btn");
		eggClick = 0;
		if (wtfEl.classList.contains("wtf_visible")) {
			wtfEl.classList.remove("wtf_visible");
		}
		if (wtfBtntEl.classList.contains("wtf__btn_visible")) {
			wtfBtntEl.classList.remove("wtf__btn_visible");
		}

		// for (let i = 0; i < game.elements.td.length; i++) {
		// 	game.elements.td[i].classList.remove("win");
		// }

		snake.headPosition = 1;
		snake.nextHeadPosition = 2;
		// for (let i = 0; i < snake.history.length; i++) {
		// 	if (typeof game.elements.td[snake.history[i]] != "undefined") {
		// 		if (game.elements.td[snake.history[i]].classList.contains("body")) {
		// 			game.elements.td[snake.history[i]].classList.remove("body");
		// 		}
		// 		if (game.elements.td[snake.history[i]].classList.contains("crash")) {
		// 			game.elements.td[snake.history[i]].classList.remove("crash");
		// 		}
		// 	}
		// }

		if (game.elements.cyberpunkEgg.classList.contains("cyberpunkRange_visible")) {
			game.elements.cyberpunkEgg.classList.remove("cyberpunkRange_visible");
		}
		game.elements.cyberpunkEgg.value = 0;

		snake.history.length = 0;
		// if (!game.elements.td[snake.headPosition - 1].classList.contains("head")) {
		// 	game.elements.td[snake.headPosition - 1].classList.add("head");
		// }
		game.scoreChange();

		snake.apple = getRandomForApple(game.elements.td.length);
		game.elements.td[snake.apple].classList.add("apple");

		if (game.elements.dark.classList.contains("field__dark_visible")) {
			game.elements.dark.classList.remove("field__dark_visible");
		}
		if (game.elements.timerDark.classList.contains("timerDark_run")) {
			game.elements.timerDark.classList.remove("timerDark_run");
		}
	},
	over: function () {
		game.elements.gameOverText.classList.add("info__overText_visible");

		if (game.settings.theme == "tetris") {
			letterText(game.elements.gameOverText, 3, 25, true);
			crashTetris.play({
				volume: 0.03,
			});
			game.elements.td[snake.headPosition - 1].addEventListener("click", egg);
		} else if (game.settings.theme == "cyberpunk") {
			crashCyber.play({
				volume: 0.3,
			});
		}

		game.elements.field.classList.add("shake");
		game.elements.td[snake.headPosition - 1].classList.add("crash");
		for (let i = 0; i < snake.history.length; i++) {
			game.elements.td[snake.history[i]].classList.add("crash");
		}

		game.elements.cyberpunkEgg.classList.add("cyberpunkRange_visible");

		game.states.gameOver = true;
		game.stop();

		// game.elements.dark.style.transition = "opacity 10s, visibility 0s";
		if (game.elements.dark.classList.contains("field__dark_visible")) {
			game.elements.dark.classList.remove("field__dark_visible");
		}
		if (game.elements.timerDark.classList.contains("timerDark_run")) {
			game.elements.timerDark.classList.remove("timerDark_run");
		}

		if (!game.elements.touchControl.classList.contains("touchControl_none")) {
			game.elements.touchControl.classList.add("touchControl_none");
		}
	},
	win: function () {
		// game.elements.gameOverText.classList.remove('info__overText_visible');
		game.elements.winText.classList.add("info__winText_visible");

		if (game.settings.theme == "tetris") {
			letterText(game.elements.winText, 3, 25, true);

			winTetris.play({
				volume: 0.03,
				loop: true,
			});
		} else if (game.settings.theme == "cyberpunk") {
			winCyberpunk.play({
				volume: 0.2,
				loop: true,
			});
		}

		game.elements.td[snake.headPosition - 1].classList.add("win");
		snake.winAnimation(0);

		game.states.gameWin = true;

		if (game.elements.dark.classList.contains("field__dark_visible")) {
			game.elements.dark.classList.remove("field__dark_visible");
		}
		if (game.elements.timerDark.classList.contains("timerDark_run")) {
			game.elements.timerDark.classList.remove("timerDark_run");
		}
	},
	score: 0,
	scoreChange: function () {
		let multiplier;

		// if (game.speed == 250) {
		//     multiplier = 1;
		// }

		// if (game.speed == 200) {
		//     multiplier = 2;
		// }

		// if (game.speed == 150) {
		//     multiplier = 3;
		// }

		if (game.settings.speed == "low") {
			multiplier = 1;
		} else if (game.settings.speed == "medium") {
			multiplier = 2;
		} else if (game.settings.speed == "high") {
			multiplier = 3;
		}

		game.score = 10 * snake.long * multiplier;
		game.elements.scoreValue.textContent = Math.round(game.score);
		letterText2(game.elements.scoreValue, 10, 20);
	},
	checkKey: function (pressKey) {
		const availableKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", "KeyW", "KeyD", "KeyS", "KeyA"];
		return availableKeys.includes(pressKey);
	},
};

if (navigator.userAgent.toLowerCase().indexOf("firefox") > 0 || navigator.userAgent.toLowerCase().indexOf("mozilla") > 0) {
	game.elements.touchControl.style.display = "none";
	alert("Сенсорную управление недоступно, смените браузер.");
}

const playingField = {
	// объект нашего игрового поля
	numberOfCellsInOneRow: 10, // количество ячеек в одном ряду
	numberOfCellsInOneColumn: 10, // количество ячеек в одном столбце
	get totalNumberOfCells() {
		return this.numberOfCellsInOneRow * this.numberOfCellsInOneColumn;
	},
	get fieldIndices() {
		let array = [];
		for (let i = 0; i < playingField.totalNumberOfCells; i++) {
			array.push(i);
		}

		return array;
	},
	removeTable: function () {
		let oldTable = document.getElementsByClassName("table");
		oldTable[0].parentNode.removeChild(oldTable[0]);
	},
	createPlayingField: function (rows, columns) {
		// метод, который генерирует игровое поле, с параметрами количества рядов и столбцов
		let newTable = document.createElement("div"); // создаём DOM элемент <table></table>
		newTable.classList.add("table");
		document.getElementById("playingField").appendChild(newTable); // помещаем созданный DOM элемент <table></table> в <div id="playingField"></div>

		for (let r = 0; r < rows; r++) {
			// запускаем цикл в количестве рядов для создания DOM элемента <tr></tr>
			let newTr = document.createElement("div"); // создаём DOM элемент <tr></tr>
			newTr.classList.add("table__line");
			newTable.appendChild(newTr); // помещаем созданный DOM элемент <tr></tr> в <table></table>

			for (let c = 0; c < columns; c++) {
				// запускаем цикл в количестве колонн для создания DOM элемента <td></td>
				let newTd = document.createElement("div"); // создаём DOM элемент <td></td>
				newTd.classList.add("table__cell");
				newTr.appendChild(newTd); // помещаем созданный DOM элемент <td></td> в <tr></tr>
				let newSpan = document.createElement("span");
				newTd.appendChild(newSpan);
			}
		}
	},
	updateTable: function (number) {
		let table = document.getElementsByClassName("table");
		let tableRows = document.getElementsByClassName("table__line");
		let rowCells = tableRows[0].getElementsByClassName("table__cell");

		if (number == tableRows.length) {
			return;
		} else {
			console.log(tableRows[0].children.length);
			for (let i = 0; i < tableRows[0].children.length; i++) {
				tableRows[0].children[i].className = "table__cell";
			}
		}

		if (number > tableRows.length) {
			let newRows = number - tableRows.length;
			for (let i = 0; i < newRows; i++) {
				table[0].appendChild(tableRows[0].cloneNode(true));
			}

			let cellsOld = rowCells.length;

			for (let i = 0; i < tableRows.length; i++) {
				for (let y = 0; y < number - cellsOld; y++) {
					tableRows[i].appendChild(rowCells[0].cloneNode(true));
				}
			}
		} else if (number < tableRows.length) {
			let newRows = tableRows.length - number;
			for (let i = 0; i < newRows; i++) {
				table[0].removeChild(tableRows[tableRows.length - 1]);
			}

			let cellsOld = rowCells.length;

			for (let i = 0; i < tableRows.length; i++) {
				for (let y = 0; y < cellsOld - number; y++) {
					let removeCell = tableRows[i].getElementsByClassName("table__cell");
					tableRows[i].removeChild(removeCell[removeCell.length - 1]);
				}
			}
		}
	},
	borders: {
		top: [],
		right: [],
		bottom: [],
		left: [],
	},
	bordersUpdate: function () {
		(function () {
			playingField.borders.top.length = 0;
			let number = 0;
			for (let i = 0; i < playingField.numberOfCellsInOneRow; i++) {
				playingField.borders.top.push(number);
				number++;
			}
		})();

		(function () {
			playingField.borders.right.length = 0;
			let number = playingField.numberOfCellsInOneRow - 1;
			for (let i = 0; i < playingField.numberOfCellsInOneColumn; i++) {
				playingField.borders.right.push(number);
				number = number + playingField.numberOfCellsInOneRow;
			}
		})();

		(function () {
			playingField.borders.bottom.length = 0;
			let number = playingField.numberOfCellsInOneRow * (playingField.numberOfCellsInOneColumn - 1);
			for (let i = 0; i < playingField.numberOfCellsInOneRow; i++) {
				playingField.borders.bottom.push(number);
				number++;
			}
		})();

		(function () {
			playingField.borders.left.length = 0;
			let number = 0;
			for (let i = 0; i < playingField.numberOfCellsInOneColumn; i++) {
				playingField.borders.left.push(number);
				number = number + playingField.numberOfCellsInOneRow;
			}
		})();
	},
	//    cellWidth: game.elements.td[0].offsetWidth,
	//    cellHeight: game.elements.td[0].offsetHeight
};

// playingField.createPlayingField(playingField.numberOfCellsInOneColumn, playingField.numberOfCellsInOneRow); // вызываем метод создания игрового поля и передаем ему аргументы с количеством ячеек в рядах и столбцах

document.body.classList.add("tetris"); // присваиваем класс с темой

playingField.bordersUpdate();

/*------------------------------------*/

const snake = {
	// объект нашей змейки
	long: 0, // длина змейки без учета головы
	route: "right", // начальное направление змейки
	newRoute: "right",
	routeArray: [],
	headPosition: 1, // начальное положение головы змейки
	nextHeadPosition: 2, // переменная следующего шага
	history: [], // координаты тела змейки без учета головы
	apple: undefined,
	clearTransition: function () {
		game.elements.td[snake.headPosition - 1].removeAttribute("style");

		if (snake.long > 0) {
			for (let i = 0; i < snake.history.length; i++) {
				game.elements.td[snake.history[i]].removeAttribute("style");
			}
		}
	},
	transition: function () {
		let x, y;
		if (snake.route == "left") {
			x = -game.elements.td[0].offsetWidth;
			y = 0;
		} else if (snake.route == "right") {
			x = game.elements.td[0].offsetWidth;
			y = 0;
		} else if (snake.route == "up") {
			x = 0;
			y = -game.elements.td[0].offsetHeight;
		} else if (snake.route == "down") {
			x = 0;
			y = game.elements.td[0].offsetHeight;
		}

		game.elements.td[snake.headPosition - 1].style.transition = "transform " + game.speed / 1000 + "s linear";
		game.elements.td[snake.headPosition - 1].style.transform = "translate3d(" + x + "px, " + y + "px, 0)";

		if (snake.long > 0) {
			let zIndex = 500;
			for (let i = 0; i < snake.history.length; i++) {
				zIndex--;
				game.elements.td[snake.history[i]].style.zIndex = zIndex - i;

				let x, y, nextPosition;

				if (i == 0) {
					nextPosition = snake.headPosition - 1;
				} else {
					nextPosition = snake.history[i - 1];
				}

				if (nextPosition - snake.history[i] == -1) {
					x = -game.elements.td[0].offsetWidth;
					y = 0;
				} else if (nextPosition - snake.history[i] == 1) {
					x = game.elements.td[0].offsetWidth;
					y = 0;
				} else if (nextPosition - snake.history[i] == -playingField.numberOfCellsInOneRow) {
					x = 0;
					y = -game.elements.td[0].offsetHeight;
				} else if (nextPosition - snake.history[i] == playingField.numberOfCellsInOneRow) {
					x = 0;
					y = game.elements.td[0].offsetHeight;
				}

				game.elements.td[snake.history[i]].style.transition = "transform " + game.speed / 1000 + "s linear";
				game.elements.td[snake.history[i]].style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
			}
		}
	},
	updateHead: function () {
		game.elements.td[snake.headPosition - 1].classList.remove("head");
		snake.headPosition = snake.nextHeadPosition;
		game.elements.td[snake.headPosition - 1].classList.add("head");
	},
	updateHistory: function () {
		if (snake.long > 0) {
			// for (let i=0; i<snake.history.length; i++) {
			//     game.elements.td[snake.history[i]].classList.remove('body');
			// }

			snake.history.unshift(snake.headPosition - 1);
			game.elements.td[snake.history[0]].classList.add("body");
			if (snake.history.length > snake.long) {
				game.elements.td[snake.history[snake.history.length - 1]].classList.remove("body");
				snake.history.pop();
			}

			// for (let i=0; i<snake.history.length; i++) {
			//     game.elements.td[snake.history[i]].classList.add('body');
			// }
		}
	},
	newNextPosition: function () {
		snake.prevRoute = snake.route;
		snake.route = snake.newRoute;

		if (snake.routeArray.length > 0) {
			snake.route = snake.routeArray[0];
			snake.routeArray.shift();
		}

		if (snake.route == "left") {
			gameOverCheck(playingField.borders.left);
			snake.nextHeadPosition = snake.headPosition - 1;

			if (game.settings.theme == "cyberpunk" && snake.prevRoute != snake.route) {
				// newRouteSound.stop();
				newRouteSound.play({
					volume: 0.2,
				});
			}
		} else if (snake.route == "right") {
			gameOverCheck(playingField.borders.right);
			snake.nextHeadPosition = snake.headPosition + 1;

			if (game.settings.theme == "cyberpunk" && snake.prevRoute != snake.route) {
				// newRouteSound.stop();
				newRouteSound.play({
					volume: 0.2,
				});
			}
		} else if (snake.route == "up") {
			gameOverCheck(playingField.borders.top);
			snake.nextHeadPosition = snake.headPosition - playingField.numberOfCellsInOneRow;

			if (game.settings.theme == "cyberpunk" && snake.prevRoute != snake.route) {
				// newRouteSound.stop();
				newRouteSound.play({
					volume: 0.2,
				});
			}
		} else if (snake.route == "down") {
			gameOverCheck(playingField.borders.bottom);
			snake.nextHeadPosition = snake.headPosition + playingField.numberOfCellsInOneRow;

			if (game.settings.theme == "cyberpunk" && snake.prevRoute != snake.route) {
				// newRouteSound.stop();
				newRouteSound.play({
					volume: 0.2,
				});
			}
		}
	},
	move: function () {
		// метод движения (отрисовки) нашей змейки
		game.count++; // счетчик шагов

		if (game.settings.theme == "tetris") {
			snake.newNextPosition();
			if (game.states.gameOver) {
				return;
			}

			gameOverCheck(snake.history, true);
			if (game.states.gameOver) {
				return;
			}

			snake.updateHistory();

			snake.updateHead();

			// gameOverCheck(snake.history);
			// if (game.states.gameOver) {
			// 	return;
			// }

			stepTetris.play({
				volume: 0.005,
			});

			snake.eatingAnApple();
			if (game.states.gameWin) {
				return;
			}
		} else if (game.settings.theme == "cyberpunk") {
			snake.clearTransition();
			snake.eatingAnApple();

			snake.updateHistory();

			// gameOverCheck(snake.history);
			// if (game.states.gameOver) {
			// 	return;
			// }

			if (game.count != 1) {
				snake.updateHead();
				game.elements.td[snake.headPosition - 1].style.zIndex = 501;
			}

			snake.newNextPosition();
			if (game.states.gameOver) {
				return;
			}

			gameOverCheck(snake.history, true);
			if (game.states.gameOver) {
				return;
			}

			snake.transition();

			if (game.states.gameWin) {
				return;
			}
		}

		game.sets.steps = setTimeout(function () {
			snake.move();
		}, game.speed);
	},
	eatingAnApple: function () {
		if (snake.nextHeadPosition - 1 == snake.apple) {
			if (game.settings.theme == "tetris") {
				eatingTetris.stop();
				eatingTetris.play({
					volume: 0.02,
				});
			} else if (game.settings.theme == "cyberpunk") {
				eatingCyber.stop();
				eatingCyber.play({
					volume: 0.5,
				});
			}

			snake.long++;
			game.darkSec = game.darkSec + 0.1;
			game.scoreChange();
			game.elements.td[snake.apple].classList.remove("apple");
			game.elements.td[snake.nextHeadPosition - 1].classList.add("eating");

			let headPos = snake.nextHeadPosition - 1;
			setTimeout(function () {
				game.elements.td[headPos].classList.remove("eating");
			}, 1000);

			snake.apple = getRandomForApple(game.elements.td.length);

			if (game.states.gameOver == true || game.states.playing == false) {
				return;
			}

			game.elements.td[snake.apple].classList.add("apple");

			// const animation = new Promise((resolve, reject) => {
			// 	if (game.elements.dark.classList.contains("field__dark_visible")) {
			// 		game.elements.dark.classList.remove("field__dark_visible");
			// 	}
			// 	resolve();
			// });

			// animation.then((value) => {
			// 	game.elements.dark.classList.add("field__dark_visible");
			// });

			resetAnimation(game.elements.dark, "field__dark_visible");

			game.elements.dark.style.animationDuration = game.darkSec + "s";
			game.elements.dark.classList.add("field__dark_visible");

			resetAnimation(game.elements.timerDark, "timerDark_run");

			game.elements.timerDark.style.animationDuration = game.darkSec + "s";
			game.elements.timerDark.classList.add("timerDark_run");
		}
	},
	winAnimation: function (recursFunc) {
		let winAnimationSpeed = 1000 / playingField.totalNumberOfCells;

		game.elements.td[snake.headPosition - 1].classList.add("win");

		if (recursFunc < snake.history.length) {
			game.elements.td[snake.history[recursFunc]].classList.add("win");
			recursFunc++;
			setTimeout(snake.winAnimation, winAnimationSpeed, recursFunc);
		} else {
			recursFunc = 0;
			return;
		}
	},
};

game.elements.cyberpunkEgg.addEventListener("input", function (event) {
	if (game.elements.cyberpunkEgg.value == 100) {
		eggFind.play({
			volume: 0.2,
		});
		game.elements.cyberpunkEgg.classList.remove("cyberpunkRange_visible");
		wakeUp();
	}
});

function wakeUp() {
	for (let i = 0; i < game.elements.td.length; i++) {
		game.elements.td[i].style.transition = "opacity 1s";
		game.elements.td[i].style.opacity = 0;
		game.elements.score.style.display = "none";
		game.elements.gameOverText.classList.remove("info__overText_visible");
	}

	game.elements.hack.classList.add("hack_animation");
	game.elements.hackText.textContent = "(*&^#@)+_(^_)(#&@^)";
	letterText2(game.elements.hackText, 190, 25);

	game.elements.field.classList.add("field_bgBlack");
	// cyberpunkEgg.play();
	// cyberpunkEgg.loop = true;
	cyberpunkEgg.play({
		volume: 0.2,
	});

	game.sets.hackPlay = setTimeout(function () {
		game.elements.hackText.textContent = "Взлом протокола_";
		progressiveShuffleAnimated(game.elements.hackText, 4, 25);
		hackAudio.play({
			volume: 0.3,
		});
		game.elements.field.classList.add("field_hack");
	}, 5000);
}

game.elements.cyberBackground.addEventListener("transitionend", function () {
	game.elements.field.classList.add("field_image");
	game.elements.hack.style.opacity = 0;

	game.sets.wakeUpVisible = setTimeout(function () {
		game.elements.wakeUpText.classList.add("info__wakeUpText_visible");
	}, 3500);
});

let eggClick = 0;
function egg() {
	if (game.states.gameOver == false && game.settings.theme != "tetris") {
		return;
	}
	let wtfEl = document.getElementById("wtf");
	let wtfTextEl = document.getElementById("wtf__text");
	let wtfBtntEl = document.getElementById("wtf__btn");
	let text;
	let btnText;

	eggClick++;

	switch (eggClick) {
		case 5:
			text = "Зачем ты по мне кликаешь?";
			btnText = "Ты кто?";

			wtfBtntEl.onclick = function () {
				wtfEl.classList.remove("wtf_visible");
				wtfBtntEl.classList.remove("wtf__btn_visible");
			};
			break;
		case 10:
			text = "Не делай этого, мне не нравится.";
			btnText = "Ладно";
			break;
		case 15:
			text = "Хватит.";
			btnText = "Ха!";
			break;
		case 20:
			text = "Тебе больше нечего делать?";
			btnText = "А тебе?";
			break;
		case 25:
			text = "Тут нужно в змейку играть, а не меня доставать.";
			btnText = "Я знаю";
			break;
		case 30:
			text = "Ну правда, прекращай.";
			btnText = "А что мне за это будет?";
			break;
		case 35:
			text = "Ладно, я просто буду тебя игнорировать.";
			btnText = "Стой!";
			break;
		case 50:
			text = "Палец не устал еще?";
			btnText = "Неа :)";
			break;
		case 55:
			text = "Ты по мне кликнул уже 55 раз.";
			btnText = "Могу ещё столько же";
			break;
		case 50:
			text = "Удивительно, насколько человек способен прожигать своё время в никуда.";
			btnText = "Это весело :)";
			break;
		case 55:
			text = "А знаешь, я уже привык к твоим тыканьям.";
			btnText = "Тык тык тык";
			break;
		case 60:
			text = "Проведем эксперимент. Посмотрим как ты себя поведешь. Я указываю тебе: БОЛЬШЕ НЕ НАЖИМАЙ НА МЕНЯ.";
			btnText = "Хм...";

			wtfBtntEl.onclick = function () {
				wtfEl.classList.remove("wtf_visible");
				wtfBtntEl.classList.remove("wtf__btn_visible");

				game.sets.experiment = setTimeout(function () {
					experimentFunc(wtfEl, wtfTextEl, wtfBtntEl);
				}, 10000);

				wtfBtntEl.onclick = function () {
					wtfEl.classList.remove("wtf_visible");
					wtfBtntEl.classList.remove("wtf__btn_visible");
				};
			};

			eggClick++;
			break;
		case 62:
			clearTimeout(game.sets.experiment);

			text = "Вот видишь как тобой легко управлять. Достаточно лишь сказать что делать и ты поступишь ровно наоборот. :)";
			btnText = "Не правда!";
			break;
		case 67:
			text = "С меня хватит, я ухожу.";
			btnText = "Эй подожди!";

			game.elements.td[snake.headPosition - 1].removeEventListener("click", egg);
			game.elements.td[snake.headPosition - 1].classList.remove("head", "crash");
			game.elements.td[snake.apple].addEventListener("click", egg);

			for (let i = 0; i < snake.history.length; i++) {
				if (typeof game.elements.td[snake.history[i]] != "undefined") {
					game.elements.td[snake.history[i]].classList.remove("body", "crash");
				}
			}
			break;
		case 68:
			text = "Теперь и меня решил подоставать? Я просто яблоко.";
			btnText = "Ням ням";
			game.elements.td[snake.apple].removeEventListener("click", egg);
			game.elements.td[snake.apple].classList.remove("apple");
			break;
		default:
			text = false;
	}

	if (text) {
		wtfEl.classList.add("wtf_visible");
		wtfTextEl.textContent = text;
		wtfBtntEl.textContent = btnText;
		letterText(wtfTextEl, 3, 10, true, function () {
			wtfBtntEl.classList.add("wtf__btn_visible");
		});
	}
}

function experimentFunc(el, textEl, btnEl) {
	el.classList.add("wtf_visible");
	textEl.textContent = "Вот видишь как тобой легко управлять. :)";
	btnEl.textContent = "Не правда!";

	letterText(textEl, 3, 10, true, function () {
		btnEl.classList.add("wtf__btn_visible");
	});

	eggClick = eggClick + 2;

	clearTimeout(game.sets.experiment);

	// btnEl.onclick = function() {
	//     el.classList.remove('wtf_visible');
	//     btnEl.classList.remove('wtf__btn_visible');
	// }
}

const textAnimation = function (id, text, countChange) {
	if (game.settings.theme == "tetris") {
		let el = document.getElementById(id);
		el.textContent = text;
		progressiveShuffleAnimated(el, countChange, 50);
	}
};

game.elements.settingsBtn.onclick = function () {
	let settingsPage = document.getElementById("settingsPage");

	if (game.settings.theme == "tetris") {
		clickAudio.play({
			volume: 0.2,
		});
	} else if (game.settings.theme == "cyberpunk") {
		cyberBtnClick.play({
			volume: 0.3,
		});
	}

	game.stop();
	// game.snakeDefault();
	settingsPage.classList.add("settings_open");

	game.elements.reloadBtn.setAttribute("tabindex", "-1");
	game.elements.settingsBtn.setAttribute("tabindex", "-1");
	game.elements.touchControl.classList.add("touchControl_none");

	glitchAudio.stop();
};

game.elements.reloadBtn.onclick = function () {
	if (game.settings.theme == "tetris") {
		clickAudio.play({
			volume: 0.2,
		});
	} else if (game.settings.theme == "cyberpunk") {
		cyberBtnClick.play({
			volume: 0.3,
		});
	}

	game.stop();
	game.snakeDefault();
	game.start();
	//    setTimeout(game.start, 1000);

	glitchAudio.stop();
};

game.elements.reloadBtn.addEventListener(
	"mouseenter",
	function (event) {
		textAnimation("reloadBtnText", "Старт", 2);

		if (game.settings.theme == "cyberpunk") {
			glitchAudio.play({
				volume: 0.035,
				loop: true,
			});
		}
	},
	false
);

game.elements.reloadBtn.addEventListener(
	"mouseleave",
	function (event) {
		glitchAudio.stop();
	},
	false
);

game.elements.reloadBtn.onfocus = function () {
	textAnimation("reloadBtnText", "Старт", 2);
};

game.elements.settingsBtn.addEventListener(
	"mouseenter",
	function (event) {
		textAnimation("settingsBtnText", "Настройки", 1);

		if (game.settings.theme == "cyberpunk") {
			glitchAudio.play({
				volume: 0.035,
				loop: true,
			});
		}
	},
	false
);

game.elements.settingsBtn.addEventListener(
	"mouseleave",
	function (event) {
		glitchAudio.stop();
	},
	false
);

game.elements.settingsBtn.onfocus = function () {
	textAnimation("settingsBtnText", "Настройки", 1);
};

game.elements.settingsSaveBtn.addEventListener(
	"mouseenter",
	function (event) {
		textAnimation("settingsSaveBtnText", "Сохранить", 1);

		if (game.settings.theme == "cyberpunk") {
			glitchAudio.play({
				volume: 0.035,
				loop: true,
			});
		}
	},
	false
);

game.elements.settingsSaveBtn.addEventListener(
	"mouseleave",
	function (event) {
		glitchAudio.stop();
	},
	false
);

game.elements.settingsSaveBtn.onfocus = function () {
	textAnimation("settingsSaveBtnText", "Сохранить", 1);
};

function submitForm(event) {
	event.preventDefault();
}

game.elements.settingsSaveBtn.onclick = function () {
	let settingsPage = document.getElementById("settingsPage");

	let settingsFieldSize = Number(document.querySelector('input[name="fieldSize"]:checked').value);
	let settingsSpeed = document.querySelector('input[name="speed"]:checked').value;
	let settingsTheme = document.querySelector('input[name="theme"]:checked').value;

	if (settingsSpeed == "low") {
		game.speed = 250;
	} else if (settingsSpeed == "medium") {
		game.speed = 200;
	} else if (settingsSpeed == "high") {
		game.speed = 150;
	}

	game.settings.speed = settingsSpeed;

	game.settings.theme = settingsTheme;
	document.body.classList.remove("tetris", "cyberpunk");
	document.body.classList.add(settingsTheme);

	// playingField.removeTable();

	playingField.updateTable(settingsFieldSize); // вызываем метод создания игрового поля и передаем ему аргументы с количеством ячеек в рядах и столбцах

	playingField.numberOfCellsInOneRow = settingsFieldSize;
	playingField.numberOfCellsInOneColumn = settingsFieldSize;

	playingField.bordersUpdate();

	settingsPage.classList.remove("settings_open");
	// game.stop();
	game.snakeDefault();
	game.start();

	if (game.settings.theme == "tetris") {
		clickAudio.play({
			volume: 0.2,
		});
	} else if (game.settings.theme == "cyberpunk") {
		cyberBtnClick.play({
			volume: 0.3,
		});
	}

	game.elements.reloadBtn.setAttribute("tabindex", "0");
	game.elements.settingsBtn.setAttribute("tabindex", "0");
	game.elements.touchControl.classList.remove("touchControl_none");

	glitchAudio.stop();
};

game.elements.settingsForm.addEventListener("change", function () {
	if (game.settings.theme == "tetris") {
		settingsChange.play({
			volume: 0.2,
		});
	} else if (game.settings.theme == "cyberpunk") {
		settingsChange.play({
			volume: 0.2,
		});
	}
});

// game.elements.field.addEventListener("touchstart", function (e) {
//     TouchStart(e);
// });

// function TouchStart(e) {
//     let rect = game.elements.field.getBoundingClientRect();

//     let x = e.changedTouches[0].clientX - rect.left;
//     let y = e.changedTouches[0].clientY - rect.top;

//     // let width = document.documentElement.clientWidth;
//     // let width = game.elements.field.offsetWidth;
//     // let height = document.documentElement.clientHeight;
//     // let height = game.elements.field.offsetHeight;

//     console.log(x);
//     console.log(y);

//     let code;

//     if ((x < rect.width) && (y < rect.height/3)) {
//         code = 'ArrowUp';
//     } else if ((x < rect.width) && (y > rect.height/1.5)) {
//         code = 'ArrowDown';
//     } else if ((x < rect.width/2) && (y > rect.height/3) && (y < rect.height/1.5)) {
//         code = 'ArrowLeft';
//     } else if ((x > rect.width/2) && (y > rect.height/3) && (y < rect.height/1.5)) {
//         code = 'ArrowRight';
//     }

//     newRouteFunc(code);
// }

game.elements.touchControl.onmousedown = function (e) {
	newRouteFunc(e.target.value);
	boostSpeed(e.target.value);
	if (!e.target.classList.contains("touch")) {
		e.target.classList.add("touch");
	}
};

game.elements.touchControl.ontouchstart = function (e) {
	e.preventDefault();
	e.stopPropagation();
	newRouteFunc(e.target.value);
	boostSpeed(e.target.value);
	if (!e.target.classList.contains("touch")) {
		e.target.classList.add("touch");
	}
};

game.elements.touchControl.onmouseup = function (e) {
	boostSpeedReset();
	if (e.target.classList.contains("touch")) {
		e.target.classList.remove("touch");
	}
};

game.elements.touchControl.ontouchend = function (e) {
	e.preventDefault();
	e.stopPropagation();
	boostSpeedReset();
	if (e.target.classList.contains("touch")) {
		e.target.classList.remove("touch");
	}
};

// game.elements.touchBtnTop.onmousedown = function() {
//     newRouteFunc('ArrowUp');
//     boostSpeed('ArrowUp');
// }

// game.elements.touchBtnTop.ontouchstart = function() {
//     newRouteFunc('ArrowUp');
//     boostSpeed('ArrowUp');
// }

// game.elements.touchBtnTop.onmouseup = function() {
//     boostSpeedReset();
// }

// game.elements.touchBtnTop.ontouchend = function() {
//     boostSpeedReset();
// }

// game.elements.touchBtnRight.onmousedown = function() {
//     newRouteFunc('ArrowRight');
//     boostSpeed('ArrowRight');
// }

// game.elements.touchBtnRight.ontouchstart = function() {
//     newRouteFunc('ArrowRight');
//     boostSpeed('ArrowRight');
// }

// game.elements.touchBtnRight.onmouseup = function() {
//     boostSpeedReset();
// }

// game.elements.touchBtnRight.ontouchend = function() {
//     boostSpeedReset();
// }

// game.elements.touchBtnBottom.onmousedown = function() {
//     newRouteFunc('ArrowDown');
//     boostSpeed('ArrowDown');
// }

// game.elements.touchBtnBottom.ontouchstart = function() {
//     newRouteFunc('ArrowDown');
//     boostSpeed('ArrowDown');
// }

// game.elements.touchBtnBottom.onmouseup = function() {
//     boostSpeedReset();
// }

// game.elements.touchBtnBottom.ontouchend = function() {
//     boostSpeedReset();
// }

// game.elements.touchBtnLeft.onmousedown = function() {
//     newRouteFunc('ArrowLeft');
//     boostSpeed('ArrowLeft');
// }

// game.elements.touchBtnLeft.ontouchstart = function() {
//     newRouteFunc('ArrowLeft');
//     boostSpeed('ArrowLeft');
// }

// game.elements.touchBtnLeft.onmouseup = function() {
//     boostSpeedReset();
// }

// game.elements.touchBtnLeft.ontouchend = function() {
//     boostSpeedReset();
// }

document.addEventListener("keydown", function (event) {
	let code = event.code;
	newRouteFunc(code);
	boostSpeed(code);

	event.stopPropagation();
});

document.addEventListener("keyup", function (event) {
	boostSpeedReset();

	event.stopPropagation();
});

const newRouteWrapFunc = function () {
	let pressCount;

	return function (code) {
		if (code == "Escape" || code == "KeyP" || code == "Pause") {
			if (game.states.pause == false) {
				if (game.states.playing == false) {
					return;
				}
				// pauseAudio.stop();

				if (game.settings.theme == "tetris") {
					pauseAudio.play({
						volume: 0.4,
					});
				} else if (game.settings.theme == "cyberpunk") {
					cyberPauseAudio.play({
						volume: 0.4,
					});
				}

				game.states.pause = true;
				game.states.playing = false;
				game.timer.reset();
				game.stop();
				snake.routeArray.length = 0;
			} else {
				game.states.pause = false;
				game.start();
			}
		}

		if (!game.checkKey(code) || game.states.playing == false || game.states.pause == true) {
			return;
		}

		let route;

		if (pressCount != game.count) {
			snake.routeArray.length = 0;
		}

		if (snake.routeArray.length == 0) {
			route = snake.route;
		} else {
			route = snake.routeArray[snake.routeArray.length - 1];
		}

		if (code == "ArrowUp" || code == "KeyW") {
			if (route == "down" || route == "up") {
				return;
			}
			snake.newRoute = "up";
		} else if (code == "ArrowRight" || code == "KeyD") {
			if (route == "left" || route == "right") {
				return;
			}
			snake.newRoute = "right";
		} else if (code == "ArrowDown" || code == "KeyS") {
			if (route == "up" || route == "down") {
				return;
			}
			snake.newRoute = "down";
		} else if (code == "ArrowLeft" || code == "KeyA") {
			if (route == "right" || route == "left") {
				return;
			}
			snake.newRoute = "left";
		}

		snake.routeArray.push(snake.newRoute);
		pressCount = game.count;
	};
};

const newRouteFunc = newRouteWrapFunc();

function boostSpeed(code) {
	if (game.states.playing) {
		if (code == "ArrowUp" || code == "KeyW") {
			if (snake.route == "up") {
				game.speed = 200 / 2;

				if (game.settings.theme == "cyberpunk") {
					cyberSpeed.play();
				}
			}
		} else if (code == "ArrowRight" || code == "KeyD") {
			if (snake.route == "right") {
				game.speed = 200 / 2;

				if (game.settings.theme == "cyberpunk") {
					cyberSpeed.play();
				}
			}
		} else if (code == "ArrowDown" || code == "KeyS") {
			if (snake.route == "down") {
				game.speed = 200 / 2;

				if (game.settings.theme == "cyberpunk") {
					cyberSpeed.play();
				}
			}
		} else if (code == "ArrowLeft" || code == "KeyA") {
			if (snake.route == "left") {
				game.speed = 200 / 2;

				if (game.settings.theme == "cyberpunk") {
					cyberSpeed.play();
				}
			}
		}
	}
}

function boostSpeedReset() {
	if (game.settings.speed == "low") {
		game.speed = 250;
	} else if (game.settings.speed == "medium") {
		game.speed = 200;
	} else if (game.settings.speed == "high") {
		game.speed = 150;
	}

	if (game.settings.theme == "cyberpunk") {
		cyberSpeed.pause();
		cyberSpeed.currentTime = 0;
	}
}

function gameOverCheck(lineArr, notLastIndex) {
	// if (lineArr.length == 0) {
	// 	return;
	// }

	// let cloneLineArr = lineArr.slice();
	// if (notLastIndex) {
	// 	cloneLineArr.pop();
	// }
	// if (cloneLineArr.includes(snake.nextHeadPosition - 1)) {
	// 	game.over();

	// 	if (game.settings.theme == "cyberpunk") {
	// 		cyberSpeed.pause();
	// 		cyberSpeed.currentTime = 0;
	// 	}
	// }

	if (lineArr.length == 0) {
		return;
	}

	let lastElArray;
	if (notLastIndex) {
		lastElArray = lineArr[lineArr.length - 1];
		lineArr.pop();
	}
	if (lineArr.includes(snake.nextHeadPosition - 1)) {
		if (notLastIndex) {
			lineArr.push(lastElArray);
		}

		game.over();

		if (game.settings.theme == "cyberpunk") {
			cyberSpeed.pause();
			cyberSpeed.currentTime = 0;
		}

		return;
	}
	if (notLastIndex) {
		lineArr.push(lastElArray);
	}
}

function getRandomForApple(max) {
	let maxHistory;
	if (game.settings.theme == "cyberpunk") {
		maxHistory = snake.history.length + 1;
	} else {
		maxHistory = snake.history.length;
	}
	if (maxHistory == playingField.totalNumberOfCells - 1) {
		game.stop();
		game.win();
		return;
	}

	let random;
	// let randomOk = false;

	let randomArray = playingField.fieldIndices.filter(function (el, index, array) {
		if (snake.history.includes(el) || el == snake.headPosition - 1 || el == snake.nextHeadPosition - 1) {
			return false;
		} else {
			return true;
		}
	});

	//    if (game.theme == 'cyberpunk') {
	//        randomArray.push(snake.history[snake.history.length-1]);
	//    }

	random = Math.floor(Math.random() * randomArray.length);
	random = randomArray[random];

	return random;
}

function letterText2(el, randomCount, delay) {
	let text = el.textContent;
	writeText();
	randomCount++;
	function writeText() {
		el.textContent = randomText(text.length, 1, whatIsTheSymbol(text.charAt(0)));

		randomCount--;

		if (randomCount == 0) {
			el.textContent = text;
			return;
		} else {
			setTimeout(function () {
				writeText();
			}, delay);
		}
	}
}

function randomText(lengthWord, wordsCount, data) {
	let str = "";
	let word = "";

	for (let w = 0; w < wordsCount; w++) {
		for (let i = 0; i < lengthWord; i++) {
			if (w == 30) {
				word = "DMX";
			} else {
				word = word + pass_gen(1, data);
			}
		}

		str = str + word + " ";
		word = "";
	}

	return str;
}

function letterText(el, randomCount, delay, sound, endFunc) {
	let keyboardAudio;

	if (sound) {
		keyboardAudio = new Audio();

		keyboardAudio.preload = "auto";
		keyboardAudio.src = "sounds/keyboard.mp3";
		keyboardAudio.volume = 0.2;

		keyboardAudio.play();
	}

	let text = el.textContent;
	el.textContent = "";
	let textArray = [];
	for (let i = 0; i < text.length; i++) {
		textArray.push(text.charAt(i));
	}

	let startLetter = -1;
	writeText();

	function writeText() {
		startLetter++;
		let okText = text.substr(0, startLetter);
		let randCount = randomCount + 1;
		writeRandom();

		function writeRandom() {
			let data = whatIsTheSymbol(text.charAt(startLetter));
			let randomLetter = pass_gen(1, data);
			if (text.charAt(startLetter) == text.charAt(startLetter).toLowerCase()) {
				randomLetter = randomLetter.toLowerCase();
			}
			randCount--;

			if (randCount != 0) {
				setTimeout(function () {
					el.textContent = okText + randomLetter.charAt(0);

					if (okText.length == text.length) {
						el.textContent = okText;

						if (sound) {
							keyboardAudio.pause();
							keyboardAudio.currentTime = 0;
						}

						if (endFunc) {
							endFunc();
						}
						return;
					}
					writeRandom();
				}, delay);
			} else {
				if (okText.length != 0) {
					el.textContent = okText + randomLetter.charAt(0);
				}
				writeText();
				return;
			}
		}
	}
}

function whatIsTheSymbol(symbol) {
	if (/[a-zA-Z]/.test(symbol)) {
		return "lettersEng";
	} else if (/[а-яА-Я]/.test(symbol)) {
		return "lettersRus";
	} else if (/[0-9]/.test(symbol)) {
		return "numbers";
	} else {
		return "otherSymbols";
	}
}

function pass_gen(len, data) {
	let lettersRus = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
	let lettersEng = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let numbers = "0123456789";
	let otherSymbols = "!@#$%^&*()_+=-№;?.,/><|}{";

	let text;
	if (data == "lettersRus") {
		text = lettersRus;
	} else if (data == "lettersEng") {
		text = lettersEng;
	} else if (data == "numbers") {
		text = numbers;
	} else {
		text = otherSymbols;
	}

	let pos;
	let str = "";
	for (let i = 0; i < len; i++) {
		pos = Math.floor(Math.random() * text.length);
		str += text.substring(pos, pos + 1);
	}

	return str;
}

function progressiveShuffleAnimated(el, randomCount, delay) {
	let word = el.textContent;
	let wordArray = [];
	for (let i = 0; i < word.length; i++) {
		wordArray.push(word.charAt(i));
	}

	let beginningOfAWord = "";
	let endOfWord = wordArray.slice();
	let numberLetter = -1;
	progressiveShuffleWord();

	function progressiveShuffleWord() {
		if (numberLetter != -1) {
			beginningOfAWord = beginningOfAWord + wordArray[numberLetter];
			endOfWord.shift();
		}

		numberLetter++;

		let count = randomCount + 1;
		delay = delay * 1.1;
		shuffleWordWrite();

		function shuffleWordWrite() {
			el.textContent = getShuffleWord(beginningOfAWord, endOfWord);
			count--;

			if (count != 0) {
				setTimeout(function () {
					shuffleWordWrite();
				}, delay);
			} else {
				if (numberLetter == word.length - 1) {
					setTimeout(function () {
						shuffleBug(wordArray, el, word);
					}, 200);

					return;
				}
				progressiveShuffleWord();
				return;
			}
		}
	}
}

function getShuffleWord(word, array) {
	let shuffleArray = array.slice();
	for (let i = shuffleArray.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i

		// поменять элементы местами
		// мы используем для этого синтаксис "деструктурирующее присваивание"
		// то же самое можно записать как:
		// let t = array[i]; array[i] = array[j]; array[j] = t
		[shuffleArray[i], shuffleArray[j]] = [shuffleArray[j], shuffleArray[i]];
	}
	let newWord = "";
	for (let i = 0; i < shuffleArray.length; i++) {
		newWord = newWord + shuffleArray[i];
	}

	newWord = word + newWord;
	return newWord;
}

function shuffleBug(array, el, word) {
	let shuffleArray = array.slice();
	let j = Math.floor(Math.random() * array.length); // случайный индекс от 0 до i
	let g;

	let randomOK = false;
	while (randomOK == false) {
		g = Math.floor(Math.random() * array.length); // случайный индекс от 0 до i
		if (j != g) {
			randomOK = true;
		}
	}

	// поменять элементы местами
	// мы используем для этого синтаксис "деструктурирующее присваивание"
	// то же самое можно записать как:
	// let t = array[i]; array[i] = array[j]; array[j] = t
	[shuffleArray[g], shuffleArray[j]] = [shuffleArray[j], shuffleArray[g]];

	let newWord = "";
	for (let i = 0; i < shuffleArray.length; i++) {
		newWord = newWord + shuffleArray[i];
	}

	el.textContent = newWord;

	setTimeout(function () {
		el.textContent = word;
	}, 70);
}

function resetAnimation(el, className) {
	el.classList.remove(className);
	el.style.animation = "none";
	el.offsetHeight; /* trigger reflow */
	el.style.animation = null;
}
