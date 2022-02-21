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

let objAdt = {};
let objChd = {};
let objInf = {};
let taxObjAdt = {};
let taxObjChd = {};
let taxObjInf = {};
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
  box.addEventListener("input", (e) => {
    let prev = e.target.previousElementSibling;
    let next = e.target.nextElementSibling.nextElementSibling;
    let boxNumber = parseInt(e.target.dataset.taxBox1.slice(0, 2));
  
    if (boxNumber >= 01 && boxNumber <= 20) {
      if (taxObjAdt.hasOwnProperty(prev.value)) {
        codeInTaxBox = box.dataset.taxBox1;
        let taxCodeValue = prev.value;
        taxObjAdt[taxCodeValue][codeInTaxBox] = parseFloat(e.target.value);
        calculateTax(prev.value, boxNumber);
        next.innerText = objAdt[prev.value];
        sumAllNumbers();
      }
    } else if (boxNumber >= 21 && boxNumber <= 40) {
      if (taxObjChd.hasOwnProperty(prev.value)) {
        codeInTaxBox = box.dataset.taxBox1;
        let taxCodeValue = prev.value;
        taxObjChd[taxCodeValue][codeInTaxBox] = parseFloat(e.target.value);
        calculateTax(prev.value, boxNumber);
        next.innerText = objChd[prev.value];
        sumAllNumbers();
      }
    } else if (boxNumber >= 41 && boxNumber <= 60) {
      if (taxObjInf.hasOwnProperty(prev.value)) {
        codeInTaxBox = box.dataset.taxBox1;
        let taxCodeValue = prev.value;
        taxObjInf[taxCodeValue][codeInTaxBox] = parseFloat(e.target.value);
        calculateTax(prev.value, boxNumber);
        next.innerText = objInf[prev.value];
        sumAllNumbers();
      }
    }
  });
});

taxBox2.forEach((box) => {
  box.addEventListener("input", (e) => {
    let prev = e.target.previousElementSibling.previousElementSibling;
    let next = e.target.nextElementSibling;
    let boxNumber = e.target.dataset.taxBox2.slice(0, 2);
    
    if (boxNumber >= 01 && boxNumber <= 20) {
      if (taxObjAdt.hasOwnProperty(prev.value)) {
        codeInTaxBox = box.dataset.taxBox2;
        let taxCodeValue = prev.value;
        taxObjAdt[taxCodeValue][codeInTaxBox] = parseFloat(e.target.value);
        calculateTax(prev.value, boxNumber);
        next.innerText = objAdt[prev.value].toFixed(2);
        sumAllNumbers();
      }
    } else if (boxNumber >= 21 && boxNumber <= 40) {
      if (taxObjChd.hasOwnProperty(prev.value)) {
        codeInTaxBox = box.dataset.taxBox2;
        let taxCodeValue = prev.value;
        taxObjChd[taxCodeValue][codeInTaxBox] = parseFloat(e.target.value);
        calculateTax(prev.value, boxNumber);
        next.innerText = objChd[prev.value].toFixed(2);
        sumAllNumbers();
      }
    } else if (boxNumber >= 41 && boxNumber <= 60) {
      if (taxObjInf.hasOwnProperty(prev.value)) {
        codeInTaxBox = box.dataset.taxBox2;
        let taxCodeValue = prev.value;
        taxObjInf[taxCodeValue][codeInTaxBox] = parseFloat(e.target.value);
        calculateTax(prev.value, boxNumber);  
        next.innerText = objInf[prev.value].toFixed(2);
        sumAllNumbers();
      }
    }

  });
});

taxCode.forEach((codeBox) => {
  codeBox.addEventListener("input", (e) => {
    e.target.value = e.target.value.toLocaleUpperCase();
    if (e.target.value.length === 2 || e.target.value.length === 4) {
      e.target.nextElementSibling.disabled = false;
      e.target.nextElementSibling.nextElementSibling.disabled = false;
      const siblingValue = parseFloat(e.target.nextElementSibling.dataset.taxBox1.slice(0,2))
      if(siblingValue >= 1 && siblingValue <= 20) {
        taxObjAdt[e.target.value] = {};
        console.log(siblingValue, "Adt")
      } else if(siblingValue >= 21 && siblingValue <= 40) {
        taxObjChd[e.target.value] = {};
        console.log(siblingValue, "Chd")
      } else if(siblingValue >= 21 && siblingValue <= 40) {
        taxObjInf[e.target.value] = {};
      }
    } else {
      e.target.nextElementSibling.disabled = true;
      e.target.nextElementSibling.nextElementSibling.disabled = true;
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

function calculateTax(taxCodeToCalc, boxNumber) {
  let oldTaxValue = 0;
  let newTaxValue = 0;
  let taxCodeObject = "";

  if (boxNumber >= 01 && boxNumber <= 20) {
    taxCodeObject = Object.keys(taxObjAdt[taxCodeToCalc]);
    if (taxCodeObject[0]) {
      if (taxCodeObject[0][2] == "o") {
        oldTaxValue = Object.values(taxObjAdt[taxCodeToCalc])[0];
      } else {
        oldTaxValue = Object.values(taxObjAdt[taxCodeToCalc])[1];
      }
    }
    if (taxCodeObject[1]) {
      if (taxCodeObject[1][2] == "n") {
        newTaxValue = Object.values(taxObjAdt[taxCodeToCalc])[1];
      } else {
        newTaxValue = Object.values(taxObjAdt[taxCodeToCalc])[0];
      }
    }

  } else if (boxNumber >= 21 && boxNumber <= 40) {
    taxCodeObject = Object.keys(taxObjChd[taxCodeToCalc]);
    if (taxCodeObject[0]) {
      if (taxCodeObject[0][2] == "o") {
        oldTaxValue = Object.values(taxObChd[taxCodeToCalc])[0];
      } else {
        oldTaxValue = Object.values(taxObChd[taxCodeToCalc])[1];
      }
    }
    if (taxCodeObject[1]) {
      if (taxCodeObject[1][2] == "n") {
        newTaxValue = Object.values(taxObChd[taxCodeToCalc])[1];
      } else {
        newTaxValue = Object.values(taxObChd[taxCodeToCalc])[0];
      }
    }
  } else if (boxNumber >= 41 && boxNumber <= 60) {
    taxCodeObject = Object.keys(taxObjInf[taxCodeToCalc]);
    if (taxCodeObject[0]) {
      if (taxCodeObject[0][2] == "o") {
        oldTaxValue = Object.values(taxObInf[taxCodeToCalc])[0];
      } else {
        oldTaxValue = Object.values(taxObInf[taxCodeToCalc])[1];
      }
    }
    if (taxCodeObject[1]) {
      if (taxCodeObject[1][2] == "n") {
        newTaxValue = Object.values(taxObInf[taxCodeToCalc])[1];
      } else {
        newTaxValue = Object.values(taxObInf[taxCodeToCalc])[0];
      }
    }
  }
  if (oldTaxValue > newTaxValue) {
    sumTaxes = oldTaxValue - newTaxValue;
  } else {
    sumTaxes = 0;
  }
  totalTax();
}

function totalTax() {
  let totalOfAllTaxes = 0;
  for (let total in objAdt) {
    if (objAdt !== undefined) {
      totalOfAllTaxes += parseFloat(objAdt[total]);
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
  console.log(totBaseWithNuc);
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
