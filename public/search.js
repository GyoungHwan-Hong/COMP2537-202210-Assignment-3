type_g = ""

to_add = ''

function processPokemonResp(data) {
    for (i=0; i < data.types.length; i++)      //for (x in data.types)
        if(data.types[i].type.name == type_g) {
            to_add += `<div class="img_box">
            <a href="/profile/${data.id}">${data.name}</a>
            <img src="${data.sprites.other["official-artwork"].front_default}">
            </div>`
        }
}


function display(type_){

    $("main").empty();

    type_g = type_

    for (i = 1 ; i < 10; i++) {
        $.ajax({
            type: "get",
            url: `https://serene-lowlands-99039.herokuapp.com/${i}`,
            success: processPokemonResp
        })
    }

    $("main").html(to_add)

}


function insertSearchEventToTheTimeLine(poke_type) {
    $.ajax({
        url: "http://localhost:5000/timeline/insert",
        type: "put",
        data: {
            text: `Client has searched for ${poke_type}`,
            time: "at time T",
            hits: 1
        },
        success: function(r) {
            console.log(r)
        }
    })
}

function setup() {

    display($("#poke_type option:selected").val())
    // display all the grass type pokemon
    $("#poke_type").change(() => {
        poke_type = $("#poke_type option:selected").val();
        //display($("#poke_type option:selected").val())

        insertSearchEventToTheTimeLine(poke_type)
    })
}

$(document).ready(setup)


function handleOnInput(e)  {
    e.value = e.value.replace(/[^A-Za-z]/ig, '')
  }