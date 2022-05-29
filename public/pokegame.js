hasFlippedCard = false;

firstCard = undefined
secondCard = undefined


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
