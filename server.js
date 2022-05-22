const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express()
const https = require('https')
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const { ppid } = require('process');


var session = require('express-session')


app.set('view engine', 'ejs');


app.listen(process.env.PORT || 5000, function (err) {
  if (err) console.log(err);
})


app.use(session({ secret: 'ssshhh', saveUninitialized: true, resave: true }))


function logger1 (){
  console.log('logger1 function get executed!"')
}

app.use(bodyparser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}))


// app.get('/', function (req, res) {
//   if (req.session.authenticated)
//     res.send(`Hi $(req.session.user} !`)
//   else {
//     res.redirect('/login')
//   }
// })


app.get('/login/', function (req, res, next) {
  res.send("Please provide the credentials throught the URL")
})


mongoose.connect("mongodb://localhost:27017/timelineDB",
  { useNewUrlParser: true, useUnifiedTopology: true });
const eventSchema = new mongoose.Schema({
  text: String,
  hits: Number,
  time: String
});

const eventModel = mongoose.model("timelineevents", eventSchema);

//CRUD
//R
app.get('/timeline/getAllEvents', function (req, res) {
  //console.log("received a request for "+ req.params.city_name);
  eventModel.find({}, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send(data);
  });
})


//C
app.put('/timeline/insert', function (req, res) {
  console.log(req.body);
  eventModel.create({
    text: req.body.text,
    time: req.body.time,
    hits: req.body.hits
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send("Insertion is successful");
  });
})

//U
app.get('/timeline/increaseHits/:id', function (req, res) {
  console.log(req.params);
  eventModel.updateOne({
    _id: req.params.id
  }, {
    $inc: { hits: 1 }
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send("Update is good!");
  });
})


//D
app.get('/timeline/remove/:id', function (req, res) {
  //console.log(req.params);
  eventModel.remove({
    _id: req.params.id
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send("Removing is good!");
  });
})


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");

})

// app.get('/contact', function (req, res) {
//     res.send('Hi there, here is my <a href="mailto:ghong10@bcit.ca"> email </a>.')
// })

app.use(express.static('./public'));

app.get('/profile/:id', function (req, res) {
  // res.send(`<h1> Hi there. This pokemon has the id : ${req.params.id} </h1>`)


  const url = `https://serene-lowlands-99039.herokuapp.com/${req.params.id}`

  data = ""

  https.get(url, function (https_res) {
    https_res.on("data", function (chunk) {
      data += chunk
    })
    https_res.on("end", function () {
      data = JSON.parse(data)
      console.log("name: " + data.name)

      tmp = data.stats.filter((obj_) => {
        return obj_.stat.name == "hp"
      }).map((obj2) => {
        return obj2.base_stat
      })

      res.render("profile.ejs", {
        "id": req.params.id,
        "name": data.name,
        "hp": tmp[0]


      });

      //console.log(JSON.parse(data))
    })
  });

})