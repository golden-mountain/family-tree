import * as d3 from 'd3';

export default class Events {
  constructor(tree) {
    this._name = 'Events';
    this._tree = tree;
  }

  get name() {
    return this._name;
  }

  expandingChildren(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this._checkWidth(d);
    this._tree.node.load(d);
  }

  _checkWidth(d) {
    let currentCanvas = this._tree.canvas;
    var adjustedHeight = parseInt(d3.select('#map>svg').attr('height'), 10);
    // let adjustedHeight = parseInt(currentCanvas.attr('height'), 10);
    const margin = currentCanvas.margin;

    // currentWidth = currentCanvas.node().getBBox().width,
    setTimeout(function () {
      var newCanvas = currentCanvas,
        newHeight = newCanvas.node().getBBox().height,
        correctY = newCanvas.node().getBBox().y;

      if (newHeight > adjustedHeight) {
        currentCanvas.transition()
          .duration(currentCanvas.animationTimeout)
          .attr('transform', `translate(${margin.left},-${(newHeight - adjustedHeight)})`);
      } else {
        currentCanvas.transition()
          .duration(currentCanvas.duration)
          .attr('transform', `translate(${margin.left},${(-correctY + margin.top / 2)})`);
      }
    }, currentCanvas.duration);
  };
}
