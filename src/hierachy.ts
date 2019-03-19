import * as d3 from 'd3';

export default class Hierarchy {
  public readonly name = 'Hierarchy';
  public instance: any;

  private data: any;

  constructor(public tree: ITree) {
    this.data = this.tree.data;
    this.instance = this.createInstance();
  }

  createInstance() {
    const hierarchy: any = d3.hierarchy(this.data, function (d) {
      return d.children;
    });

    hierarchy.x0 = this.tree.props.canvas.width / 2;
    hierarchy.y0 = 0;

    let showDepth = 3;

    hierarchy.descendants().forEach((d: any, i: number) => {
      d._children = d.children;
      if (d.depth > showDepth - 2) d.children = null;
    });
    return hierarchy;
  }
}
