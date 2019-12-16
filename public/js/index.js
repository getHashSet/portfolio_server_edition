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
      return `This is the projects section.`;
    case "git":
      return `This is the git hub section. And boy is it a cool part of this app. Github API provides quite a bit of data on its own. But if you're familiar with the github object then you know it doesnt return all the data you are seeing here on this app. Try and go to your browser's console and type the following line git('getHashSet') this will display the data I parsed through using ajax.`;
    case "skills":
      return `<ul> <li>HTML5</li> <li>CSS3</li> <li>ES6</li> </ul>`;
    case "history":
      return `<h2>These are the places I have worked. For a copy of my resume continue to the bottom of the page and you can request one right away by inputing your email and company name or by just asking matthew@getHashSet.com</h2>`;
    case "readme":
      return `Good coding standards are important. This applicaiton was built using those standards. In addtion I am comfortable using lint and respond well to feedback!`;
    case "contact":
      return `<p>Feel free to get in touch.</p>`;
      default:
      return `<h2>Card</h2>`;
  }
};