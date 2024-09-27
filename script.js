const container = document.getElementById("container");
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const light = "#b5ffb8";
const octave = 3;

let downKeys = [];

const boards = ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", ":", "]", "Enter", "4", "5", "6", "+"];
let edo = 7;
let gain = 0.075;

window.onload = () => {
  createPiano(edo);
}

window.oncontextmenu = () => {
  return false;
}

function changeGain(value) {
  gain = value;
}

function play(n, key, isClick, board) {
  downKeys[n] = true;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(110 * (2 ** (n / edo)), audioContext.currentTime);
  oscillator.connect(gainNode);

  gainNode.gain.value = gain;
  gainNode.connect(audioContext.destination);
  oscillator.start();

  key.style.backgroundColor = light;

  const trigger = isClick ? "pointerup" : "keyup";

  document.addEventListener(trigger, function(event) {
    if (!isClick && event.key != board) return;

    oscillator.stop(audioContext.currentTime);
    key.style.backgroundColor = "";

    const target = event.currentTarget;
    target.removeEventListener(trigger, arguments.callee, false);

    downKeys[n] = false;
  });
}

function createPiano(value) {
  if (value < 1) return;
  edo = value;

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  downKeys = [];

  for (let o = 0; o < octave; o ++) {
    for (let i = 0; i < edo; i ++) {
      const key = document.createElement("div");
      key.className = "key";
      key.textContent = i;

      key.addEventListener("pointerdown", event => {
        if (event.button == 0) {
          play(edo * o + i, key, true);

        } else {
          for (let j = 0; j < octave; j ++) {
            container.children[j * edo + i].classList.toggle("mark");
          }
        }
      });

      container.append(key);
      downKeys.push(false);
    }
  }
}

document.addEventListener("keydown", event => {
  if (event.repeat) return;

  const board = event.key;
  const index = boards.indexOf(board);

  if (index == -1 || downKeys[index]) return;
  play(index, container.children[index], false, board);
});
