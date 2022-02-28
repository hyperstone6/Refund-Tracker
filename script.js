const newInstance = document.querySelectorAll("[data-add-new]")

newInstance.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.target.style.display = "none";
        e.target.parentElement.style.display = "block"
        e.target.nextElementSibling.style.display = "block"
        e.target.parentElement.style.flexBasis = "50%"
        e.target.parentElement.parentElement.parentElement.style.width = "85vw"

    })
  })