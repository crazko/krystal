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
    const listElementIndex = this.listWidget.findListItem(0, historyInfo.title);

    if (listElementIndex === undefined) {
      return;
    }

    const listItemWidget = this.listWidget.children[listElementIndex];
    const targetElement = listItemWidget.findFirstDomNode();

    // Abandon if the list entry isn't a DOM element (it might be a text node)
    if (!(targetElement instanceof Element)) {
      return;
    }

    // Scroll the node into view
    this.listWidget.dispatchEvent({
      type: "tm-scroll",
      target: targetElement,
    });
  };

  HorizontalStoryView.prototype.insert = function (widget) {
    const duration = $tw.utils.getAnimationDuration();

    if (duration) {
      const targetElement = widget.findFirstDomNode();

      // Abandon if the list entry isn't a DOM element (it might be a text node)
      if (!(targetElement instanceof Element)) {
        return;
      }

      const currWidth = targetElement.offsetWidth;

      setTimeout(() => (targetElement.style.cssText = ""), duration);

      // Set up the initial position of the element
      $tw.utils.setStyle(targetElement, [
        { transition: "none" },
        { transform: "scale(0.85)" },
        { opacity: "0" },
        { marginLeft: `-${currWidth}px` },
      ]);

      $tw.utils.forceLayout(targetElement);

      // Transition to the final position
      $tw.utils.setStyle(targetElement, [
        {
          transition: `opacity ${duration}ms ${easing}, margin ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
        },
        { transform: "scale(1)" },
        { opacity: "1" },
        { marginLeft: "0" },
      ]);
    }
  };

  HorizontalStoryView.prototype.remove = function (widget) {
    const duration = $tw.utils.getAnimationDuration();

    this.listWidget.dispatchEvent({
      type: "tm-remove",
    });

    if (duration) {
      const targetElement = widget.findFirstDomNode();
      const removeElement = () => widget.removeChildDomNodes();

      // Abandon if the list entry isn't a DOM element (it might be a text node)
      if (!(targetElement instanceof Element)) {
        removeElement();
        return;
      }

      const currWidth = targetElement.offsetWidth;

      // Remove the dom nodes of the widget at the end of the transition
      setTimeout(removeElement, duration);

      // Animate the closure
      $tw.utils.setStyle(targetElement, [
        { transition: "none" },
        { transform: "scale(1)" },
        { opacity: "1" },
        { marginLeft: "0" },
      ]);

      $tw.utils.forceLayout(targetElement);

      $tw.utils.setStyle(targetElement, [
        {
          transition: `opacity ${duration}ms ${easing}, margin ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
        },
        { transform: "scale(0.85)" },
        { marginLeft: `-${currWidth}px` },
        { opacity: "0" },
      ]);
    } else {
      widget.removeChildDomNodes();
    }
  };

  exports.horizontal = HorizontalStoryView;
})();
