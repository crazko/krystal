/*\
title: $:/plugins/rmnvsl/krystal/tiddler.js
type: application/javascript
module-type: library

Handles tiddlers scroll styling

\*/
(function () {
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", effects, true);
  }

  function effects(e) {
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
      }

      if (start) {
        tiddlerTitle.classList.remove("krystal-tiddler__title--end");
      }

      if (end) {
        tiddler.classList.add("krystal-tiddler__frame--overlay");
        tiddlerTitle.classList.add(
          "krystal-tiddler__title--end",
          "krystal-tiddler__title--end-active"
        );
      } else {
        if (!startOverlay) {
          tiddler.classList.remove("krystal-tiddler__frame--overlay");
        }

        tiddlerTitle.classList.remove("krystal-tiddler__title--end-active");
      }
    });
  }
})();
