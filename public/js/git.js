$(document).ready(function() {

    ////////////////////////////////////
    // global variables
    ////////////////////////////////////

    let gitInput = $("#git_input");
    let gitPic = $("#git_pic");

    ////////////////////////////////////
    // git object
    ////////////////////////////////////

    const gitObj = {

    };


    ////////////////////////////////////
    // api
    ////////////////////////////////////

    const runApiCall = (userName) => {
        $.ajax({
            url: `https://api.github.com/users/${userName}`,
            method: "GET"
        })
        .then(function(data){
            console.log(data);

            gitObj.img = data.avatar_url;
            gitObj.company = data.company;
            gitObj.followers = data.followers;
            gitObj.link = data.html_url;
            
            // Tell the page to update the data.
            updateData(gitObj);

            // Second Call is to scrape Git for data;
            $.ajax({
                url: `/scrap/${gitObj.link}`,
                method: "GET"
            })
            .then(function(scrapeData){

            })
            .catch(function(err){
                console.log("Issue with Git request.");
            }); // end of Git Scrape.

        })
        .catch(function(err){
            console.log("Can't find what you're looking for.");
        });
    };

    ////////////////////////////////////
    // functions
    ////////////////////////////////////

    const updateData = (obj) => {
        gitPic.attr("style", `background-image: url(${obj.img})`);
    };

    ////////////////////////////////////
    // button
    ////////////////////////////////////

    $("#git_search").click(() => {
        runApiCall(gitInput[0].value.trim());  
    });

    $("input").keyup((event) => {
        if ($("#git_search").focus() && event.keyCode == 13 ){  
            runApiCall(gitInput[0].value.trim()); 
        }
    });

    ////////////////////////////////////
    // on load
    ////////////////////////////////////

    runApiCall(gitInput[0].value.trim());

});
////////////
// FIN
////////////