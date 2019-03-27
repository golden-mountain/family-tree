import * as d3 from 'd3';

export default class Link {
  public name: 'Link';

  public props: ILinkProps = {}

  constructor(private tree: ITree) {
    this.props = this.tree.props.link;
  }

  private straightLine(source: any, target: any) {
    let y = (source.y + target.y) / 2 + this.tree.props.node.attrs.height / 2;
    let diagonal = `M${source.x},${source.y}
    L${source.x},${y} L${target.x},${y} L${target.x},
    ${target.y + this.tree.props.node.attrs.height + this.tree.props.node.expander.attrs.r * 2}`;

    return diagonal;
  }

  curveLine(source: any, target: any) {
    let data = {
      source,
      target: {
        x: target.x,
        y: target.y + this.tree.props.node.attrs.height + this.tree.props.node.expander.attrs.r
      }
    };

    let link: any = d3.linkHorizontal()
      .x(function (d: any) {
        return d.x;
      })
      .y(function (d: any) {
        return d.y;
      });

    return link(data);
  }

  diagonal(source: any, target: any, type = 'straight') {
    let map: any = {
      straight: this.straightLine,
      curve: this.curveLine
    };
    let typeFunc = map[type] || 'straight';

    return typeFunc.call(this, source, target);
  }

  load(previousNode: any, links: any) {
    // Update the links...
    const link = this.tree.nodeCanvas.selectAll('path.link')
      .data(links, function (d: any) {
        return d.id;
      });

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().insert('path');
    // append attrs
    for (const key in this.props.attrs) {
      linkEnter.attr(key, this.props.attrs[key]);
    }
    linkEnter.attr('d', (d: any) => {
      const o = {
        x: previousNode.x0,
        y: previousNode.y0
      };
      // console.log(d);
      return this.diagonal(o, o);
    });

    // append attrs
    for (const key in this.props.styles) {
      linkEnter.style(key, this.props.styles[key]);
    }

    // UPDATE
    const linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(this.tree.props.animationTimeout)
      .attr('d', (d: any) => {
        return this.diagonal(d, d.parent);
      });

    // Remove any exiting links
    const linkExit = link.exit();

    linkExit
      .transition()
      .duration(this.tree.props.animationTimeout)
      .attr('d', (d: any) => {
        const source = {
          x: previousNode.x,
          y: previousNode.y
        };

        const target = {
          x: previousNode.x,
          y: previousNode.y - this.tree.props.node.attrs.height - this.tree.props.node.expander.attrs.r
        };

        return this.diagonal(source, target);
      })
      .remove();
  }
}
