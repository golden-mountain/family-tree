import * as d3 from 'd3';
import Hierarchy from './hierachy';
import Events from './events';

export default class Node {
  constructor(tree, props = {}) {
    if (!tree) {
      throw new Error('Can\'t use Node separately');
    }
    this._name = 'Node';
    this._tree = tree;
    this._props = props;
    this._index = 0;
    this._events = new Events(tree);
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

  get dataNodes() {
    return this.mappedData.descendants();
  }

  get dataLinks() {
    return this.dataNodes.slice(1);
  }

  get treeNodes() {
    return this._treeNodes;
  }

  get nodeRootSelector() {
    return this._props.nodeSelector || 'g';
  }

  get nodeClassName() {
    return this._props.nodeClassName || 'node';
  }

  get nodeStyles() {
    return this._props.nodeStyle || {
      'cursor': 'pointer',
      'fill': (d) => {
        if (d.data.gender !== 0) {
          return 'gray';
        }
        return 'pink';
      },
      'stroke': 'black',
      'stroke-width': 1,
      'fill-opacity': 0.5,
      'stroke-opacity': 0.3
    };
  }

  get nodeAttrs() {
    return this._props.nodeAttrs || {
      rx: 5,
      ry: 5,
      width: this.width,
      height: this.height
    };
  }

  get nodeLabelAttrs() {
    return this._props.nodeLabelAttrs || {
      'dx': '.35em',
      'x': (d) => {
        return this.width / 2 - 5;
      },
      'y': (d) => {
        return this.height / 2 - 5;
      },
      'text-anchor': (d) => {
        return 'middle';
      }
    };
  }

  get nodeText() {
    return this._props.nodeLabelText ||
      function (d) {
        return d.data.name;
      };
  }

  _initNodes(previousNode) {
    // init depth
    this.dataNodes.forEach((d) => {
      d.y = d.depth * this.depth;
    });

    this._treeNodes = this._tree.canvas.selectAll(`${this.nodeSelector}.${this.nodeClassName}`)
      .data(this.dataNodes, (d) => {
        return d.id || (d.id = ++this._index);
      });
    this._enterNodes(previousNode);
    this._appendLabels();
    this._appendExpander();

    let nodeUpdate = this._domNodes.merge(this._treeNodes);

    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(this._tree.animationTimeout)
      .attr('transform', (d) => {
        // TO FIX: Crashed on UT use this line
        // return `translate(${d.x - this.width / 2},${d.y - this.height / 2})`;
        return `translate(${d.x},${d.y})`;
      });

    // Store the old positions for transition.
    this.dataNodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  _enterNodes(previousNode) {
    this._domNodes = this._treeNodes.enter().append(this.nodeRootSelector)
      .attr('class', this.nodeClassName)
      .attr('transform', (d) => {
        return `translate(${previousNode.x0},${previousNode.y0})`;
      });

    let rects = this._domNodes.append('rect');

    // append attrs
    for (let key in this.nodeAttrs) {
      rects.style(key, this.nodeAttrs[key]);
    }

    // append styles
    for (let key in this.nodeStyles) {
      rects.style(key, this.nodeStyles[key]);
    }
  }

  _appendLabels() {
    const texts = this._domNodes.append('text');

    // append styles
    for (let key in this.nodeLabelAttrs) {
      texts.attr(key, this.nodeLabelAttrs[key]);
    }

    texts.text(this.nodeLabelText);
  }

  _appendExpander() {
    const expander = this._domNodes.append('g');

    expander
      .style('display', (d) => {
        if (d._children || d.children) {
          return 'block';
        }
        return 'none';
      })
      .attr('transform', (d) => {
        return `ranslate(${this.width / 2},${this.height + 5})`;
      })
      .on('click', this._events.expandingChildren);

    expander.append('circle')
      .attr('r', 5)
      .style('stroke', 'black')
      .style('stroke-width', 1)
      .style('fill', (d) => {
        // console.log(d.children, d.data.name);
        if (d._children === null) {
          return 'red';
        }
        return 'white';
      });

    expander.append('text')
      .attr('text-anchor', 'end')
      .attr('transform', () => {
        return 'translate(3.5,4.5)';
      })
      .text('+');

    return expander;
  }

  load(previousNode) {
    // to refact
    this._hierarchy = new Hierarchy(this);
    this._treemap = d3.tree().size([this.width, this.height]);
    this._mappedData = this._treemap(this._hierarchy.instance);
    // console.log(this._hierarchy.instance);
    this._initNodes(previousNode || this._hierarchy.instance);
    this._registerExit(previousNode);
  }

  _registerExit(previousNode) {
    let nodeExit = this._treeNodes.exit().transition()
      .duration(this._tree.animationTimeout)
      .attr('transform', (d) => {
        return `translate(${previousNode.x - this.width / 2},${previousNode.y - this.height / 2})`;
      })
      .remove();

    nodeExit.select('text')
      .style('fill-opacity', 1e-6);
  }
}
