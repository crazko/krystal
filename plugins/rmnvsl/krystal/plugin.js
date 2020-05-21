/*\
title: $:/plugins/rmnvsl/krystal/plugin.js
type: application/javascript
module-type: startup

Sets plugin behavior

\*/
(function () {
  const STORY_TIDDLER_TITLE = "$:/StoryList";
  const ACTIVE_LINK_CLASS = "krystal-link--active";

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

    $tw.hooks.addHook("th-navigating", closing);

    $tw.wiki.addEventListener("change", highlight);
  };

  function highlight(changes) {
    if (!$tw.utils.hop(changes, STORY_TIDDLER_TITLE)) {
      return;
    }

    const config = $tw.wiki.getTiddler(
      "$:/plugins/rmnvsl/krystal/config/highlight"
    );

    if (config && config.fields && config.fields.text === "disable") {
      return;
    }

    const tiddlers = $tw.wiki.getTiddlerList(STORY_TIDDLER_TITLE);

    Array.from(
      document.querySelectorAll(`.${ACTIVE_LINK_CLASS}`)
    ).forEach((link) => link.classList.remove(ACTIVE_LINK_CLASS));

    tiddlers.forEach((tiddler) => {
      Array.from(
        document.querySelectorAll(
          `.tc-tiddler-body a[href="#${encodeURIComponent(tiddler)}"]`
        )
      ).forEach((link) => link.classList.add(ACTIVE_LINK_CLASS));
    });
  }

  function header() {
    const height = document.querySelector(".krystal-header").offsetHeight;
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

  function closing(event) {
    const storyTiddler = $tw.wiki.getTiddler(STORY_TIDDLER_TITLE);
    const tiddlers = $tw.wiki.getTiddlerList(STORY_TIDDLER_TITLE);

    const navigateFrom = event.navigateFromTitle;
    const navigateTo = event.navigateTo;

    const config = $tw.wiki.getTiddler(
      "$:/plugins/rmnvsl/krystal/config/close"
    );

    if (config && config.fields && config.fields.text === "disable") {
      return event;
    }

    // Navigating from outside open tiddlers
    if (!navigateFrom) {
      return event;
    }

    // Destination tiddler already open
    if (tiddlers.indexOf(navigateTo) === -1) {
      const currentTiddlerIndex = tiddlers.indexOf(navigateFrom);
      const tiddlersToClose = tiddlers.slice(currentTiddlerIndex + 1);

      if (tiddlersToClose.length === 0) {
        return event;
      }

      // Not working :(
      // tiddlersToClose.forEach((tiddlerTitle) => () =>
      //   $tw.rootWidget.dispatchEvent({
      //     type: "tm-close-tiddler",
      //     tiddlerTitle,
      //   })
      // );

      const newStoryList = tiddlers.filter(
        (title) => !tiddlersToClose.includes(title)
      );

      $tw.wiki.addTiddler(
        new $tw.Tiddler({ title: STORY_TIDDLER_TITLE }, storyTiddler, {
          list: newStoryList,
        })
      );
    }

    return event;
  }
})();
