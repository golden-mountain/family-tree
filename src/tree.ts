import * as d3 from 'd3';
import Node from './node';
import Hierarchy from './hierachy';
import Events from './Events';

import treeProps from './tree.config';

export default class Tree implements ITree {
  public readonly name: string = 'Tree';
  public data: any = {};
  public props: ITreeProps = treeProps

  /**
   * Family Tree Objects
   */
  public node: INode;
  public hierarchy: IHierarchy;
  public link: ILink;
  public events: IEvents;

  /**
   * D3 shared objects
   */
  public zoom: any;
  public treemap: any;
  public canvas: any;
  public nodeCanvas: any;
  public navCanvas: any;
  public mappedHierarchy: any;

  constructor(data: object, props?: ITreeProps) {
    this.data = data;
    if (props) {
      this.props = props;
    }
    this.load();
  }

  private initCavas(): void {
    this.canvas = d3.select(this.props.selector)
      .append('svg');

    this.nodeCanvas = this.canvas.append('g.nodes');
    this.navCanvas = this.canvas.append('g.navigator');

    // append attrs
    for (const key in this.props.canvas.attrs) {
      this.canvas.attr(key, this.props.canvas.attrs[key]);
    }

    this.canvas
      .attr('width', this.props.canvas.width +
        this.props.canvas.margin.right + this.props.canvas.margin.left)
      .attr('height', this.props.canvas.height + this.props.canvas.margin.top +
        this.props.canvas.margin.bottom)
      .call(this.initZoom());

    // add first element, a 'g'
    this.nodeCanvas
      .attr('transform', `translate(${this.props.canvas.width / 2 + this.props.canvas.margin.left},
        ${this.props.canvas.margin.top})`);
  }

  /**
   * TO Fix: jump once drag
   */
  private initZoom() {
    //`${margin.left + center} ${(newHeight - adjustedHeight)} ${width} ${height}`
    // const margin = this.props.canvas.margin;
    // const height = this.props.canvas.height;
    // const width = this.props.canvas.width;
    // const extentScale: any = [[margin.left, margin.top], [width, height]];

    const zoomed = this.props.zoom.transform || function () {
      this.nodeCanvas.attr('transform', d3.event.transform);
    };

    this.zoom = d3.zoom()
      // .extent(extentScale)
      .scaleExtent([this.props.zoom.minScale, this.props.zoom.maxScale])
      // .translateExtent(extentScale)
      .on('zoom', zoomed.bind(this));
    return this.zoom;
  }

  public load(): void {
    this.initCavas();
    this.hierarchy = new Hierarchy(this);

    // initial events
    this.events = new Events(this);

    // generate nodes
    this.node = new Node(this);
    this.node.load(this.hierarchy.instance);
  }

}

