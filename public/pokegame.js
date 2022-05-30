hasFlippedCard = false;

firstCard = undefined
secondCard = undefined

to_add = ''

function startGame() {
    let gridNumber = $("#numberofgrid").val();
    console.log(gridNumber);
    to_add = ``

    to_add += `<div id="game_grid">`

    let widthValue = 100/gridNumber;
    console.log(widthValue);

    for (let i = 0 ; i < gridNumber; i++) {
        console.log(i);
        for (let j = 0; j < gridNumber; j++) {
            to_add += `<div class="card" style="width:` + widthValue +`%">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
                class="front_face" alt="">
            <img src="https://picsum.photos/id/237/100/125" class="back_face" alt="">
        </div>`
        }
    }
    to_add += ` </div>`

    $("gamebody").html(to_add)

    $(document).ready(setup)
}




function x() {
    $(this).toggleClass("flip")
}

function setup() {
    $(".card").on("click", function () {
        $(this).toggleClass("flip")

        if(!hasFlippedCard) {
            // this is the first card
            firstCard = $(this).find('.front_face')[0]
            hasFlippedCard = true;
        } else {
            // 2nc card

            secondCard = $(this).find('.front_face')[0]

            console.log(firstCard, secondCard);
            hasFlippedCard = false;




            if ( firstCard.src == secondCard.src ) {
                console.log("Match");
            } else {
                console.log("Not a match");
            }

        }
    })
}


$(document).ready(setup)
