import * as d3 from 'd3';

export default class Tree {

  constructor(props = {}) {
    this.props = props;
    this.init();
  }

  init() {
    if (!this.props.selector) {
      this.props.selector = 'body';
    }

    this.svg = d3.select(this.props.selector)
      .append('svg');

    if (this.props.canvasSetting) {
      let {
        width,
        height,
        margin = { left: 0, right: 0, top: 0, bottom: 0 }
      } = this.props.canvasSetting;

      this.svg
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom);

    } else {
      this.svg
        .attr('width', 960)
        .attr('height', 600);
    }

    if (this.props.zoom) {
      let zoomed = this.props.zoom.transform || function () {
        this.svg.attr('transform', d3.event.transform);
      };

      this.zoom = d3.zoom()
        .scaleExtent([this.props.zoom.minScale, this.props.zoom.maxScale])
        .on('zoom', zoomed);

      this.svg.call(this.zoom);
    }
  }

}
