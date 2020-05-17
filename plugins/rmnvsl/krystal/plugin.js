/*\
title: $:/plugins/rmnvsl/krystal/plugin.js
type: application/javascript
module-type: startup

Sets plugin behavior

\*/
(function () {
  exports.after = ["render"];

  exports.startup = function () {
    header();

    window.addEventListener("resize", header);

    window.addEventListener("scroll", effects, true);

    $tw.rootWidget.addEventListener("tm-scroll", function (event) {
      if (event.type === "tm-scroll") {
        scroll(event.target);
      }
    });
  };

  function header() {
    const height = document.querySelector(".krystal-header").offsetHeight;
    console.log(height);
    document.documentElement.style.setProperty(
      "--krystal-header-height",
      `${height}px`
    );
  }

  function scroll(tiddlerElement) {
    const mediaQueryList = window.matchMedia("(min-width: 960px)");

    if (mediaQueryList.matches) {
      var storyRiver = tiddlerElement.parentElement;

      var tiddlerPosition = Array.from(
        storyRiver.querySelectorAll("div[data-tiddler-title]")
      ).indexOf(tiddlerElement);
      var tiddlerWidth = tiddlerElement.offsetWidth;
      var windowWidth = window.innerWidth;

      var position = windowWidth / 2 - tiddlerWidth / 2;
      var newRiverPosition = Math.max(
        tiddlerPosition * tiddlerWidth - position,
        0
      );

      storyRiver.scroll({ left: newRiverPosition, behavior: "smooth" });
    } else {
      tiddlerElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  function effects() {
    var tiddlers = Array.from(document.querySelectorAll(".tc-tiddler-frame"));
    var tiddlersCount = tiddlers.length;

    if (tiddlersCount === 0) {
      return;
    }

    var offset = 100;
    var tiddlerPadding = 42;
    var tiddlerWidth = tiddlers[0].offsetWidth;
    var windowWidth = window.innerWidth;

    tiddlers.forEach(function (tiddler, i) {
      if (i === 0) {
        return;
      }

      var tiddlerTitle = tiddler.querySelector(".krystal-tiddler__title");

      // Edit Template
      if (!tiddlerTitle) {
        return;
      }

      var previousTiddler = tiddlers[i - 1];
      var previousTiddlerTitle = previousTiddler.querySelector(
        ".krystal-tiddler__title"
      );

      var x = tiddler.getBoundingClientRect().left;

      var start = x < offset + i * tiddlerPadding;
      var end =
        x > windowWidth - (offset + (tiddlersCount - i) * tiddlerPadding);

      var startOverlay = x < tiddlerWidth + (i - 1) * tiddlerPadding;

      tiddler.classList.toggle("krystal-tiddler__frame--overlay", startOverlay);

      if (previousTiddlerTitle) {
        previousTiddlerTitle.classList.toggle(
          "krystal-tiddler__title--start-active",
          start
        );

        if (!end) {
          previousTiddler.classList.toggle(
            "krystal-tiddler__frame--hide",
            start
          );
        }
      }

      if (start) {
        tiddlerTitle.classList.remove("krystal-tiddler__title--end");
      }

      if (end) {
        tiddler.classList.add("krystal-tiddler__frame--overlay");
        tiddler.classList.add("krystal-tiddler__frame--hide");
        tiddlerTitle.classList.add(
          "krystal-tiddler__title--end",
          "krystal-tiddler__title--end-active"
        );
      } else {
        if (!startOverlay) {
          tiddler.classList.remove("krystal-tiddler__frame--overlay");
        }

        tiddler.classList.remove("krystal-tiddler__frame--hide");
        tiddlerTitle.classList.remove("krystal-tiddler__title--end-active");
      }
    });
  }
})();
