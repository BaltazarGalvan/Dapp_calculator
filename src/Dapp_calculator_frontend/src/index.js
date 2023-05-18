import { Dapp_calculator_backend } from "../../declarations/Dapp_calculator_backend";
import { AuthClient } from "@dfinity/auth-client";

const result = document.querySelector("#result");

const btns = document.querySelector(".btns");

const motokoLogo = document.querySelector(".motoko");

const idValues = [
  "C",
  "-1",
  "%",
  "/",
  "7",
  "8",
  "9",
  "*",
  "4",
  "5",
  "6",
  "-",
  "1",
  "2",
  "3",
  "+",
  "0",
  ".",
  "=",
];

const buttonsIds = [
  "clear",
  "negativo",
  "porcentaje",
  "div",
  "seven",
  "eight",
  "nine",
  "multiply",
  "four",
  "five",
  "six",
  "minus",
  "one",
  "two",
  "three",
  "plus",
  "cero",
  "point",
  "iqual",
];

let callingBackend = false;

let lastAritmeticOperator = "";

let justMadeIqual = false;

let putToZero = false;

const setDisabled = function (disabled) {
  const childBtns = btns.children;
  callingBackend = disabled;
  for (const btn of childBtns) {
    if (disabled) {
      btn.setAttribute("disabled", true);
      btn.classList.add("callingBackend");
    }
    if (!disabled) {
      btn.removeAttribute("disabled");
      btn.classList.remove("callingBackend");
    }
  }
  if (disabled) {
    result.classList.add("callingBackend");
    motokoLogo.classList.add("motoko_loader");
  }
  if (!disabled) {
    result.classList.remove("callingBackend");
    motokoLogo.classList.remove("motoko_loader");
  }
};

const reset = async function () {
  setDisabled(true);

  callingBackend = false;
  lastAritmeticOperator = "";
  justMadeIqual = false;
  putToZero = false;

  result.textContent = await Dapp_calculator_backend.reset();
  setDisabled(false);
};

reset();

const add = async function (value) {
  setDisabled(true);
  result.textContent = await Dapp_calculator_backend.add(value);
  setDisabled(false);
  adjustResultSize();
};

const sub = async function (value) {
  setDisabled(true);
  result.textContent = await Dapp_calculator_backend.sub(value);
  setDisabled(false);
  adjustResultSize();
};

const mul = async function (value) {
  setDisabled(true);
  result.textContent = await Dapp_calculator_backend.mul(value);
  setDisabled(false);
  adjustResultSize();
};

const div = async function (value) {
  setDisabled(true);
  result.textContent = await Dapp_calculator_backend.div(value);
  setDisabled(false);
  adjustResultSize();
};

//Permite revisar que la tecla apretada sea una tecla valida
const valInt = function (key) {
  const evalNum = /[0-9.]/;
  const evalOperator = /[=*+%-/]/;
  const evalClear = /[Cc]/;

  if (key === "negativo") return "negativo";
  if (key.match(evalNum) !== null) return "N";
  if (key.match(evalOperator) !== null) return "O";
  if (key.match(evalClear) !== null) return "C";

  if (key === "Backspace") return "Backspace";

  return false;
};

//Ajusta el fontsize dependiendo de la longitud del numero
const adjustResultSize = function () {
  const longitud = result.textContent.length;
  let fontSize = "50px";
  if (longitud < 8) fontSize = "50px";
  if (longitud > 7 && longitud < 14) fontSize = "30px";
  if (longitud > 13 && longitud < 21) fontSize = "20px";
  if (longitud > 20 && longitud < 42) fontSize = "10px";
  if (longitud > 41) fontSize = "8px";
  result.style.fontSize = fontSize;
};

const changeLogStatus = function (isLoggued) {
  if (isLoggued) {
    document.querySelector(".login_status").textContent = "Wellcome Ic User";
    document.querySelector(".btn_login").textContent = "IC Logout";
  } else {
    document.querySelector(".login_status").textContent = "You´re Anonymous!";
    document.querySelector(".btn_login").textContent = "IC Login";
  }
};

document.body.onload = async function () {
  const authClient = await AuthClient.create();
  changeLogStatus(await authClient.isAuthenticated());
};

window.addEventListener("keydown", async (e) => {
  if (callingBackend) return;

  const key = e.key === "Enter" ? "=" : e.key;
  const validated = valInt(key);

  if (key === "." && result.textContent.indexOf(".") !== -1) return;

  if (!validated) return;

  if (key === "Backspace") {
    if (result.textContent === "0") return;
    result.textContent = result.textContent.slice(0, -1);

    if (result.textContent.length === 0) {
      result.textContent = "0";
    }
    adjustResultSize();
    return;
  }
  let index = idValues.findIndex((el) => el === key.toUpperCase());
  if (key === "Clear") index = 0;
  const btnClicked = document.querySelector(`#${buttonsIds[index]}`);

  btnClicked.classList.add("clicked");

  setTimeout(() => {
    btnClicked.classList.remove("clicked");
  }, 333);

  btnClicked.click();
});

btns.addEventListener("click", async (e) => {
  e.preventDefault();
  const pressedBtn = e.target;
  if (pressedBtn.id === "negativo") {
    if (result.textContent.indexOf("-") === -1) {
      result.textContent = "-" + result.textContent;
    } else {
      result.textContent = result.textContent.slice(
        1,
        result.textContent.length
      );
    }
    if (justMadeIqual) mul(-1);
    adjustResultSize();
    return;
  }

  if (
    pressedBtn.classList.contains("point") &&
    result.textContent.indexOf(".") !== -1
  )
    return;
  if (
    result.textContent === "0" &&
    pressedBtn.classList.contains("number") &&
    !pressedBtn.classList.contains("point")
  )
    result.textContent = "";
  if (pressedBtn.classList.contains("number")) {
    if (putToZero) {
      result.textContent = "";
      putToZero = false;
    }
    result.textContent = result.textContent + pressedBtn.value;
  }

  if (pressedBtn.value === "Clear") {
    reset();
  }

  if (pressedBtn.classList.contains("aritmetic_operator")) {
    const isZero = await Dapp_calculator_backend.see();
    if (isZero === 0) add(parseFloat(result.textContent));
    lastAritmeticOperator = pressedBtn.id;
    justMadeIqual = false;
    putToZero = true;
  }

  if (pressedBtn.classList.contains("iqual")) {
    if (lastAritmeticOperator === "plus") add(parseFloat(result.textContent));
    if (lastAritmeticOperator === "minus") sub(parseFloat(result.textContent));
    if (lastAritmeticOperator === "multiply")
      mul(parseFloat(result.textContent));
    if (lastAritmeticOperator === "div") div(parseFloat(result.textContent));
    lastAritmeticOperator = "";
    justMadeIqual = true;
    putToZero = true;
  }
  adjustResultSize();
});

document.querySelector(".btn_login").addEventListener("click", async (e) => {
  e.preventDefault();
  const authClient = await AuthClient.create();

  if (await authClient.isAuthenticated()) {
    await authClient.logout();
    changeLogStatus(false);
  } else {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: () => {
        changeLogStatus(true);
      },
    });
  }
});
