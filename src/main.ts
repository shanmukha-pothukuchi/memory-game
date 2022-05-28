import "./style.css";

const fruits: string[] = ["avacado", "water melon", "grapes", "kiwi"];
const order: string[] = [];
let round = 1;

class RandomNumberGenerator {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  public generate = (max: number = 1, min: number = 0): number => {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    var rnd = this.seed / 233280.0;

    return min + rnd * (max - min);
  };
}

const params = new URLSearchParams(window.location.search);

const rng = new RandomNumberGenerator(
  parseFloat(params.get("seed")!) || Math.random()
);

const addNewFruit = () => {
  for (let i = 0; i < round + 1; i++) {
    if (order.length < round + 1) {
      if (order[i] == undefined) {
        order.push(fruits[Math.floor(rng.generate(fruits.length + 1, 1)) - 1]);
      }
    }
  }
};

const showOrder = async () => {
  for (let i = 0; i < order.length; i++) {
    const el = document.querySelector(`[data-fruit="${order[i]}"]`)!;
    el.classList.add("pressed");
    await new Promise((r) => setTimeout(r, 400));
    el.classList.remove("pressed");
    await new Promise((r) => setTimeout(r, 300));
  }
};

let guess: number = 0;
let guesses: string[] = [];

function evalClick(fruit: string): boolean | null {
  if (guesses.length >= order.length) return false;
  if (order[guess] != fruit) return false;

  guesses.push(fruit);
  guess++;

  if (JSON.stringify(guesses) == JSON.stringify(order)) {
    guess = 0;
    guesses = [];
    return true;
  }

  return null;
}

const removeEventListeners = () => {
  document.querySelectorAll("[data-fruit]").forEach((el) => {
    const clonedEL = el.cloneNode(true);
    el.parentNode!.replaceChild(clonedEL, el);
  });
};

const startGame = () => {
  document.querySelectorAll("[data-fruit]").forEach((el) => {
    el.addEventListener("click", async () => {
      el.classList.add("pressed");
      await new Promise((r) => setTimeout(r, 300));
      el.classList.remove("pressed");
      await new Promise((r) => setTimeout(r, 50));
      switch (evalClick(el.getAttribute("data-fruit")!)) {
        case true:
          round++;
          document.getElementById("score")!.innerText = round.toString();
          addNewFruit();
          await new Promise((r) => setTimeout(r, 500));
          showOrder();
          break;
        case false:
          alert("You lose!");
          removeEventListeners();
      }
    });
  });
  addNewFruit();
  showOrder();
};

document.getElementById("start")!.addEventListener("click", (e) => {
  startGame();
  const startBtn = e.target as HTMLButtonElement;
  startBtn.remove();
});
