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
const totalBaseOutput = document.querySelector("[data-fare-total]");
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
  let boxValue = e.target.value;
  if (boxValue === "") {
    boxValue = 0;
  }
  if (taxObj.hasOwnProperty(prev.value)) {
    codeInTaxBox = e.target.dataset.taxBox2;
    let taxCodeValue = prev.value;
    taxObj[taxCodeValue][codeInTaxBox] = parseFloat(boxValue);
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
    if (farePortion === "") {
      farePortion = 0;
    }
    totalBase();
    sumAllNumbers();
  });
}

if (surcharge !== null || surcharge !== undefined) {
  surcharge.addEventListener("input", (e) => {
    qSurcharge = e.target.value;
    if (qSurcharge === "") {
      qSurcharge = 0;
    }
    totalBase();
    sumAllNumbers();
  });
}

if (nuc !== null || nuc !== undefined) {
  nuc.addEventListener("input", (e) => {
    nucValue = e.target.value;
    // calculateNuc();
    sumAllNumbers();
  });
}

nucCheckBox.addEventListener("click", (e) => {
  if (e.target.checked) {
    nucBlock.style.display = "block";
    sumAllNumbers();
  } else {
    nucBlock.style.display = "none";
    nuc.value = "";
    nucValue = 0;
    sumAllNumbers();
  }
});

if (penalty !== null || penalty !== undefined) {
  penalty.addEventListener("input", (e) => {
    penalties = e.target.value;
    if (penalties === "") {
      penalties = 0;
    }
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
  taxTotal.innerText = `: ${totalOfAllTaxes.toFixed(2)}`;
  sumAllTaxes = totalOfAllTaxes;
}

function totalBase() {
  totalBaseFare = parseFloat(farePortion) + parseFloat(qSurcharge);
  totalBaseFare = totalBaseFare.toFixed(2);
}

function sumAllNumbers() {
  if (nucValue > 1) {
    grandTotal =
      parseFloat(totalBaseFare) * parseFloat(nucValue) +
      parseFloat(sumAllTaxes) -
      parseFloat(penalties);
    totalBaseOutput.innerText = `: ${(
      parseFloat(totalBaseFare) * parseFloat(nucValue) -
      parseFloat(penalties)
    ).toFixed(2)}`;
  } else {
    grandTotal =
      parseFloat(totalBaseFare) +
      parseFloat(sumAllTaxes) -
      parseFloat(penalties);
    totalBaseOutput.innerText = `: ${(
      parseFloat(totalBaseFare) - parseFloat(penalties)
    ).toFixed(2)}`;
  }
  totalAmount.innerText = `: ${grandTotal.toFixed(2)}`;
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

const scratchpad = document.querySelector("[data-scratchpad]");
const scratchBtn = document.querySelector("[data-parse-btn]");
const clearBtn = document.querySelector("[data-clear-btn]");

let pastedText = "";
let splitted = [];
let regex;
let trimmed = [];
let parsedTaxesArr = [];
let parsedTaxesObj = {};
let tot = 0;

scratchpad.addEventListener("input", (e) => {
  let textValue = e.target.value;
  switch (true) {
    case textValue.includes("TX") && textValue.includes("CAD"):
      regex = /TX...CAD/g;
      break;
    case textValue.includes("PD") && textValue.includes("CAD"):
      regex = /PD...CAD/g;
      break;
    case textValue.includes("TX") && textValue.includes("USD"):
      regex = /TX...USD/g;
      break;
    case textValue.includes("PD") && textValue.includes("USD"):
      regex = /PD...USD/g;
      break;
  }
});

scratchBtn.addEventListener("click", parseTaxes);
clearBtn.addEventListener("click", clearAll);

function parseTaxes(e) {
  pastedText = e.target.previousElementSibling.value;
  splitted = pastedText.split(regex);
  for (let index of splitted) {
    if (index) {
      trimmed.push(index.trim());
    }
  }
  for (let index = 0; index < trimmed.length; index++) {
    trimmed[index] =
      trimmed[index] + taxBox1[index].dataset.taxBox1.slice(0, 2);
    let clndKeys = trimmed[index];
    if (!isNaN(parseFloat(clndKeys))) {
      if (parsedTaxesObj[clndKeys.slice(clndKeys.length - 4)]) {
        parsedTaxesObj[clndKeys.slice(clndKeys.length - 4)] +=
          parseFloat(clndKeys);
        alert(
          `Taxes with same tax code were combined. Combined tax: ${clndKeys.slice(
            clndKeys.length - 2
          )}`
        );
      } else {
        parsedTaxesObj[clndKeys.slice(clndKeys.length - 4)] =
          parseFloat(clndKeys);
        parsedTaxesArr.push({
          [clndKeys.slice(clndKeys.length - 4)]: parseFloat(clndKeys),
        });
      }
    }
  }
  for (let i = 0; i < parsedTaxesArr.length; i++) {
    let prev = taxBox1[i].previousElementSibling;
    let next = taxBox1[i].nextElementSibling.nextElementSibling;
    let nextCode = taxCode[i].nextElementSibling;
    codeInTaxBox1 = taxBox1[i].dataset.taxBox1;
    taxCode[i].value = Object.keys(parsedTaxesArr[i]);
    nextCode.disabled = false;
    nextCode.nextElementSibling.disabled = false;
    taxObj[taxCode[i].value] = {};
    taxBox1[i].value = Object.values(parsedTaxesArr[i]);
    taxObj[prev.value][codeInTaxBox1] = parseFloat(taxBox1[i].value);
    taxBox2[i].value = 0;
    calculateTax(prev.value);
    next.innerText = obj[prev.value].toFixed(2);
  }
  for (let num in parsedTaxesObj) {
    if (parsedTaxesObj) {
      tot += parsedTaxesObj[num];
    }
  }
  sumAllNumbers();
}

function clearAll() {
  location.reload();
}
