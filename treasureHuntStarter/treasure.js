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
