import * as d3 from 'd3';

export default {
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
    // transform: () => {}
    minScale: 0.1,
    maxScale: 1
  },
  link: {
    selector: 'path',
    attrs: {
      class: 'link',
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
    class: 'node',
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
