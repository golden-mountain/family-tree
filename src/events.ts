import * as d3 from 'd3';

export default class Events {
  public readonly name: string = 'Events';

  constructor(public tree: ITree) {
  }

  expandingChildren(d: any) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }

    this.checkWidth(d);
    this.tree.node.load(d);
  }

  private checkWidth(d: any) {
    const currentCanvas = this.tree.nodeCanvas;
    const timeout = this.tree.props.animationTimeout;
    const adjustedHeight = parseInt(d3.select(this.tree.props.selector + '>svg').attr('height'), 10);
    // let adjustedHeight = parseInt(currentCanvas.attr('height'), 10);
    const margin = this.tree.props.canvas.margin;
    const height = this.tree.props.canvas.height;
    const width = this.tree.props.canvas.width;
    const center = width / 2;

    // currentWidth = currentCanvas.node().getBBox().width,
    setTimeout(function () {
      const newCanvas = currentCanvas,
        newHeight = newCanvas.node().getBBox().height,
        correctY = newCanvas.node().getBBox().y;

      if (newHeight > adjustedHeight) {
        // currentCanvas.attr('viewBox', `${margin.left} ${(newHeight - adjustedHeight)} ${width} ${height}`);
        currentCanvas.transition()
          .duration(timeout)
          .attr('viewBox', `${margin.left + center} ${(newHeight - adjustedHeight)} ${width} ${height}`)
          .attr('transform', `translate(${margin.left + center},-${(newHeight - adjustedHeight)})`);
      } else {
        currentCanvas.transition()
          .duration(timeout)
          .attr('viewBox', `${margin.left + center} -${(-correctY + margin.top / 2)} ${width} ${height}`)
          .attr('transform', `translate(${margin.left + center},${(-correctY + margin.top / 2)})`);
      }
    }, timeout);
  };
}
