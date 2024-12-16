// Confetti explosion effect
const defaults = {
  disableForReducedMotion: true
};

function createConfettiCanvas() {
  let canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '250';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
  }
  return canvas;
}

function fire(particleRatio, opts) {
  const confettiCanvas = createConfettiCanvas();
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(200 * particleRatio),
      useWorker: true,
      resize: true,
      zIndex: 1000,
    })
  );
}

function confettiExplosion(origin) {
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    origin,
  });
  fire(0.2, {
    spread: 60,
    origin,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    origin,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    origin,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    origin,
  });
}

class WheelOfFortune {
  constructor() {
    this.items = [
      "40", "1", "2", "1", "5", "2", "1", "10", "1", "5", "1", "10", "1", "20", "1", "2", "1", "5", "2", "1", "10", "1", "2", "5", "1", "2", "1", "40", "2", "5", "2", "1", "2", "1", "10", "1", "5", "1", "2", "1", "20", "1", "2", "1", "5", "2", "1", "10", "1", "2", "5", "1", "2", "1"
    ];
    this.items = this.items.reverse();
    this.deg = 0;
    this.wheelDeg = 0;
    this.spin = false;
    this.spinCount = 0;
    this.spinTimeOut = null;
    this.bank = 0;
    this.chips = [25, 50, 75, 100, 200, 500, 1000];
    this.selectedChips = null;
    this.total25 = 0;
    this.total50 = 0;
    this.total75 = 0;
    this.total100 = 0;
    this.total200 = 0;
    this.total500 = 0;
    this.total1000 = 0;
    this.bet = 0;
    this.betOn = {
      1: 0,
      2: 0,
      5: 0,
      10: 0,
      20: 0,
      40: 0,
    };

    this.spinButton = document.getElementById("btn_spin");
    this.resetButton = document.getElementById("btn_resetbet");

    this.wheel = document.getElementById("wheel");
    this.result = document.getElementById("result");
    this.resultIndex = null;

    this.betsOnImages = document.querySelectorAll(".betNumbers img");
    this.chipsImages = document.querySelectorAll(".chips img");

    this.spinButton.addEventListener("click", () => {
      this.play();
    });
    this.resetButton.addEventListener("click", () => {
      this.bank += this.bet;
      this.resetBet();
    });
    this.wheel.addEventListener("transitionend", () => {
      this.endPlay();
    });

    this.chipsImages.forEach((img) => {
      img.addEventListener("click", () => {
        this.selectedChips = img.getAttribute("alt").split("-")[1];
        this.chipsImages.forEach((img) => {
          img.style.border = "none";
        });
        img.style.border = "2px solid #d3ad1b";
        img.style.borderRadius = "50%";
        img.style.transform = "scale(1.2)";
      });
    });

    this.betsOnImages.forEach((img) => {
      img.addEventListener("click", () => {
        this.placeBetOn(img.getAttribute("alt").split("-")[1]);
      });
    });
  }

  updateBank(amount) {
    console.log("amount", { amount });
    this.bank = amount;
    document.getElementById("bank").innerText = this.bank;
    console.log("update");
    this.saveBankToBackend(this.bank);
  }

  saveBankToBackend(bankValue) {
    if (bankValue != lastAmount) {
      console.log("bankValue = ", bankValue);

      $.ajax({
        url: '/spin/',
        type: 'POST',
        headers: { 'X-CSRFToken': CSRF_TOKEN },
        data: {
          'amount': bankValue
        },
        success: function (response) {
          if (response.success) {
            console.log('Bank value saved successfully!');
          } else {
            console.log('Failed to save bank value.');
          }
        },
        error: function (xhr, status, error) {
          console.log('Failed to save bank value:', error);
        }
      });
    }
  }

  init({ startBalance = 10 }) {
    console.log("init");
    if (startBalance < 0) {
      alert("Please enter the positive value for the balance");
      return;
    }
    this.updateBetOnInUI();
    this.updateBank(startBalance);
  }

  play() {
    if (this.spin) return;
    if (this.bet === 0) {
      alert("Please place your bet");
      return;
    }
    this.spin = true;
    this.runWheel();
  }

  runWheel() {
    this.result.innerText = "";
    this.spinCount++;
    this.createRandomResult();
    this.animateWheel();
  }

  createRandomResult() {
    let ignoreResultes = this.getCommonDegBetweenTwoNumbers();
    console.log({ ignoreResultes });
    let random = this.generateRandomNumber();
    while (ignoreResultes.includes(random)) {
      random = this.generateRandomNumber();
    }
    this.deg = random;
  }

  generateRandomNumber() {
    return Math.floor(Math.random() * 360);
  }

  animateWheel() {
    console.log(this.spinCount, this.deg, this.wheelDeg);
    let deg = 360 * (3 * this.spinCount) + this.deg;

    this.wheel.style.transition = `all 5s ease-out`;
    this.wheel.style.transform = `rotate(${deg}deg`;
  }

  getCommonDegBetweenTwoNumbers() {
    let commonDeg = [];
    for (let i = 0; i < this.items.length; i++) {
      let itemStartDeg = i * (360 / this.items.length);
      commonDeg.push(Math.floor(itemStartDeg));
    }
    commonDeg.push(360);
    return commonDeg;
  }

  endPlay() {
    this.spin = false;
    this.wheel.style.transition = "none";

    let ignoreResultes = this.getCommonDegBetweenTwoNumbers();
    let degRangeStart = ignoreResultes.reduce((prev, curr) => {
      return curr < this.deg && curr > prev ? curr : prev;
    });

    let index = ignoreResultes.indexOf(degRangeStart);
    let degRangeEnd = ignoreResultes[index + 1];
    if (degRangeEnd === undefined) {
      degRangeEnd = ignoreResultes[0];
    }
    let indexOfDegRangeStart = ignoreResultes.indexOf(degRangeStart);
    this.resultIndex = indexOfDegRangeStart;
    console.log({ indexOfDegRangeStart });
    this.result.innerText = this.items[indexOfDegRangeStart];

    this.calculateWinningAndUpdateBank();

    this.resetBet();
  }

  calculateWinningAndUpdateBank() {
    let winningAmount = this.calculateWinningAmount();
    console.log({ bank: this.bank, bet: this.bet, winningAmount });
    console.log("win");
    this.saveBankToBackend(this.bank);

    if (winningAmount > 0) {
      let newBankamount = this.bank + winningAmount;
      console.log({ winningAmount, newBankamount });
      Swal.fire({
        title: "Congratulations",
        text: `You won ${winningAmount} chips`,
        icon: "success",
        confirmButtonText: "Ok",
        didOpen: () => {
          const origin = { x: 0.5, y: 0.5 };
          for (let i = 0; i < 3; i++) {
            setTimeout(() => {
              confettiExplosion(origin);
            }, i * 1000);
          }
        }
      });
      this.updateBank(newBankamount);
    } else {
      Swal.fire({
        title: "Sorry",
        text: `You lost ${this.bet} chips`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  }

  resetBet() {
    this.bet = 0;
    document.getElementById("bet").innerText = this.bet;
    this.resetBetOn();
  }

  calculateWinningAmount() {
    let winningAmount = 0;
    let winningNumber = this.items[this.resultIndex];
    if (this.betOn[winningNumber] > 0) {
      winningAmount = (this.betOn[winningNumber] * winningNumber) + this.betOn[winningNumber];
    }
    return winningAmount;
  }

  resetBet() {
    this.bet = 0;
    document.getElementById("bet").innerText = this.bet;
    document.getElementById("bank").innerText = this.bank;
    this.resetBetOn();
  }

  resetBetOn() {
    this.betOn = {
      1: 0,
      2: 0,
      5: 0,
      10: 0,
      20: 0,
      40: 0,
    };
    this.betsOnImages.forEach((img) => {
      img.style.border = "none";
    });
    this.updateBetOnInUI();
  }

  updateBetOnInUI() {
    document.getElementById("bet1").innerText = this.betOn[1];
    document.getElementById("bet2").innerText = this.betOn[2];
    document.getElementById("bet5").innerText = this.betOn[5];
    document.getElementById("bet10").innerText = this.betOn[10];
    document.getElementById("bet20").innerText = this.betOn[20];
    document.getElementById("bet40").innerText = this.betOn[40];
  }

  placeBetOn(cardNumber) {
    if (this.selectedChips === null) {
      alert("Please select the chips to place the bet");
      return;
    }
    if (this.bank < this.selectedChips) {
      alert("You don't have enough chips to place this bet.");
      return;
    }
    this.betOn[cardNumber] += parseInt(this.selectedChips);
    this.bet += parseInt(this.selectedChips);
    this.bank -= parseInt(this.selectedChips);
    this.updateBetOnInUI();
    document.getElementById("bet").innerText = this.bet;
    document.getElementById("bank").innerText = this.bank;
  }
}

// Initialize game
let game = new WheelOfFortune();
window.onload = function () {
  game.init({ startBalance: lastAmount });
  if (lastAmount === 0) {
    window.location.href = "/wheelfortune/payment/";
  }
};
