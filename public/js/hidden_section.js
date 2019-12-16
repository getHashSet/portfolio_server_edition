

$(".input_button").click(function () {
    let emailInput = $("#email_input").val();
    let nameInput = $("#name_input").val();

    if (validateEmail(emailInput)){
        console.log("This seems to be a valid email");
        console.log(`Thank you, ${nameInput}.`);

        let t4 = new TimelineMax();
        t4.to($(".locked_section"), .5, {y: "100%"}, .1);
        t4.to($(".locked_section"), .5, {opacity: 0});

        $("#c8").css("min-height", "80vh");
        $("#c8").css("display", "block");

        // load resume
        // this is where the call to my API will return the url needed to post me resume.
        // currently moving my database from noSQL to SQL and we are going to have to fudge this a bit.
        // RegEx is working though.

        $("#resume_image").attr("src", "../images/resume_placeholder.jpg");


    } else {
        console.log("This is NOT a valid email");
    }
});

function validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    return (false)
}

////////////
// Buttons
////////////

$("#download").click(function() {

});

$("#print").click(function() {
    let w = window.open("../images/Matthew_Carpenter_Resume.pdf"); //Required full file path.
        w.print();
        // setInterval(function() {
        //     window.location.reload(true);
        // }, 1000)
});

$("#email").click(function() {
    alert("Currently unavailable to email resume at this time.")
});