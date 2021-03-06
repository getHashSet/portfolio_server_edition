/* by Matthew Carpenter */

$(document).ready(function () {

    ////////////
    // is the item in viewport?
    ////////////
    function elementInViewport(el) {
        let top = el.offsetTop;
        let left = el.offsetLeft;
        let width = el.offsetWidth;
        let height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return (
            top < (window.pageYOffset + window.innerHeight) &&
            left < (window.pageXOffset + window.innerWidth) &&
            (top + height) > window.pageYOffset &&
            (left + width) > window.pageXOffset
        );
    }

    ////////////
    // On scroll events
    ////////////

    window.addEventListener('scroll', function (event) {
        
        let intViewportWidth = window.innerWidth;

        let yOffset = window.pageYOffset;
        let speed = -2;
        if (document.getElementsByClassName("parallax") && intViewportWidth >= 900) { document.getElementsByClassName("parallax")[0].style.backgroundPosition = "center " + ((yOffset) / speed) + "px"; } else
        {  }
    });



    let theH1Tag = $("h1");
    let myName = "Matthew Carpenter";
    let myNameArr = [];

    // wrap each letter of my name in a span.
    // add id of the name_letter_number so that we can put it in an object.
    // use that object to animate.
    for (i = 0; i < myName.length; i++) {
        // check for white space
        if (i === 7) {
            theH1Tag.append(`<span id='name_space' class='letters'>${myName[i]}</span>`);
        } else {
            theH1Tag.append(`<span id='name_${myName[i]}${i}' class='letters'>${myName[i]}</span>`);
        };
        let thisletter = `name_${myName[i]}${i}`;
        myNameArr.push(`${thisletter}`);
    };

    var t3 = new TimelineMax();
    myNameArr.forEach(letterId => {
        t3.from(
            $(`#${letterId}`), .1, { ease: "bounce.in", y: -100, opacity: 0 },
        )
    });

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


    var tl = new TimelineMax({ onUpdate: updatePercentage });
    var t2 = new TimelineMax();

    const controller = new ScrollMagic.Controller();

    tl.from([greenSock.family], .5, { y: 200, opacity: 0 });

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
        //console.log(tl.progress())
    }


    ////////////
    // Projects
    ////////////



    //tl.from([greenSock.card1, greenSock.card4], .5, {y: 500, opacity: 0});


    ////////////
    //  check for item in view port
    ////////////


    $.fn.isInViewport = function () {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();

        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    ////////////
    //  on scroll
    ////////////

    const rollUp = () => {

        t2.to([greenSock.card1], 1, { y: 0, opacity: 1 }, .2);
        t2.to([greenSock.card4], 1, { y: 0, opacity: 1 }, 1);
        t2.to([greenSock.card2], 1, { y: 0, opacity: 1 }, .5);
        t2.to([greenSock.card5], 1, { y: 0, opacity: 1 }, 1.5);
        t2.to([greenSock.card3], 1, { y: 0, opacity: 1 }, 1);
        t2.to([greenSock.card6], 1, { y: 0, opacity: 1 }, 1.2);

    };

    const rollDown = () => {

        t3.to([greenSock.card1], .1, { y: 300, opacity: 0 });
        t3.to([greenSock.card4], .1, { y: 300, opacity: 0 });
        t3.to([greenSock.card2], .1, { y: 300, opacity: 0 });
        t3.to([greenSock.card5], .1, { y: 300, opacity: 0 });
        t3.to([greenSock.card3], .1, { y: 300, opacity: 0 });
        t3.to([greenSock.card6], .1, { y: 300, opacity: 0 });

    }

    ///////
    // off switch
    ///////

    let rollProjects = false;
    let work1 = false;
    let work2 = false;
    let work3 = false;

    /////////////////////////
    // window on resize and on scroll
    /////////////////////////

    $(window).on('resize scroll', function () {

        if ($('.deck').isInViewport() && rollProjects == false) {

            rollProjects = true;
            rollUp();

        } else if (!$('.deck').isInViewport() && rollProjects == true) {

            rollProjects = false;
            //rollDown();

        }

        if ($("#bestbuy").isInViewport() && work1 === false) {
            work1 = true;
            t3.from($("#bestbuy"), 1, { x: -500, opacity: 0 });
        }

        if ($("#apple").isInViewport() && work2 === false) {
            work2 = true;
            t3.from($("#apple"), 1, { x: 500, opacity: 0 });
        }

        if ($("#madden_media").isInViewport() && work3 === false) {
            work3 = true;
            t3.from($("#madden_media"), 1, { x: -500, opacity: 0 });
        }

    });




});

