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
let farePortion = 0;
let qSurcharge = 0;
let penalties = 0;
let nucValue = 0

nucCheckBox.addEventListener("click", (e) => {
    e.target.checked ? nucBlock.style.display = "block" : nucBlock.style.display = "none"
})

taxBox1.forEach((box) => {
  box.addEventListener("change", (e) => {
    data[0] = e.target.value;
  });
});

taxBox2.forEach((box) => {
  box.addEventListener("change", (e) => {
    data[1] = e.target.value;
  });
});

taxCode.forEach((code) => {
  code.addEventListener("change", () => {
    code.value = code.value.toLocaleUpperCase("en-US");
    calculate(code.value);
    code.nextElementSibling.innerText = obj[code.value];
  });
});

unusedFare.addEventListener("change", (e) => {
  farePortion = e.target.value;
  console.log(farePortion);
});

surcharge.addEventListener("change", (e) => {
  qSurcharge = e.target.value;
  console.log(qSurcharge);
});

nuc.addEventListener('change', (e) => {
    nucValue = e.target.value
    console.log(nucValue)
})

penalty.addEventListener("change", (e) => {
    penalties = e.target.value;
    console.log(penalties);
  });

function calculate(taxCode) {
  let num = 0;
  if (data[0] && data[1]) {
    if (parseFloat(data[1]) > parseFloat(data[0])) {
      num = parseFloat(data[1]) - parseFloat(data[0]);
      num = num.toFixed(2);
    } else {
      num = 0;
    }
  }
  obj[taxCode] = num;
  totalTax();
}

function totalTax() {
  let sum = 0;
  for (let total in obj) {
    if (obj !== undefined) {
      sum += parseFloat(obj[total]);
    }
  }
  sum = sum.toFixed(2);
  taxTotal.innerText = sum;
}
