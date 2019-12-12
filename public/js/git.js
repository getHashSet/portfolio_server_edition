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

            // img
            gitObj.img = data.avatar_url;

            // where you work
            data.company ? gitObj.company = data.company : gitObj.company = "";

            // how many followers
            gitObj.followers = data.followers;

            // link to github
            gitObj.link = data.html_url;

            // displayed as hireable?
            data.hireable ? gitObj.hireable = true : gitObj.hireable = false;

            // real name?
            data.name ? gitObj.name = data.name : gitObj.name = data.login;

            // summary?
            data.bio != null ? gitObj.bio = data.bio : gitObj.bio = "Learn more by visiting my github.";

            // link to personal url
            data.blog ? gitObj.website = data.blog : gitObj.website = data.html_url;
            
            // following
            gitObj.following = data.following_url;
            
            // repos url
            gitObj.repos = data.repos_url;

            //console.log(gitObj);

            // Tell the page to update the data.
            updateData(gitObj);

            ////////////
            // second Call is to scrape Git for data;
            ////////////

            $.ajax({
                url: `/scrape/git`,
                method: "POST",
                data: { git: gitObj.link}
            })
            .then(function(scrapeData) {
                //console.log(scrapeData);

                gitBlocks.html(scrapeData[0].html);

                // make pinned items
                makePinnedItems(scrapeData[0].gitImages, scrapeData[0].pinnedObjects);

                ////////////
                // Third Call fills out pinned items using git data about those repos
                ////////////
                $.ajax({
                    url: `${gitObj.repos}`,
                    method: "GET"
                })
                .then(function(git_repo_data){
                    console.log(git_repo_data);

                    //////////////////////////////////////////////////
                    //////////////////////////////////////////////////
                    // data I will need                             //
                    //////////////////////////////////////////////////
                    //////////////////////////////////////////////////
                    // title (this is not the same as repo name)    //
                    // repo name pulled from api request            //
                    // watchers                                     //
                    // star gazors                                  //
                    // forked count                                 //
                    // link                                         //
                    // about this project (pulled from scrape)      //
                    // last commit message (requires second call maybe make this a button?) // button must contain url for call schema is api.github.com/repos/$$user/$$reponame/commits [location] Obj[0].commit.message / also get Obj[0].author.name
                    // issues count (find url via schema of route)  //
                    //////////////////////////////////////////////////
                    //////////////////////////////////////////////////


                })
                .catch(function(error_repoData){

                }); // end of repo data call

            })
            .catch(function(err) {
                console.log("Issue with Git request.");
            }); // end of Git Scrape.

        })
        .catch(function(err) {
            console.log("Cannot Collect Git Data (CCGD error)");
        }); // end of ajax calls for github
    };


    ////////////////////////////////////
    // functions
    ////////////////////////////////////


    const updateData = (obj) => {
        gitPic.attr("style", `background-image: url(${obj.img})`);

        // fill in bio
        $(".bio").html(obj.bio);
    };

    const makePinnedItems = (arr, names) => {
        //console.log("what up dog" + arr);
        let putThemHere = $("#git_pinned_items");

        let newWrapperDiv = $("<div>");
        newWrapperDiv.addClass("git_pinned_items");

        let pinned_item = 0;

        arr.forEach(item => {

            //make a new div.
           let gitCard = $("<div>");
           gitCard.addClass("git_card");

           let imgTag = item.toString().replace("img", "img class=git_pinned_img");
           // make a string out of the item in this array.
           //let imgTag = item.toString()
           // get the name of the project.
           let git_h3Tag = `<h3>${names[pinned_item]}</h3>`;

           // add the img to git card
           // add a title to the card
           gitCard.append(imgTag);
           gitCard.append(git_h3Tag);

           names[pinned_item] == null ? null : 

           // add the card to the wrap div.
           newWrapperDiv.append(gitCard);

           // 
           pinned_item++;
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