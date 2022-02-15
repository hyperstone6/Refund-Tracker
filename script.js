const taxBox1 = document.querySelectorAll("[data-tax-box1]");
const taxBox2 = document.querySelectorAll("[data-tax-box2]");
const taxCode = document.querySelectorAll("[data-tax-code]");
const taxTotal = document.querySelector("[data-tax-total]");
const unusedFare = document.querySelector("[data-unused-fare]");
const surcharge = document.querySelector("[data-surcharge]");
const penalty = document.querySelector("[data-penalty]");
const nuc = document.querySelector("#nuc-calc")
const nucCheckBox = document.querySelector("#nuc")
const nucBlock = document.querySelector(".nuc-calc-block")
const totalAmount = document.querySelector("[data-total-receivable]")

let data = [];
let obj = {};
let sumTaxes = 0;
let farePortion = 0;
let qSurcharge = 0;
let penalties = 0;
let nucValue = 0
let totalBaseFare = 0
let totBaseWithNuc = 0
let grandTotal = 0

nucCheckBox.addEventListener("click", (e) => {
    e.target.checked ? nucBlock.style.display = "block" : nucBlock.style.display = "none"
})

taxBox1.forEach((box) => {
  box.addEventListener("input", (e) => {
    data[0] = e.target.value;
    calculate()
    console.log(sumTaxes)
  });
});

taxBox2.forEach((box) => {
  box.addEventListener("input", (e) => {
    data[1] = e.target.value;
    calculate()
    console.log(sumTaxes)
  });
});

taxCode.forEach((code) => {
  code.addEventListener("input", setTaxCalcDisplay);
});

function calculate() {
    if (data[0] && data[1]) {
        data[0] = parseFloat(data[0])
        data[1] = parseFloat(data[1])
      if (data[0] > data[1]) {
        sumTaxes = data[0] - data[1];
        sumTaxes = sumTaxes.toFixed(2);
      } else {
        sumTaxes = 0;
      }
    }
  }

function setTaxCalcDisplay(e) {
    obj[e.target.value] = sumTaxes;
    e.target.nextElementSibling.innerText = obj[e.target.value];
    if(e) {
        e.target.value = e.target.value.toLocaleUpperCase("en-US");
    }
}

unusedFare.addEventListener("change", (e) => {
  farePortion = e.target.value;
  totalBase()
  sumAllNumbers()
});

surcharge.addEventListener("change", (e) => {
  qSurcharge = e.target.value;
  totalBase()
  sumAllNumbers()
});

nuc.addEventListener('change', (e) => {
    nucValue = e.target.value
    calculateNuc()
    sumAllNumbers()
})

penalty.addEventListener("change", (e) => {
    penalties = e.target.value;
    sumAllNumbers()
  });

function totalTax() {
  sumTaxes = 0
  for (let total in obj) {
    if (obj !== undefined) {
      sumTaxes += parseFloat(obj[total]);
    }
  }
  taxTotal.innerText = sumTaxes;
}

function totalBase() {
    totalBaseFare = parseFloat(farePortion) + parseFloat(qSurcharge)
    totalBaseFare = totalBaseFare.toFixed(2)
}

function calculateNuc() {
    totBaseWithNuc = parseFloat(totalBaseFare) * parseFloat(nucValue)
    console.log(totBaseWithNuc)
}

// function addPenalty() {
//     if(totBaseWithNuc > 0) {
//         console.log(penalties + totBaseWithNuc)
//     } else {
//         console.log(penalties + totalBaseFare)
//     }
// }

function sumAllNumbers() {
    if(nucValue) {
      grandTotal = parseFloat(totBaseWithNuc) + parseFloat(sumTaxes) - parseFloat(penalties)
    } else {
      grandTotal = parseFloat(totalBaseFare) + parseFloat(sumTaxes) - parseFloat(penalties)
    }
    totalAmount.innerText = grandTotal
}