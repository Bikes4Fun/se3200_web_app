let btnList = document.querySelectorAll(".reveal-button");

function revealTreasure(selector) {
    let treasure = document.querySelector(selector);
    if (treasure) {
        treasure.classList.remove('hidden');
    }
}

btnList.forEach(function(btn, index) {
    btn.addEventListener("click", function() {
        let selector = "#treasure" + (index + 1);
        revealTreasure(selector);
    });
});


// Task 1: 
document.querySelector("#room1 li.hidden").style.color = "gold";

// Task 2: 
btnList.forEach(function(btn) {
    btn.addEventListener("mouseover", function() {
        btn.style.backgroundColor = "#D00000";
    });
    btn.addEventListener("mouseout", function() {
        btn.style.backgroundColor = "";
    });
});

// Task 3:
document.querySelectorAll("li.hidden").forEach(function(item) {
    item.style.fontStyle = "italic";
});

// Task 4:
document.querySelector("#room3 ol li:nth-child(2)").style.border = "2px solid red";

// Task 5: 
let masterBtn = document.createElement("button");
masterBtn.textContent = "Reveal All";
masterBtn.addEventListener("click", function() {
    document.querySelectorAll(".hidden").forEach(function(item) {
        item.classList.remove("hidden");
    });
    document.querySelector("#room2 img").classList.add("hidden");
});
document.body.appendChild(masterBtn);
