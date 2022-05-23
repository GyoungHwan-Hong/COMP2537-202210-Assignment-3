const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express()

const https = require('https')

const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");


const mongoose = require('mongoose');
const { ppid } = require('process');


var session = require('express-session')

const cors = require("cors");

const { User } = require("./public/models/User");
const { auth } = require("./public/middleware/auth");


app.set('view engine', 'ejs');

app.use(cookieParser());

app.use(
  cors({
      origin: true,
      credentials: true,
  })
);

app.use(bodyparser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}))


//Connect Database...
const dbAddress = "mongodb+srv://hongkh5218:recify5218@recifycluster.w6cp9.mongodb.net/recify?retryWrites=true&w=majority";

mongoose
  .connect(dbAddress, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


app.listen(process.env.PORT || 5000, function (err) {
  if (err) console.log(err);
})


//app.use(session({ secret: 'ssshhh', saveUninitialized: true, resave: true }))


function logger1() {
  console.log('logger1 function get executed!"')
}


app.use(express.static('./public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
})


app.get('/login/', function (req, res, next) {
  res.sendFile(__dirname + '/public/login.html');
})


app.get('/shoping/', function (req, res, next) {
  res.send("Something for shoping card.")
})

app.get('/userprofile/', function (req, res, next) {
  res.render("useprofile.ejs", {
    "id": "Get from DB ",
    "name": "Get from DB ",
    "hp": "Get from DB "
  });
})

app.post("/doJoin", (req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.sendFile(__dirname + '/public/signup.html');
    return res.redirect('/login.html')
  });
});

app.post("/doLogin", (req, res) => {
  User.findOne({ ID: req.body.ID }, (err, user) => {
    if (err || !user) {
      res.send("<script>alert('Invalid ID/Password.');location.href='/login';</script>");
      return res.sendFile(__dirname + '/public/signup.html'); //Need help...
    }
    user
      .comparePassword(req.body.password)
      .then((isMatch) => {
        if (!isMatch) {
          res.send("<script>alert('Invalid ID/Password.');location.href='/login';</script>"); //Need help...
          return res.sendFile(__dirname + '/public/signup.html'); 
        }
        user
          .generateToken()
          .then((user) => {
            res.cookie("x_auth", user.token);
            res.sendFile(__dirname + '/public/index.html');
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      })
      .catch((err) => res.json({ loginSuccess: false, err }));
  });
});

app.get("/api/user/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    nickname: req.user.nickname,
    cellphone: req.user.cellphone,
  });
});

app.post("/logout/", auth, (req, res) => {

  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    res.clearCookie("x_auth");
    return res.sendFile(__dirname + '/public/login.html');
  });
});


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


app.get('/profile/:id', function (req, res) {
  // res.send(`<h1> Hi there. This pokemon has the id : ${req.params.id} </h1>`)

  const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`

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

    })
  });

})


