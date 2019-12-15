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
        pinnedProjects: []
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
                console.log("scrapeData")
                console.log(scrapeData);

                gitBlocks.html(scrapeData[0].html);

                ////////////
                // Third Call fills out pinned items using git data about those repos
                ////////////
                $.ajax({
                    url: `${gitObj.repos}`,
                    method: "GET"
                })
                .then(function(git_repo_data){
                    //console.log("git_repo_data")
                    //console.log(git_repo_data);

                    //////////////////////////////////////////////////
                    //////////////////////////////////////////////////
                    // data we will need                             //
                    //////////////////////////////////////////////////
                    //////////////////////////////////////////////////
                    // title (this is not the same as repo name)    //
                    // watchers                                     //
                    // star gazors                                  //
                    // forked count                                 //
                    // link                                         //
                    // about this project (pulled from scrape)      //
                    // last commit message (requires second call maybe make this a button?) // button must contain url for call schema is api.github.com/repos/$$user/$$reponame/commits [location] Obj[0].commit.message / also get Obj[0].author.name
                    // issues count (find url via schema of route)  //
                    //////////////////////////////////////////////////
                    //////////////////////////////////////////////////

                    // esample of how to access the array of objects if and check for any value.
                    // if they have no pinned projects
                    // gitObj.pinnedProjects.forEach(pinnedProject => {
                    //     console.log("This was able to access project " + pinnedProject);
                    // });

                    

                //////////////////////////////
                // make pinned items
                //////////////////////////////
                makePinnedItems(scrapeData[0].gitImages, scrapeData[0].pinnedObjects);

                ////////////////
                // Add data to the created pinned item.
                ////////////////

                    git_repo_data.forEach(gitRepo => {
                        gitObj.pinnedProjects.forEach(pinnedItem => {
                            if (gitRepo.name == pinnedItem){
                                //console.log(`--------------------------------------------`)

                                console.log(`Name: ${gitRepo.name}`);
                                console.log(`Description: ${gitRepo.description}`);
                                console.log(`Forked: ${gitRepo.forks_count}.`);
                                console.log(`Watchers: ${gitRepo.watchers_count}.`);
                                console.log(`Stars: ${gitRepo.stargazers_count}.`);
                                console.log(`Link: ${gitRepo.svn_url}`);
                                console.log(`Do something with ${pinnedItem}`);
                                //console.log(gitRepo);
                                console.log(`Commits: ${gitRepo.git_commits_url}`);

                                console.log(`--------------------------------------------`)

                               $(`.${gitRepo.name.toLowerCase()}_h2`)[0].innerHTML = gitRepo.name;
                               $(`.${gitRepo.name.toLowerCase()}_about`)[0].innerHTML = gitRepo.description;

                            };
                        });
                    });


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

    const getRecentCommitMessages = (commit_url) => {
        $.ajax({
            url: `${commit_url}`,
            method: "GET"
        })
        .then(function(data) {
            //console.log(data);
            let totalCommits = data[0].length;
            let mostRecentCommit = data[0].commit.message;
            let whoWroteIt = data[0].author.login;
            console.log(`${whoWroteIt} commited "${mostRecentCommit}": out of a total of ${totalCommits} commits.`)
        })
        .catch(function(err) {
            console.log("Error in commit messages.")
        });
    };

    const updateData = (obj) => {
        gitPic.attr("style", `background-image: url(${obj.img})`);

        // fill in bio
        $(".bio").html(obj.bio);
    };

    const makePinnedItems = (arr, names) => {

        let putThemHere = $("#git_pinned_items");

        let newWrapperDiv = $("<div>");
        newWrapperDiv.addClass("git_pinned_items");

        let pinned_item = 0;

        arr.forEach(item => {

           //make a new div.
           let gitCard = $("<div>");
           gitCard.addClass("git_card");

           ////////////////////////////////////////
           //                                    //
           //  Order to build the card correctly //
           //  div - class="card_wrap"           //
           //   div - class="img_wrap"           //
           //    div - class="place_img_here"    //
           //   div class="info"                 //
           //    div class="title_links"         //
           //      h2 class="this.name_h2" -- this will be used to add the title after it's been built
           //      ul                            //
           //       li class="this.name_eye" / _star / _git-network / _commit / _link / _issues
           //    p class="this.name_p"           //
           //                                    //
           //                                    //
           ////////////////////////////////////////
           
           if (names[pinned_item] != null){

            
            console.log(pinned_item);
            console.log(`building ${names[pinned_item]}`);

           ////////////////////////////////////////
           // 1.
           let cardWrap = $("<div>");
           cardWrap.addClass("card_wrap");

           // 2.
           let imgWrap = $("<div>");
           imgWrap.addClass("img_wrap");
           cardWrap.append(imgWrap);

           // 3.
           let placeImgHere = $("<div>");
           placeImgHere.addClass("place_img_here");
           placeImgHere.addClass(`${names[pinned_item].toLowerCase()}_img`); // example project2_img;
               // add place_img_here to imgWrap
           imgWrap.append(placeImgHere);

           let imgTag = item.toString().replace("img", "img class=git_pinned_img");
           placeImgHere.append(imgTag);

           // 4.
           let info = $("<div>");
           info.addClass("info");
           cardWrap.append(info);
        
           // 5.
           let titleLinks = $("<div>");
           titleLinks.addClass("title_links");
           info.append(titleLinks);

           // 6.
           let h2Tag = $("<h2>");
           h2Tag.addClass(`${names[pinned_item].toLowerCase()}_h2`);
                // add to title_links
            titleLinks.append(h2Tag);

           // 7. Create an array with the name of the porject plus the button name.
           let liArray = [
               { name : `${names[pinned_item].toLowerCase()}_eye`, ionicon : "eye", tooltip : "Watchers"},
               { name : `${names[pinned_item].toLowerCase()}_star`, ionicon : "star", tooltip : "Stars"},
               { name : `${names[pinned_item].toLowerCase()}_git-network`, ionicon : "ios-git-network", tooltip : "Forked"},
               { name : `${names[pinned_item].toLowerCase()}_commit`, ionicon : "ios-git-commit", tooltip : "Commit Message"},
               { name : `${names[pinned_item].toLowerCase()}_link`, ionicon : "ios-link", tooltip : "link"},
               { name : `${names[pinned_item].toLowerCase()}_issues`, ionicon : "ios-construct", tooltip : "issues"}
           ]

           // create a tag and then fill it with the list items in the array above.

           let ulTag = $("<ul>");
           liArray.forEach( listItem => {
                // 8.
                let createListItem = $("<li>");
                createListItem.addClass(listItem.name); // example <li class="project2_eye">
                createListItem.addClass("tooltip");
                let tooltipSapn = $("<span>");
                tooltipSapn.addClass("tooltiptext");
                tooltipSapn.html(listItem.tooltip);
                createListItem.append(tooltipSapn);
                let spanInsideListItem = $("<span>");
                spanInsideListItem.html(`<ion-icon name="${listItem.ionicon}"></ion-icon>`); // example <ion-icon name="project2_eye"></ion-icon>
                createListItem.append(spanInsideListItem);

                // last attach it to the <ul>
                ulTag.append(createListItem);
           });
             // append to info
           titleLinks.append(ulTag);

           // 9.
           let pTag = $("<p>");
           pTag.addClass("about");
           pTag.addClass(`${names[pinned_item].toLowerCase()}_about`);

           titleLinks.append(pTag);

           // 10. build it
           

           // now add the card to the page.
           ////////////////////////////////////////

           putThemHere.append(cardWrap);
        };
        //    // before building out a card. This will check to make sure a null value wasnt tossed in the mix.
        //    if (names[pinned_item] != null){

             let nameOfProject = names[pinned_item]; // create a variable to store the object. this will convert it to a string and allow us to use methods on it.
        //     gitCard.attr("name", nameOfProject.toLowerCase());
        //     let userName = gitInput[0].value.trim();
        //     gitCard.attr("commit", `https://api.github.com/repos/${userName}/${nameOfProject}/commits`);
            
        //     console.log(`Building card for ${nameOfProject}`);
             gitObj.pinnedProjects.push(nameOfProject);
        //    };

              
        //    // make a string out of the item in this array.
              //let imgTag = item.toString()
              
        //    // get the name of the project.
        //    let git_h3Tag = `<h3>${names[pinned_item]}</h3>`;

        //    // add the img to git card
        //    // add a title to the card
        //    gitCard.append(imgTag);
        //    gitCard.append(git_h3Tag);

        //    names[pinned_item] == null ? null : 

        //    // add the card to the wrap div.
        //    newWrapperDiv.append(gitCard);

           // 
           pinned_item++;
        });

        //putThemHere.html(cardWrap);
    };


    ////////////////////////////////////
    // buttons
    ////////////////////////////////////


    $("#git_search").click(() => {
        runApiCall(gitInput[0].value.trim());  
    });

    document.addEventListener('click', function(event) {
        if ($(event.target).parent().attr("commit") != undefined) {
            // correct thing was clicked. Run API call.
            getRecentCommitMessages($(event.target).parent().attr("commit"));

        } else {
            return;
        }
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