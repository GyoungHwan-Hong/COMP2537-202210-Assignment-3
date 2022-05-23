const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express()

const https = require('https')

const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");


const mongoose = require('mongoose');
//const { ppid } = require('process');


//var session = require('express-session')

const cors = require("cors");

const { User } = require("./public/models/user");
const { auth } = require("./public/middleware/auth");

app.use(express.static('./public'));

const shoppingcartSchema = new mongoose.Schema({
  userid: String,
  pokeid: String,
  time: String,
  amount: Number,
  orderStatus: String,
})

const shoppingcartModel = mongoose.model("Shoppingcart", shoppingcartSchema);

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




app.get('/', function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
})


app.get('/login/', function (req, res, next) {
  if (req.cookies.x_auth) {
    res.redirect('/userprofile');
  } else {
    res.sendFile(__dirname + '/public/login.html');
  }
})


app.get('/shoping/', auth, function (req, res) {
  shoppingcartModel.find({ userid: req.user.ID }).sort({ time: -1 }).then(result => {
    res.render('shopping.ejs', { result: result })
  })
    .catch(err => console.error(err))
})



app.get('/userprofile/', auth, function (req, res) {

  //console.log("received a request for "+ req.params.city_name);
  User.find({ ID: req.user.ID }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.render("useprofile.ejs", {
      "id": data[0].ID,
      "email": data[0].email,
      "nickname": data[0].nickname,
      "phone": data[0].cellphone
    });
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
            res.redirect('/userprofile');
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


app.post('/additem', auth, function (req, res) {
  console.log(req.body);
  console.log(req.user);
  let today = new Date();
  let defOrderStatus = 'Not yet'
  shoppingcartModel.create({
    userid: req.user.ID,
    pokeid: req.body.PokeID,
    time: today,
    amount: 1,
    orderStatus: defOrderStatus
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    console.log("Insertion is successful");
  });
})


//U
app.get('/increaseItems/:id', function (req, res) {
  shoppingcartModel.updateOne({
    _id: req.params.id
  }, {
    $inc: { amount: 1 }
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.redirect('/shoping');
  });
})

app.get('/increaseItem/:id', function (req, res) {
  shoppingcartModel.updateOne({
    _id: req.params.id
  }, {
    $inc: { amount: 1 }
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.redirect('/shoping');
  });
})

app.get('/checkoutItem/:id', function (req, res) {
  shoppingcartModel.updateOne({
    _id: req.params.id
  }, {
    $set: { orderStatus: "Order is complete!" }
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.redirect('/shoping');
  });
})




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


const userTimelineSchema = new mongoose.Schema({
    userID: String,
    eventName: String,
    Time: String,
  })
  
const userTimelineModel = mongoose.model("usertime", userTimelineSchema);

app.get('/timeline/getAllEvents', function (req, res) {
  userTimelineModel.find({}, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send(data);
  });
})