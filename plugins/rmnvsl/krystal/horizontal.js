/*\
title: $:/plugins/rmnvsl/krystal/horizontal.js
type: application/javascript
module-type: storyview

Handles tiddlers position

\*/
(function () {
  var easing = "cubic-bezier(0.645, 0.045, 0.355, 1)"; // From http://easings.net/#easeInOutCubic

  var HorizontalStoryView = function (listWidget) {
    this.listWidget = listWidget;
  };

  HorizontalStoryView.prototype.navigateTo = function (historyInfo) {
    var duration = $tw.utils.getAnimationDuration();
    var listElementIndex = this.listWidget.findListItem(0, historyInfo.title);
    if (listElementIndex === undefined) {
      return;
    }
    var listItemWidget = this.listWidget.children[listElementIndex],
      targetElement = listItemWidget.findFirstDomNode();

    // Abandon if the list entry isn't a DOM element (it might be a text node)
    if (!(targetElement instanceof Element)) {
      return;
    }
    if (duration) {
      // Scroll the node into view
      this.listWidget.dispatchEvent({
        type: "tm-scroll",
        target: targetElement,
      });
    } else {
      targetElement.scrollIntoView();
    }
  };

  HorizontalStoryView.prototype.insert = function (widget) {
    var duration = $tw.utils.getAnimationDuration();
    if (duration) {
      var targetElement = widget.findFirstDomNode();
      // Abandon if the list entry isn't a DOM element (it might be a text node)
      if (!(targetElement instanceof Element)) {
        return;
      }
      var currWidth = targetElement.offsetWidth;

      setTimeout(function () {
        $tw.utils.setStyle(targetElement, [
          { transition: "none" },
          { width: "" },
        ]);
      }, duration);

      // Set up the initial position of the element
      $tw.utils.setStyle(targetElement, [
        { transition: "none" },
        { opacity: "0.0" },
        { marginLeft: `-${currWidth}px` },
      ]);
      $tw.utils.forceLayout(targetElement);
      // Transition to the final position
      $tw.utils.setStyle(targetElement, [
        {
          transition: `opacity ${duration}ms ${easing}, margin ${duration}ms ${easing}`,
        },
        { opacity: "1.0" },
        { marginLeft: "0" },
      ]);
    }
  };

  HorizontalStoryView.prototype.remove = function (widget) {
    var duration = $tw.utils.getAnimationDuration();
    if (duration) {
      var targetElement = widget.findFirstDomNode(),
        removeElement = function () {
          widget.removeChildDomNodes();
        };
      // Abandon if the list entry isn't a DOM element (it might be a text node)
      if (!(targetElement instanceof Element)) {
        removeElement();
        return;
      }
      // Get the current height of the tiddler
      var currWidth = targetElement.offsetWidth;

      // Remove the dom nodes of the widget at the end of the transition
      setTimeout(removeElement, duration);

      // Animate the closure
      $tw.utils.setStyle(targetElement, [
        { transition: "none" },
        { opacity: "1.0" },
        { marginLeft: "0" },
      ]);
      $tw.utils.forceLayout(targetElement);
      $tw.utils.setStyle(targetElement, [
        {
          transition: `opacity ${duration}ms ${easing}, margin ${duration}ms ${easing}`,
        },
        { marginLeft: `-${currWidth}px` },
        { opacity: "0.0" },
      ]);
    } else {
      widget.removeChildDomNodes();
    }
  };

  exports.horizontal = HorizontalStoryView;
})();
