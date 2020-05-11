/*\
title: $:/plugins/rmnvsl/krystal/krystal.js
type: application/javascript
module-type: startup

Handles tiddlers position

\*/
(function () {
  $tw.modules.execute("$:/plugins/rmnvsl/krystal/tiddler.js");

  exports.startup = function () {
    $tw.rootWidget.addEventListener("tm-scroll", function (event) {
      if (event.type === "tm-scroll") {
        scroll(event.target);
      }
    });
  };

  function scroll(tiddlerElement) {
    var storyRiver = tiddlerElement.parentElement;

    var tiddlerPosition = Array.from(
      storyRiver.querySelectorAll("[data-tiddler-title")
    ).indexOf(tiddlerElement);
    var tiddlerWidth = tiddlerElement.offsetWidth;
    var windowWidth = window.innerWidth;

    var position = windowWidth / 2 - tiddlerWidth / 2;
    var newRiverPosition = Math.max(
      tiddlerPosition * tiddlerWidth - position,
      0
    );

    storyRiver.scroll({ left: newRiverPosition, behavior: "smooth" });
  }
})();
