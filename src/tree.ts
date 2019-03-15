import * as d3 from 'd3';
import Node from './node';
import Hierarchy from './hierachy';
import Link from './link';
import Events from './Events';

export default class Tree implements ITree {
  public readonly name: string = 'Tree';
  public data: any = {};
  public props: ITreeProps = {
    selector: 'body',
    animationTimeout: 750,
    canvas: {
      width: 960,
      height: 600,
      margin: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    zoom: {
      transform: function (this: ITree) {
        this.canvas.attr('transform', d3.event.transform);
      },
      minScale: 0.1,
      maxScale: 1
    },
    link: {
      selector: 'path',
      attrs: {
        klass: 'link',
      },
      styles: {
        'fill': 'none',
        'stroke': '#ccc',
        'stroke-width': 2
      }
    },
    node: {
      width: 50,
      height: 30,
      radius: 5,
      depth: 120,
      selector: 'g',
      klass: 'node',
      styles: {
        'cursor': 'pointer',
        'fill': (d: any) => {
          if (d.data.gender !== 0) {
            return 'gray';
          }
          return 'pink';
        },
        'stroke': 'black',
        'stroke-width': 1,
        'fill-opacity': 0.5,
        'stroke-opacity': 0.3
      },
      attrs: {
        rx: 5,
        ry: 5,
        width: 50,
        height: 30
      },
      label: {
        attrs: {
          'dx': '.35em',
          'x': () => {
            return 50 / 2 - 5;
          },
          'y': () => {
            return 50 / 2 - 5;
          },
          'text-anchor': () => {
            return 'middle';
          },
        },
        text: (d: any) => d.data.name
      },
      expander: {
        selector: 'circle',
        attrs: {
          radius: 5,
        },
        styles: {
          'stroke': 'black',
          'stroke-width': 1,
          'fill': (d: any) => {
            // console.log(d.children, d.data.name);
            if (d._children === null) {
              return 'red';
            }
            return 'white';
          }
        },
        text: {
          attrs: {
            'text-anchor': 'end',
            'transform': () => {
              return 'translate(3.5,4.5)';
            }
          },
          text: '+'
        }
      }
    },
  }

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

    this.canvas
      .attr('width', this.props.canvas.width +
        this.props.canvas.margin.right + this.props.canvas.margin.left)
      .attr('height', this.props.canvas.height + this.props.canvas.margin.top +
        this.props.canvas.margin.bottom);

    this.canvas.call(this.initZoom());

    // add first element, a 'g'
    this.canvas.append('g')
      .attr('transform', `translate(${this.props.canvas.margin.left},
        ${this.props.canvas.margin.top})`);
  }

  private initZoom(): void {
    const zoomed = this.props.zoom.transform || function () {
      this.canvas.attr('transform', d3.event.transform);
    };

    this.zoom = d3.zoom()
      .scaleExtent([this.props.zoom.minScale, this.props.zoom.maxScale])
      .on('zoom', zoomed);
    return this.zoom;
  }

  public load(): void {
    this.initCavas();
    this.hierarchy = new Hierarchy(this);
    this.treemap = d3.tree().size([this.props.canvas.width, this.props.canvas.height]);
    this.mappedHierarchy = this.treemap(this.hierarchy.instance);

    // initial events
    this.events = new Events(this);

    // generate nodes
    this.node = new Node(this);
    this.node.load();

    // generate links
    // TO Fix: it should not depend on node
    this.link = new Link(this);
    this.link.load();
  }

}

