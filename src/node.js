import * as d3 from 'd3';
import Hierarchy from './hierachy';

export default class Node {
  constructor(tree, props = {}) {
    if (!tree) {
      throw new Error('Can\'t use Node separately');
    }
    this._name = 'Node';
    this._tree = tree;
    this._props = props;
    this._index = 0;
  }

  get name() {
    return this._name;
  }

  get width() {
    return this._props.width || 30;
  }

  get height() {
    return this._props.height || 50;
  }

  get radius() {
    return this._props.radius || 12;
  }

  get depth() {
    return this._props.depth || 120;
  }

  get treemap() {
    return this._treemap;
  }

  get hierarchy() {
    return this._hierarchy;
  }

  get mappedData() {
    return this._mappedData;
  }

  get nodes() {
    return this.mappedData.descendants();
  }

  get links() {
    return this.nodes.slice(1);
  }

  get node() {
    return this._node;
  }

  _initNodes() {
    // init depth
    this.nodes.forEach((d) => {
      d.y = d.depth * this.depth;
    });
  }

  _enterNodes() {
    this._enteredNodes = this._node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d) => {
        return `translate(${this._hierarchy.x0},${this._hierarchy.y0})`;
      })
      .style('cursor', 'pointer');

    this._enteredNodes.append('rect')
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('width', this.width)
      .attr('height', this.height)
      .style('fill', (d) => {
        if (d.data.gender !== 0) {
          return 'gray';
        }
        return 'pink';
      })
      .style('stroke', 'black')
      .style('stroke-width', 1)
      .style('fill-opacity', 0.5)
      .style('stroke-opacity', 0.3);
  }

  load() {
    // to refact
    this._hierarchy = new Hierarchy(this);
    this._treemap = d3.tree().size([this.width, this.height]);
    this._mappedData = this._treemap(this._hierarchy.instance);
    this._initNodes();

    this._node = this._tree.canvas.selectAll('g.node')
      .data(this.nodes, (d) => {
        return d.id || (d.id = ++this._index);
      });

    this._enterNodes();
  }
}
