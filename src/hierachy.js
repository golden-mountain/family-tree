import * as d3 from 'd3';

export default class Hierarchy {
  constructor(tree) {
    this._name = 'Hierarchy';
    this._tree = tree;
  }

  get name() {
    return this._name;
  }

  get data() {
    return this._tree.data || {};
  }

  get instance() {
    this._hierarchy = d3.hierarchy(this.data, function (d) {
      return d.children;
    });

    this._hierarchy.x0 = this._tree.width / 2;
    this._hierarchy.y0 = 0;

    let showDepth = 3;

    this._hierarchy.descendants().forEach((d, i) => {
      d._children = d.children;
      if (d.depth > showDepth - 2) d.children = null;
    });
    return this._hierarchy;
  }
}
