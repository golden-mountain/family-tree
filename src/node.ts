import Events from './events';

export default class Node implements INode {
  public readonly name: string = 'Node';

  public props: INodeProps;

  private dataNodes: any;
  // private dataLinks: any;
  private treeNodes: any;
  private domNodes: any;
  private index: number;

  constructor(private tree: ITree) {
    this.dataNodes = this.tree.mappedHierarchy.descendants();
    // this.dataLinks = this.dataNodes.slice(1);
    this.props = this.tree.props.node;
  }

  private initNodes(previousNode: any): void {
    // init depth
    this.dataNodes.forEach((d: any) => {
      d.y = d.depth * this.props.depth;
    });

    this.treeNodes = this.tree.canvas.selectAll(`${this.props.selector}.${this.props.klass}`)
      .data(this.dataNodes, (d: any) => {
        return d.id || (d.id = ++this.index);
      });
    this.enterNodes(previousNode);
    this.appendLabels();
    this.appendExpander();

    let nodeUpdate = this.domNodes.merge(this.treeNodes);

    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(this.tree.props.animationTimeout)
      .attr('transform', (d: any) => {
        // TO FIX: Crashed on UT use this line
        return `translate(${d.x - this.props.width / 2},${d.y})`;
        // return `translate(${d.x},${d.y})`;
      });

    // Store the old positions for transition.
    this.dataNodes.forEach((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  private enterNodes(previousNode: any): void {
    this.domNodes = this.treeNodes.enter().append(this.props.selector)
      .attr('class', this.props.klass)
      .attr('transform', (d: any) => {
        return `translate(${previousNode.x0},${previousNode.y0})`;
      });

    let rects = this.domNodes.append('rect');

    // append attrs
    for (let key in this.props.attrs) {
      rects.style(key, this.props.attrs[key]);
    }

    // append styles
    for (let key in this.props.styles) {
      rects.style(key, this.props.styles[key]);
    }
  }

  private appendLabels(): void {
    const texts = this.domNodes.append('text');

    // append styles
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
        return `translate(${this.props.width / 2},${this.props.height + 5})`;
      })
      .on('click', this.tree.events.expandingChildren);

    const circleExpanders = expander.append(this.props.expander.selector);
    // append attrs
    for (let key in this.props.expander.attrs) {
      circleExpanders.attr(key, this.props.label.attrs[key]);
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
    expanderText.text('+');

    return expander;
  }

  private registerExit(previousNode: any): void {
    const nodeExit = this.treeNodes.exit().transition()
      .duration(this.tree.props.animationTimeout)
      .attr('transform', (d: any) => {
        return `translate(${previousNode.x - this.props.width / 2},${previousNode.y - this.props.height / 2})`;
      })
      .remove();

    nodeExit.select('text')
      .style('fill-opacity', 1e-6);
  }

  load(previousNode: any) {
    const preNode = previousNode || this.tree.hierarchy.instance;

    this.initNodes(preNode);
    this.registerExit(preNode);
  }

}
