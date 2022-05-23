
function loadEvents() {
    $.ajax({
        url: "http://localhost:5000/timeline/getAllEvents",
        type: "get",
        success: (x) => {
            console.log(x)

            for (i = 0; i < x.length; i++) {
                $("main").append(
                    `
                <p>
                    Event Text - ${x[i].text}
                <br>
                    Event Time - ${x[i].time}
                <br>
                    Event Hits - ${x[i].hits} 

                    <br>
                    <button class="LikeButton" id="${x[i]["_id"]}"> Adds a hit count! </button>
                    <button class="RemoveCollection" id="${x[i]["_id"]}"> Remove! </button>
                </p>
                `
                )
            }
        }
    })
}

function increamentHitsByOne() {
    x = this.id
    $.ajax({
        url: `http://localhost:5000/timeline/increaseHits/${x}`,
        type: "get",
        success: (e)=> {console.log(e)}
    })
    $("main").empty();
    loadEvents()
}

function removeByButton() {
    x = this.id
    $.ajax({
        url: `http://localhost:5000/timeline/remove/${x}`,
        type: "get",
        success: (e)=> {console.log(e)}
    })
    $("main").empty();
    loadEvents()
}

function setup() {
    loadEvents()

    $("body").on('click', '.LikeButton', increamentHitsByOne)
    $("body").on('click', '.RemoveCollection', removeByButton)
}


$(document).ready(setup)