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
            console.log(data);

            gitObj.img = data.avatar_url;
            data.company ? gitObj.company = data.company : gitObj.company = "";
            gitObj.followers = data.followers;
            gitObj.link = data.html_url;
            data.hireable ? gitObj.hireable = true : gitObj.hireable = false;
            data.name ? gitObj.name = data.name : gitObj.name = data.login;
            data.bio.length >= 8 ? gitObj.bio = data.bio : gitObj.bio = "Learn more by visiting my github.";
            data.blog ? gitObj.website = data.blog : gitObj.website = data.html_url;
            
            // Tell the page to update the data.
            updateData(gitObj);

            ////////////
            // Second Call is to scrape Git for data;
            ////////////

            $.ajax({
                url: `/scrape/git`,
                method: "POST",
                data: { git: gitObj.link}
            })
            .then(function(scrapeData){
                console.log(scrapeData);

                gitBlocks.html(scrapeData[0].html);

                // make pinned items
                makePinnedItems(scrapeData[0].gitImages);
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

    const makePinnedItems = (arr) => {
        //console.log("what up dog" + arr);
        let putThemHere = $("#git_pinned_items");

        let newWrapperDiv = $("<div>");
        newWrapperDiv.addClass("git_pinned_items");

        arr.forEach(item => {
           //newWrapperDiv.append(gitColorBlocks(item));
           let imgTag = item.toString().replace("img", "img class=git_pinned");
           newWrapperDiv.append(imgTag);
        });

        putThemHere.html(newWrapperDiv);
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