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

  $(toastData).html( sectionQuoteData(clickedSection));

});

$(".close_button").click(function() {
  $(toast).css("display", "none");
  $(toastData).css("display", "none");
});

$("#toast").click(function() {
  $(toast).css("display", "none");
  $(toastData).css("display", "none");
});

////////////////////////////////////
// functions
////////////////////////////////////

// use this function to return HTML with markup and classes to the page.
const sectionQuoteData = sectionClicked => {
  switch (sectionClicked) {
    case "projects":
      return "This is the projects section.";
    case "git":
      return "This is the git hub section. And boy is it a cool part of this app.";
    case "skills":
      return "<ul> <li>HTML5</li> <li>CSS3</li> <li>ES6</li> </ul>";
    default:
      return "You have clicked a quote button.";
  }
};