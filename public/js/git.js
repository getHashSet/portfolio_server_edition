$(document).ready(function() {

    ////////////////////////////////////
    // global variables
    ////////////////////////////////////

    let gitInput = $("#git_input");
    let gitPic = $("#git_pic");
    let gitBlocks = $("#git_blocks");

    ////////////////////////////////////
    // git object
    ////////////////////////////////////

    const gitObj = {

    };


    ////////////////////////////////////
    // api
    ////////////////////////////////////

    // 1: collect userName and call the public API for data.
    // 2: use that data to fill the gitObj with key: values
    // 3: use that obj to update the page.
    // 4: 2nd Call will send a POST request that will tell cheerio to scrape git for the non-public data.
    // 5: 3rd Call will fill the object with git project data. That data will populate clicks from the obj.
    // 6: build a cookie that keeps that data local to the user.
    const runApiCall = (userName) => {
        $.ajax({
            url: `https://api.github.com/users/${userName}`,
            method: "GET"
        })
        .then(function(data){
            //console.log(data);

            gitObj.img = data.avatar_url;
            gitObj.company = data.company;
            gitObj.followers = data.followers;
            gitObj.link = data.html_url;
            
            // Tell the page to update the data.
            updateData(gitObj);

            // Second Call is to scrape Git for data;
            $.ajax({
                url: `/scrape/git`,
                method: "POST",
                data: { git: gitObj.link}
            })
            .then(function(scrapeData){
                console.log(scrapeData);
                gitBlocks.html(scrapeData[0].html);
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
    // buttons
    ////////////////////////////////////

    $("#git_search").click(() => {
        runApiCall(gitInput[0].value.trim());  
    });

    $("input").keyup((event) => {
        if ($("#git_search").focus() && event.keyCode == 13 ){  
            runApiCall(gitInput[0].value.trim()); 
        }
    });

    $("#clear").click(() => {
        $(gitInput[0].value = "");
    });

    ////////////////////////////////////
    // on load
    ////////////////////////////////////

    runApiCall(gitInput[0].value.trim());

});
////////////
// FIN
////////////