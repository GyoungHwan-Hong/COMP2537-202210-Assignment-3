const express = require('express');
const app = express()
const mongoose = require('mongoose');

const userTimelineSchema = new mongoose.Schema({
    userID: String,
    eventName: String,
    Time: String,
  })
  
const userTimelineModel = mongoose.model("usertime", userTimelineSchema);


function loadAddEvents() {
    $.ajax({
        url: "http://localhost:5000/increaseItems/:id",
        type: "get",
        success: (x) => {
            console.log("이건가" + x)
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