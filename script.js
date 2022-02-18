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
let sumTaxes = 0;
let sumAllTaxes = 0
let farePortion = 0;
let qSurcharge = 0;
let penalties = 0;
let nucValue = 0;
let totalBaseFare = 0;
let totBaseWithNuc = 0;
let grandTotal = 0;

let taxObj = {};

taxBox1.forEach((box) => {
  box.addEventListener("input", (e) => {
    let prev = e.target.previousElementSibling
    let next = e.target.nextElementSibling.nextElementSibling
    if (taxObj.hasOwnProperty(prev.value)) {
      codeInTaxBox = box.dataset.taxBox1
      let taxCodeValue = prev.value
      taxObj[taxCodeValue][codeInTaxBox] = parseFloat(e.target.value);
      calculateTax(prev.value)
      next.innerText = obj[prev.value].toFixed(2)
      sumAllNumbers()
    }
  });
});

taxBox2.forEach((box) => {
  box.addEventListener("input", (e) => {
    let prev = e.target.previousElementSibling.previousElementSibling
    let next = e.target.nextElementSibling
    if (taxObj.hasOwnProperty(prev.value)) {
    codeInTaxBox = box.dataset.taxBox2
    let taxCodeValue = prev.value
    taxObj[taxCodeValue][codeInTaxBox] = parseFloat(e.target.value);
    calculateTax(prev.value)
    next.innerText = obj[prev.value].toFixed(2)
    sumAllNumbers()
  }
  });
});

taxCode.forEach((codeBox) => {
  codeBox.addEventListener("input", (e) => {
    e.target.value = e.target.value.toLocaleUpperCase()
    if (e.target.value.length == 4) {
      e.target.nextElementSibling.disabled = false
      e.target.nextElementSibling.nextElementSibling.disabled = false
      taxObj[e.target.value] = {};
    } else {
      e.target.nextElementSibling.disabled = true
      e.target.nextElementSibling.nextElementSibling.disabled = true
    }
  });
});

unusedFare.addEventListener("input", (e) => {
  farePortion = e.target.value;
  totalBase();
  sumAllNumbers();
});

surcharge.addEventListener("input", (e) => {
  qSurcharge = e.target.value;
  totalBase();
  sumAllNumbers();
});

nuc.addEventListener("input", (e) => {
  nucValue = e.target.value;
  calculateNuc();
  sumAllNumbers();
});

nucCheckBox.addEventListener("click", (e) => {
  e.target.checked
    ? (nucBlock.style.display = "block")
    : (nucBlock.style.display = "none");
});

penalty.addEventListener("input", (e) => {
  penalties = e.target.value;
  sumAllNumbers();
});

function calculateTax(taxCodeToCalc) {
  let oldTaxValue = 0
  let newTaxValue = 0
  let taxCodeObject = Object.keys(taxObj[taxCodeToCalc])
  if(taxCodeObject[0]) {
    if(taxCodeObject[0][2] == 'o') {
      oldTaxValue = Object.values(taxObj[taxCodeToCalc])[0]
    } else {
      oldTaxValue = Object.values(taxObj[taxCodeToCalc])[1]
    }
  }
  if(taxCodeObject[1]) {
    if(taxCodeObject[1][2] == 'n') {
      newTaxValue = Object.values(taxObj[taxCodeToCalc])[1]
    } else {
      newTaxValue = Object.values(taxObj[taxCodeToCalc])[0]
    }
  }
  if(oldTaxValue > newTaxValue) {
    sumTaxes = oldTaxValue - newTaxValue
  } else  {
    sumTaxes = 0
  }
  obj[taxCodeToCalc] = sumTaxes
  totalTax()
}

function totalTax() {
  let totalOfAllTaxes = 0
  for (let total in obj) {
    if (obj !== undefined) {
      totalOfAllTaxes += parseFloat(obj[total]);
    }
  }
  taxTotal.innerText = totalOfAllTaxes.toFixed(2);
  sumAllTaxes = totalOfAllTaxes
}

function totalBase() {
  totalBaseFare = parseFloat(farePortion) + parseFloat(qSurcharge);
  totalBaseFare = totalBaseFare.toFixed(2);
}

function calculateNuc() {
  totBaseWithNuc = parseFloat(totalBaseFare) * parseFloat(nucValue);
  console.log(totBaseWithNuc);
}

function sumAllNumbers() {
  if (nucValue) {
    grandTotal =
      parseFloat(totBaseWithNuc) + parseFloat(sumAllTaxes) - parseFloat(penalties);
  } else {
    grandTotal =
      parseFloat(totalBaseFare) + parseFloat(sumAllTaxes) - parseFloat(penalties);
  }
  totalAmount.innerText = grandTotal.toFixed(2);
}
