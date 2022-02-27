const taxBox1 = document.querySelectorAll("[data-tax-box1]");
const taxBox2 = document.querySelectorAll("[data-tax-box2]");
const taxCode = document.querySelectorAll("[data-tax-code]");
const taxTotal = document.querySelector("[data-tax-total]");
const unusedFare = document.querySelector("[data-unused-fare]");
const surcharge = document.querySelector("[data-surcharge]");
const penalty = document.querySelector("[data-penalty]");
const nuc = document.querySelector("#nuc-calc");
const nucCheckBox = document.querySelector("#nuc");
const nucBlock = document.querySelector(".nuc-calc-block");
const totalAmount = document.querySelector("[data-total-receivable]");

let obj = {};
let taxObj = {};
let sumTaxes = 0;
let sumAllTaxes = 0;
let farePortion = 0;
let qSurcharge = 0;
let penalties = 0;
let nucValue = 0;
let totalBaseFare = 0;
let totBaseWithNuc = 0;
let grandTotal = 0;

taxBox1.forEach((box) => {
  box.addEventListener("input", taxBox1Fn);
  box.addEventListener("change", taxBox1Fn);
});

taxBox2.forEach((box) => {
  box.addEventListener("input", taxBox2Fn);
  box.addEventListener("change", taxBox2Fn);
});

taxCode.forEach((codeBox) => {
  codeBox.addEventListener("input", taxCodeFn);
  codeBox.addEventListener("change", taxCodeFn);
});

function taxBox1Fn(e) {
  let prev = e.target.previousElementSibling;
  let next = e.target.nextElementSibling.nextElementSibling;
  if (taxObj.hasOwnProperty(prev.value)) {
    codeInTaxBox = e.target.dataset.taxBox1;
    let taxCodeValue = prev.value;
    taxObj[taxCodeValue][codeInTaxBox] = parseFloat(e.target.value);
    calculateTax(prev.value);
    next.innerText = obj[prev.value].toFixed(2);
    sumAllNumbers();
  }
}

function taxBox2Fn(e) {
  let prev = e.target.previousElementSibling.previousElementSibling;
  let next = e.target.nextElementSibling;
  if (taxObj.hasOwnProperty(prev.value)) {
    codeInTaxBox = e.target.dataset.taxBox2;
    let taxCodeValue = prev.value;
    taxObj[taxCodeValue][codeInTaxBox] = parseFloat(e.target.value);
    calculateTax(prev.value);
    next.innerText = obj[prev.value].toFixed(2);
    sumAllNumbers();
  }
}

function taxCodeFn(e) {
  e.target.value = e.target.value.toLocaleUpperCase();
  if (e.target.value.length === 2 || e.target.value.length === 4) {
    e.target.nextElementSibling.disabled = false;
    e.target.nextElementSibling.nextElementSibling.disabled = false;
    taxObj[e.target.value] = {};
  } else {
    e.target.nextElementSibling.disabled = true;
    e.target.nextElementSibling.nextElementSibling.disabled = true;
  }
}

if (unusedFare !== null || unusedFare !== undefined) {
  unusedFare.addEventListener("input", (e) => {
    farePortion = e.target.value;
    totalBase();
    sumAllNumbers();
  });
}

if (surcharge !== null || surcharge !== undefined) {
  surcharge.addEventListener("input", (e) => {
    qSurcharge = e.target.value;
    totalBase();
    sumAllNumbers();
  });
}

if (nuc !== null || nuc !== undefined) {
  nuc.addEventListener("input", (e) => {
    nucValue = e.target.value;
    calculateNuc();
    sumAllNumbers();
  });
}

nucCheckBox.addEventListener("click", (e) => {
  if (e.target.checked) {
    nucBlock.style.display = "block";
  } else {
    nucBlock.style.display = "none";
    nuc.value = ""
    nucValue = 0
    sumAllNumbers()
  }
});

if (penalty !== null || penalty !== undefined) {
  penalty.addEventListener("input", (e) => {
    penalties = e.target.value;
    sumAllNumbers();
  });
}

function calculateTax(taxCodeToCalc) {
  let oldTaxValue = 0;
  let newTaxValue = 0;
  let taxCodeObject = Object.keys(taxObj[taxCodeToCalc]);
  if (taxCodeObject[0]) {
    if (taxCodeObject[0][2] == "o") {
      oldTaxValue = Object.values(taxObj[taxCodeToCalc])[0];
    } else {
      oldTaxValue = Object.values(taxObj[taxCodeToCalc])[1];
    }
  }
  if (taxCodeObject[1]) {
    if (taxCodeObject[1][2] == "n") {
      newTaxValue = Object.values(taxObj[taxCodeToCalc])[1];
    } else {
      newTaxValue = Object.values(taxObj[taxCodeToCalc])[0];
    }
  }
  if (oldTaxValue > newTaxValue) {
    sumTaxes = oldTaxValue - newTaxValue;
  } else if (oldTaxValue === Number(0)) {
    sumTaxes = newTaxValue * -1;
  } else {
    sumTaxes = 0;
  }
  obj[taxCodeToCalc] = sumTaxes;
  totalTax();
}

function totalTax() {
  let totalOfAllTaxes = 0;
  for (let total in obj) {
    if (obj !== undefined) {
      totalOfAllTaxes += parseFloat(obj[total]);
    }
  }
  taxTotal.innerText = totalOfAllTaxes.toFixed(2);
  sumAllTaxes = totalOfAllTaxes;
}

function totalBase() {
  totalBaseFare = parseFloat(farePortion) + parseFloat(qSurcharge);
  totalBaseFare = totalBaseFare.toFixed(2);
}

function calculateNuc() {
  totBaseWithNuc = parseFloat(totalBaseFare) * parseFloat(nucValue);
}

function sumAllNumbers() {
  if (nucValue) {
    grandTotal =
      parseFloat(totBaseWithNuc) +
      parseFloat(sumAllTaxes) -
      parseFloat(penalties);
  } else {
    grandTotal =
      parseFloat(totalBaseFare) +
      parseFloat(sumAllTaxes) -
      parseFloat(penalties);
  }
  totalAmount.innerText = grandTotal.toFixed(2);
}
//////////////////////////////////////////////////////////////////

const scratchpad = document.querySelector("[data-scratchpad]");
const scratchBtn = document.querySelector("[data-parse-btn]");

let pastedText = "";
let foundTaxes = "";
let splitted = [];
let clndUp = [];
let tot = 0;
let regex;
let testArr = [];
let newObj = {};

scratchpad.addEventListener("input", (e) => {
  if (e.target.value.includes("CAD")) {
    regex = /TX...CAD/g;
  } else if (e.target.value.includes("USD")) {
    regex = /TX...USD/g;
  }
});

if (scratchBtn !== null && scratchBtn !== undefined) {
  scratchBtn.addEventListener("click", (e) => {
    pastedText = e.target.previousElementSibling.value;
    splitted = pastedText.split(regex);
    for (let index of splitted) {
      if (index) {
        clndUp.push(index.replace(/\s/g, ""));
      }
    }
    for (let i = 0; i < clndUp.length; i++) {
      clndUp[i] = clndUp[i] + taxBox1[i].dataset.taxBox1.slice(0, 2);
    }
    for (let index = 0; index < clndUp.length; index++) {
      let clndKeys = clndUp[index];
      if (!isNaN(parseFloat(clndKeys))) {
        if (newObj[clndKeys.slice(clndKeys.length - 4)]) {
          newObj[clndKeys.slice(clndKeys.length - 4)] += parseFloat(clndKeys);
          alert(
            `Taxes with same tax code were combined. Combined tax: ${clndKeys.slice(
              clndKeys.length - 2
            )}`
          );
        } else {
          newObj[clndKeys.slice(clndKeys.length - 4)] = parseFloat(clndKeys);
          testArr.push({
            [clndKeys.slice(clndKeys.length - 4)]: parseFloat(clndKeys),
          });
        }
      }
    }
    for (let i = 0; i < testArr.length; i++) {
      let prev = taxBox1[i].previousElementSibling;
      let next = taxBox1[i].nextElementSibling.nextElementSibling;
      codeInTaxBox1 = taxBox1[i].dataset.taxBox1;
      taxCode[i].value = Object.keys(testArr[i]);
      taxCode[i].nextElementSibling.disabled = false;
      taxCode[i].nextElementSibling.nextElementSibling.disabled = false;
      taxObj[taxCode[i].value] = {};
      taxBox1[i].value = Object.values(testArr[i]);
      taxObj[prev.value][codeInTaxBox1] = parseFloat(taxBox1[i].value);
      taxBox2[i].value = 0;
      calculateTax(prev.value);
      next.innerText = obj[prev.value];
    }
    for (let num in newObj) {
      if (newObj) {
        tot += newObj[num];
      }
    }
    sumAllNumbers();
  });
}
