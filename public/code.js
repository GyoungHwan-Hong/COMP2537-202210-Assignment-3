
to_add = ''


function processPokeResp(data) {
    to_add += ` 
    <div class="img_box">
    <a href="/profile/${data.id}">${data.name}</a>
    <img src="${data.sprites.other["official-artwork"].front_default}">
    </div>`
}

async function loadNineImages() {

    to_add += ` <div id="body_outer_box">`

    for (i = 1; i <= 9; i++) { //Nine times loop
        if (i % 3 == 1) { //only when i = 1, 4, 7
            to_add += ` <div class = "images_group_box">`
        }

        // 1. generate random numbers
        // 2. init a AJAX request to pokeapi.co
        // 3. process the reponse extract the img

        x = Math.floor(Math.random() * 10) + 1

        await $.ajax({
            type: "GET", 
            url: `https://serene-lowlands-99039.herokuapp.com/${x}/`,
            success: processPokeResp
        })

        if (i % 3 == 0) { // only when i = 3, 6, 9
            to_add += ` </div>`
        }
        // to be done
    }
    to_add += ` </div>`

    $("main").html(to_add)
}


function setup() {
    loadNineImages();
    // events handlers

}

$(document).ready(setup)