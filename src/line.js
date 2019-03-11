export default class Line {
  constructor(tree) {
    this._name = 'Line';
    this._tree = tree;
  }

  get name() {
    return this._name;
  }

  get links() {
    return this._tree.mappedData.descendants().slice(1);
  }

  _diagonal(s, d) {
    let y = (s.y + d.y) / 2;
    let line1 = `M${s.x},${s.y - this._tree.node.width / 2}
      L${s.x},${y} ${d.x},${y} ${d.x},${d.y + this._tree.node.height / 2}`;

    return line1;
  }

  load(previousNode) {
    // Update the links...
    let link = this._tree.canvas.selectAll('path.link')
      .data(this.links, function (d) {
        return d.id;
      });

    // Enter any new links at the parent's previous position.
    let linkEnter = link.enter();

    linkEnter.insert('path', 'g')
      .attr('class', 'link')
      .attr('d', (d) => {
        let o = {
          x: previousNode.x0,
          y: previousNode.y0
        };

        return this._diagonal(o, o);
      });

    // UPDATE
    let linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
      .duration(this._tree.animationTimeout)
      .attr('d', (d) => {
        return this._diagonal(d, d.parent);
      });

    // Remove any exiting links
    let linkExit = link.exit();

    linkExit.transition()
      .duration(this._tree.animationTimeout)
      .attr('d', function (d) {
        let o = {
          x: previousNode.x,
          y: previousNode.y
        };

        return this._diagonal(o, o);
      })
      .remove();
  }
}
