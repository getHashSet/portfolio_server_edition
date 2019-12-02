$(document).ready(function () {

    //   //////////////////////////////////////////
    //   // global
    //   //////////////////////////////////////////

    let load_here = $("#blockquote");

    // string of stuff I know how to do.
    let theList =
      `["Node.js",
      "javascript.",
      "C#",
      "HTML5.",
      "animations.",
      "Unity.",
      "SCSS",
      "GreenSock.",
      "ScrollMagic.",
      "php.",
      "Wordpress.",
      "design.",
      "frontend.",
      "VR.",
      "backend.",
      "middleware.",
      "SQL",
      "games.",
      "npm",
      "code",
      "{{handlebars}}",
      "agile",
      "Salesforce",
      "MVC",
      "noSQL",
      "MERN",
      "LAMP",
      "git"]`;

    load_here.attr("data-type", theList);

    // code provided by CSS tricks.

    let TxtType = function (el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function () {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

        var that = this;
        var delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(function () {
            that.tick();
        }, delta);
    };

    // onload called for window within document on load.
    window.onload = function () {
        var elements = document.getElementsByClassName('typewrite');
        for (var i = 0; i < elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
                new TxtType(elements[i], JSON.parse(toRotate), period);
            }
        }
        // INJECT CSS
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
        document.body.appendChild(css);
    };

}); // on load