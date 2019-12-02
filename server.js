require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

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

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Scrape GitHub
// set POST request so that we can recive an obj with keys.
// use those keys to search the internet for more data.
app.post("/scrape/git", function(req, res) {
  // view object returned on the server. //
  // console.log(req.body.git);

  axios.get(req.body.git)
  .then(function(responseFromGit) {
    //console.log(responseFromGit.data);
    let $ = cheerio.load(responseFromGit.data);

    let gitData = [{key: "value"}];

    $('.js-yearly-contributions').each(function(i, element) {
      console.log($(element).children().children("h2").text());
      gitData[0].totalContributionsThisYear = Number($(element).children().children("h2").text().slice(7, $(element).children().children("h2").text().indexOf(" con")));
      gitData[0].html = $(element).html();
      // console.log($(element).html());
    });

    //console.log(gitData);
    res.send(gitData);
  });


});

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "Listening on port %s. Visit http://localhost:%s/",
      PORT,
      PORT
    );
  });
});

module.exports = app;
