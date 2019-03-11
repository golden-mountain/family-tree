import * as d3 from 'd3';
import Node from './node';
import Hierarchy from './hierachy';
import Line from './line';

export default class Tree {

  constructor(data = {}, props = {}) {
    this._props = props;
    this._data = data;
    this.load();
  }

  get props() {
    return this._props;
  }

  get width() {
    if (this._props.canvasSetting) {
      return this._props.canvasSetting.width;
    }
    return 960;
  }

  get height() {
    if (this._props.canvasSetting) {
      return this._props.canvasSetting.height;
    }
    return 600;
  }

  get selector() {
    if (this._props.selector) {
      return this._props.selector;
    }
    return 'body';
  }

  get margin() {
    if (this._props.canvasSetting) {

      let {
        margin
      } = this._props.canvasSetting;

      return margin;
    }
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    };
  }

  get zoom() {
    return this._props.zoom || {
      transform: () => {
        this.canvas.attr('transform', d3.event.transform);
      },
      minScale: 0.1,
      maxScale: 1
    };
  }

  get data() {
    return this._data;
  }

  get canvas() {
    return this._svg;
  }

  get node() {
    return this._node;
  }

  get animationTimeout() {
    return 750;
  }

  get hierarchy() {
    return this._hierarchy;
  }

  get mappedData() {
    return this._mappedData;
  }

  _initCavas() {
    if (!this.selector) {
      this._props.selector = 'body';
    }

    this._svg = d3.select(this.selector)
      .append('svg');

    this._svg
      .attr('width', this.width + this.margin.right + this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    this._svg.call(this._initZoom());

    // add first element, a 'g'
    this._svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  _initZoom() {
    let zoomed = this.zoom.transform || function () {
      this._svg.attr('transform', d3.event.transform);
    };

    this._zoom = d3.zoom()
      .scaleExtent([this.zoom.minScale, this.zoom.maxScale])
      .on('zoom', zoomed);
    return this._zoom;
  }

  load() {
    this._initCavas();
    this._hierarchy = new Hierarchy(this);
    this._treemap = d3.tree().size([this.width, this.height]);
    this._mappedData = this._treemap(this._hierarchy.instance);

    // generate nodes
    this._node = new Node(this);
    this._node.load();

    // generate lines
    this._line = new Line(this);
    this._line.load(this.hierarchy.instance);
  }

}
