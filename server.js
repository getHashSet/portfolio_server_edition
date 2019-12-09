require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const hash = require("hash.js");
const Identicon = require("identicon.js");

const db = require("./models");

// Express / localhost and Heroku port
var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(logger("dev"));

// Connect to local Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// Load index page
app.get("/", function(req, res) {
  db.Example.findAll({}).then(function(portfolio_db) {
    res.render("index", {
      msg: "Welcome!",
      examples: portfolio_db
    });
  });
});

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

////////////
// Github
////////////

// Scrape GitHub
// set POST request so that we can recive an obj with keys.
// use those keys to search the internet for more data.
app.post("/scrape/git", function (req, res) {
  // view object returned on the server. //
  // console.log(req.body.git);

  axios.get(req.body.git)
    .then(function (responseFromGit) {
      //console.log(responseFromGit.data);
      let $ = cheerio.load(responseFromGit.data);

      let gitData = [{ key: "value" }];

      let arrayOfPinnedObj = [];
      let arrayOfHashObj = [];
      let arrayOfImages = [];

      $('.js-yearly-contributions').each(function (i, element) {
        //console.log($(element).children().children("h2").text());
        gitData[0].totalContributionsThisYear = Number($(element).children().children("h2").text().slice(7, $(element).children().children("h2").text().indexOf(" con")));
        gitData[0].html = $(element).html();

        // console.log($(element).html());
      });

      $('.pinned-item-list-item-content').each(function (j, elements) {
        let theArrayOfChildren = elements.children;


        //console.log(theArrayOfChildren);
        theArrayOfChildren.forEach(item => {

          // identify where the <a> tags are. The hrefs have all the data we need from the scrape.
          let itemATag = $(item).children("a");

          if (itemATag != undefined && itemATag != "") {
            //console.log("this thing here: " + $(item).children("a"));

            ////////////
            // scrape came back with data
            ////////////

            arrayOfPinnedObj.push($(item).children("a").children("span").attr("title"));

            ////////////
            // hash
            ////////////

            arrayOfHashObj.push(hash.sha256().update($(item).children("a").children("span").attr("title")).digest('hex'));

            ////////////
            // random colors
            ////////////

            randomColors = [
              [46, 204, 113, 255],
              [231, 76, 60, 255],
              [230, 126, 34, 255],
              [155, 89, 182, 255],
              [52, 152, 219, 255],
              [26, 188, 156, 255],
              [131, 52, 113, 255],
              [153, 128, 250, 255],
              [0, 98, 102, 255],
              [45, 52, 54, 255],
              [253, 203, 110, 255],
              [255, 118, 117, 255],
              [0, 206, 201, 255],
              [225, 112, 85, 255],
              [0, 184, 148, 255],
              [85, 239, 196, 255],
              [52, 172, 224, 255],
              [39, 174, 96, 255],
              [231, 76, 60, 255],
              [0, 100, 73, 255],
              [235, 237, 240, 255]
              [25, 97, 39, 255],
              [198, 228, 139, 255],
              [123, 201, 111, 255]
            ]

            ////////////
            // make img
            ////////////

            let options = {
              foreground: randomColors[Math.floor(Math.random()*randomColors.length)],
              background: [255, 255, 255, 255],
              size: 200,
              format: 'png'
            };
            let hashCode = hash.sha512().update($(item).children("a").children("span").attr("title")).digest('hex');

            let data = new Identicon(hashCode, options).toString();

            arrayOfImages.push('<img src="data:image/png;base64,' + data + '">');

          };
        });
        // put both the array of pinned objects (strings) and hashes into the obj. NOT PAIRED!
        gitData[0].pinnedObjects = arrayOfPinnedObj;
        gitData[0].hashKeys = arrayOfHashObj;
        gitData[0].gitImages = arrayOfImages;
      });

      //console.log(gitData);
      res.send(gitData);
    });


});

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "Listening on port %s. Visit http://localhost:%s/",
      PORT,
      PORT
    );
  });
});

module.exports = app;
