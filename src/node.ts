import * as d3 from 'd3';
// import Events from './events';
// import Hierarchy from './hierachy';
import Link from './link';

export default class Node implements INode {
  public readonly name: string = 'Node';

  public props: INodeProps;

  private dataNodes: any;
  // private dataLinks: any;
  private treeNodes: any;
  private domNodes: any;
  private index: number = 0;

  constructor(private tree: ITree) {
    this.props = this.tree.props.node;
  }

  private initNodes(hierarchy: any): void {
    // init depth
    this.dataNodes.forEach((d: any) => {
      d.y = d.depth * this.props.depth;
      d.x0 = d.x;
      d.y0 = d.y;
    });

    this.enterNodes(hierarchy);
    this.appendLabels();
    this.appendExpander();

    let nodeUpdate = this.domNodes.merge(this.treeNodes);

    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(this.tree.props.animationTimeout)
      .attr('transform', (d: any) => {
        // TO FIX: Crashed on UT use this line
        return `translate(${d.x - this.props.attrs.width / 2},${d.y})`;
        // return `translate(${d.x},${d.y})`;
      });

  }

  private enterNodes(hierarchy: any): void {
    // const g = this.tree.canvas.append('g.nodes');
    this.treeNodes = this.tree.nodeCanvas.selectAll(`${this.props.selector}.${this.props.class}`)
      .data(this.dataNodes, (d: any) => {
        return d.id || (d.id = ++this.index);
      });

    this.domNodes = this.treeNodes.enter().append(this.props.selector)
      .attr('class', this.props.class)
      .attr('transform', (d: any) => {
        return `translate(${hierarchy.x0},${hierarchy.y0})`;
      });

    let rects = this.domNodes.append('rect');

    // append attrs
    for (let key in this.props.attrs) {
      rects.attr(key, this.props.attrs[key]);
    }
    // rects.attr('width', this.props.attrs.width);
    // rects.attr('height', this.props.attrs.height);

    // append styles
    for (let key in this.props.styles) {
      rects.style(key, this.props.styles[key]);
    }
  }

  private appendLabels(): void {
    const texts = this.domNodes.append('text');

    // append attrs
    for (let key in this.props.label.attrs) {
      texts.attr(key, this.props.label.attrs[key]);
    }

    texts.text(this.props.label.text);
  }

  private appendExpander(): any {
    const expander = this.domNodes.append(this.props.selector);

    expander
      .style('display', (d: any) => {
        if (d._children || d.children) {
          return 'block';
        }
        return 'none';
      })
      .attr('transform', (d: any) => {
        return `translate(${this.props.attrs.width / 2},${this.props.attrs.height + 5})`;
      })
      .on('click', this.tree.events.expandingChildren.bind(this.tree.events));

    const circleExpanders = expander.append(this.props.expander.selector);
    // append attrs
    for (let key in this.props.expander.attrs) {
      circleExpanders.attr(key, this.props.expander.attrs[key]);
    }

    // append styles
    for (let key in this.props.expander.styles) {
      circleExpanders.attr(key, this.props.expander.styles[key]);
    }

    const expanderText = expander.append('text');
    // append attrs
    for (let key in this.props.expander.text.attrs) {
      expanderText.attr(key, this.props.expander.text.attrs[key]);
    }
    expanderText.text(this.props.expander.text.text);

    return expander;
  }

  private registerExit(hierarchy: any): void {
    const nodeExit = this.treeNodes.exit().transition()
      .duration(this.tree.props.animationTimeout)
      .attr('transform', (d: any) => {
        return `translate(${hierarchy.x - this.props.attrs.width / 2},
          ${hierarchy.y})`;
      })
      .remove();

    nodeExit.select('text')
      .style('fill-opacity', 1e-6);
  }

  public load(hierarchy: any) {
    const treemap = d3.tree();
    // treemap.size([this.tree.props.canvas.width, this.tree.props.canvas.height]);
    treemap.nodeSize([100, 50]);
    treemap.separation(function (a, b) {
      return 1.2;
    });
    const mappedHierarchy = treemap(this.tree.hierarchy.instance);
    this.dataNodes = mappedHierarchy.descendants();

    // const preNode = hierarchy || this.tree.hierarchy.instance;
    this.initNodes(hierarchy);
    this.registerExit(hierarchy);

    // initial Link instance
    const link = new Link(this.tree);
    const links = mappedHierarchy.descendants().slice(1);
    link.load(hierarchy, links);
  }

}
