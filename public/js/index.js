// Get references to page elements
let $exampleText = $("#example-text");
let $exampleDescription = $("#example-description");
let $submitBtn = $("#submit");
let $exampleList = $("#example-list");


////////////////////////
// API routes
////////////////////////

// The API object contains methods for each kind of request we'll make
let API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
let refreshExamples = function() {
  API.getExamples().then(function(data) {
    let $examples = data.map(function(example) {
      let $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      let $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      let $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

$("#resume_image").attr("src", "../images/resume_blured.png");

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
let handleFormSubmit = function(event) {
  event.preventDefault();

  let example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
let handleDeleteBtnClick = function() {
  let idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

////////////////////////////////////
// buttons
////////////////////////////////////

$("#menu_button").click(function() {
  $("nav").css("transform", "translateY(-101%)");
  $("#info").css("display", "none");
  console.log("bye bye");
});

$("#login_button").click(function() {
  badPassword();
});

$("#password").keyup(function(event) {
  if(event.keyCode === 13) {
    badPassword();
  };
});

$("#login-button").keyup(function(event) {
  if(event.keyCode === 13) {
    badPassword();
  };
});

const badPassword = () => {
  $("#ion-icon_button").attr("name", "ios-thumbs-down");
  $("#login_button").addClass("bounce_small");
};

////////////
// quotes
////////////

const toast = $("#toast");
const toastData = $("#toast_data");

$(".quote").click(function() {
  let clickedSection = $(this).attr("section");

  $(toast).css("display", "flex");
  $(toastData).css("display", "flex");

  $(".toast_html").html( sectionQuoteData(clickedSection));

});

$(".close_button").click(function() {
  $(toast).css("display", "none");
  $(toastData).css("display", "none");
});

$("#toast").click(function() {
  $(toast).css("display", "none");
  $(toastData).css("display", "none");
});

//////////
// contact me
//////////

$(".social").click(function() {
  if ($(this).hasClass("social_mail")) {
    $("#qr_code").attr("src", "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=matthew@gethashset.com");
  } else if ( $(this).hasClass("social_link")) {
    $("#qr_code").attr("src", "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://gethashset.com");
  } else if ( $(this).hasClass("social_linkedin")) {
    $("#qr_code").attr("src", "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://linkedin.com/in/matthewcarpenter22");
  } else if ( $(this).hasClass("social_github")) {
    $("#qr_code").attr("src", "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://github.com/gethashset");
  } else if ( $(this).hasClass("social_codepen")) {
    $("#qr_code").attr("src", "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=codePen_coming_soon");
  };
});

////////////////////////////////////
// functions
////////////////////////////////////

// use this function to return HTML with markup and classes to the page.
const sectionQuoteData = sectionClicked => {
  switch (sectionClicked) {
    case "projects":
      return `<h2>Projects</h2> <div></div> <p>I have had the opportunity to work an a wide array of projects. From web applications given life by javascript to Online VR programs running on C#.</p> <h3>Start =&gt; Now</h3> <p>My very first javascrip application is showcased right here! It's called the <strong>Box Playground</strong> and it was how I was able to teach myself CSS and understand how javascript communicates with the DOM. Even though I have come a long way (React.js, Node.js, ES6) I will always be proud to show off my first web application.</p>`;
    case "git":
      return `<h2>Git</h2> <p>Source control is a staple in the dev community. It's important that future employers and project leads review git repos and code before selecting a developer.</p> <h3>API</h3> <p>github offers a really fun API that will return the data of a user/ their repos/ how they interact with github and even the messages they leave while they commit. I have chosen to use this as a kickoff point.</p> <p>You may have noticed that if you return a GET request to the API that you are not returned the "pinned" data or the "calendar" that everyone loves to fill.</p> <p>Then how did I get it I wonder?</p>`;
    case "skills":
      return `<h2>Skills</h2> <p>In this section I wanted to showcase all of the skills I am comfortable using in a professional workplace (or Agile work place). But I didnt want to display it in grid or flex layout. Instead I used CSS animations and some tricks during my research to display them as a real time typing event!</p> <h3>The List</h3> <p> Full list coming to README.md soon.</p>`;
    case "history":
      return `<h2>Job History</h2> <p>See a full copy of my resume at the bottom of the page.</p> <p>Details will be added here in a future update.</p>`;
    case "readme":
      return `Good coding standards are important. This applicaiton was built using those standards. In addtion I am comfortable using lint and respond well to feedback!`;
    case "contact":
      return `<h2>Contact Me</h2> <p>Feel free to get in touch. I love to talk code and I alsways want to be involved with a good npm package or freelance project!</p> <p>If you're a learning student here to ask for advice or want to know more about the coding bootcamp I took, be sure to put that in your email.</p>`;
      default:
      return `<h2>This is a README.md tooltip</h2> <p>For more information visit the README.md file in the root directory on github. No need to post it here, I'm sure you'll find it somewhere on this page.</p>`;
  }
};