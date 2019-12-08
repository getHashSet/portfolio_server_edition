/* by Matthew Carpenter */

$( document ).ready(function() {

    const greenSock = {

        project_1: $("#projects"),
        card1: $("#card_1"),
        card2: $("#card_2"),
        card3: $("#card_3"),
        card4: $("#card_4"),
        card5: $("#card_5"),
        card6: $("#card_6"),
        family: $("#about_family")
    }
    
    
    var tl = new TimelineMax({onUpdate:updatePercentage});
    var t2 = new TimelineMax();

    const controller = new ScrollMagic.Controller();
    
    tl.from([greenSock.family], .5, {y: 200, opacity: 0});

    const scene = new ScrollMagic.Scene({
        triggerElement: ".magic_pin_1",
        triggerHook: "onLeave",
        duration: "150%"
    })
    .setPin(".magic_pin_1")
    .setTween(tl)
    .addTo(controller);
    
    function updatePercentage() {
        tl.progress();
        console.log(tl.progress())
    }


    ////////////
    // Projects
    ////////////



    //tl.from([greenSock.card1, greenSock.card4], .5, {y: 500, opacity: 0});


    ////////////
    //  check for item in view port
    ////////////


    $.fn.isInViewport = function() {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();
    
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
    
        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    ////////////
    //  on scroll
    ////////////
    
    let rollProjects = false;

    $(window).on('resize scroll', function() {

        if ($('.deck').isInViewport()) {
            //console.log("true");

            if (rollProjects == false) {
                
                console.log("roll projects")

                rollProjects = true; 

                t2.from(
                    [greenSock.card1, greenSock.card4], 1, {y: 300, opacity: 0}, .3);
                t2.from(
                    [greenSock.card2, greenSock.card5], 1, {y: 300, opacity: 0}, .7);
                t2.from(
                    [greenSock.card3, greenSock.card6], 1, {y: 300, opacity: 0}, 1.3);

            } else {

            //console.log("false");
            rollProjects = true;

            };

        } else {

            // rollProjects = false;
            console.log("false");

        }
    });




});

