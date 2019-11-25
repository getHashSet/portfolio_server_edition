$(document).ready(function() {
  console.log("by Matthew Carpenter");
  console.log("matthew@getHashSet.com");
  console.log("https://github.com/getHashSet");
  console.log("https://linkedin.com/in/matthewcarpenter22");
  console.log("--");

  //////////////////////////////////////////
  // global variables
  //////////////////////////////////////////

  let deckLoadsHere = $("#projects");
  let project_array = [];

  //////////////////////////////////////////
  // card objects
  //////////////////////////////////////////

  // create an object constructor for the cards
  function Project(_title, _description, _stack_used, _project_url, _image_url)
    {
    this.title = _title;
    this.image = _image_url;
    this.project_url = _project_url;
    this.stack_used = _stack_used;
    this.description = _description;
    };

  ////////////
  // project 1
  ////////////
  let project_1 = new Project (
    "Box Playground",
    "Play around with CSS properties, and have a great time doing it too!",
    ["HTML5", "CSS", "javascript"],
    "https://getHashSet.com",
    "../images/Title"
  );
  // add to project_array
  project_array.push(project_1);

  ////////////
  // project 2
  ////////////
  let project_2 = new Project (
    "README.md Builder",
    "Building README's is a lot of work. But this handy app makes starting your documentation easier.",
    ["HTML", "SCSS", "javascript", "API", "Markup"],
    "https://getHashSet.com",
    "../images/Title"
  );
  // add to project_array
  project_array.push(project_2);

  ////////////
  // project 3
  ////////////
  let project_3 = new Project (
    "Better Business Cards",
    "Business Cards are coming back. And this is the place to build your next one",
    ["Node.js", "SQL", "QR API"],
    "https://getHashSet.com",
    "../images/Title"
  );
  // add to project_array
  project_array.push(project_3);


  //////////////////////////////////////////
  // function
  //////////////////////////////////////////

  const buildCard = arr => {
    // create the deck that will be appended to deckLoadsHere
    let deck = $("<div>");
    deck.addClass("deck");

    // if array length is less than 1, do nothing, else start building the cards.
    arr.length < 1 ? null :
    // for each element in the arr build the card.
    arr.forEach(element => {

        // make card wrap
        let card = $("<div>");
        card.addClass("card");

        // add div for img and set background to this elements image_url key then add it to the card.
        let art = $("<div>");
        art.addClass("card_art");
        art.attr("style", `background-image: url(${element.image});`);
        // add an <a> tag to make the image clickable
        let art_url = $("<a>");
        art_url.attr("href", `${element.project_url}`);
        // place image inside a tag then place the a tag inside the card
        art_url.append(art);
        card.append(art_url);

        // add h2 title to card
        let h2_title = $("<h2>");
        h2_title.html(element.title);
        card.append(h2_title);

        // add stack array via spans
        let sub_title = $("<h3>");
        element.stack_used.forEach(item => {
            let h3_span = $("<span>");
            h3_span.html(item);
            sub_title.append(h3_span);
        });
        card.append(sub_title);

        // add hover text with the info in it. This will include a Read More > with arrow.
        let hover_for_info = $("<div>");
        hover_for_info.addClass("hover_info");
        
        // add <p> tag with info on project
        let info_p_tag = $("<p>");
        info_p_tag.html(element.description);
        
        // read more link
        let read_more = $("<span>");
        let read_more_link = $("<a>");
        read_more_link.attr("href", `${element.project_url}`);
        read_more_link.html("read more <span>&gt;</span>");
        read_more.append(read_more_link);
        // add that to the p tag element
        info_p_tag.append(read_more);

        // add info_p_tag to the hover div
        hover_for_info.append(info_p_tag);

        // add hover_for_info to the card
        card.append(hover_for_info);

        ////////////
        // Add card to deck
        ////////////

        deck.append(card);

    });

    // send final to the page.
    deckLoadsHere.append(deck);

  };

    // call function on page load.
    buildCard(project_array);

});

////////////
// FIN
////////////