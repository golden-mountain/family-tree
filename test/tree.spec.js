/* global describe, it, before */
import chai from 'chai';
import spies from 'chai-spies';
import {
  Tree
} from '../lib/family-tree.js';

chai.use(spies);
chai.expect();

const expect = chai.expect;

let tree;

describe('Create a Tree', () => {
  before(() => {
    tree = new Tree();
  });

  describe('When providing empty props', () => {
    it('should return the tree props with default value', () => {
      expect(tree.selector).to.deep.eql('body');
    });

    it('should have a public canvas created', () => {
      expect(tree.canvas).to.not.null;
    });

    it('should have default width and height', () => {
      expect(tree.canvas.attr('width')).to.equal('960');
      expect(tree.canvas.attr('height')).to.equal('600');
    });

    it('should not zoomable', () => {
      const spy = chai.spy.on(tree.canvas, 'call');

      expect(spy).to.have.not.been.called;
    });
  });

});

describe('Create a Tree', () => {
  let zoomed = function () {};
  let settings = {
    selector: '#tree',
    canvasSetting: {
      width: 960,
      height: 600,
      margin: {
        left: 10,
        right: 10,
        top: 20,
        bottom: 20
      }
    },
    zoom: {
      transform: zoomed,
      minScale: 0.1,
      maxScale: 1
    }
  };

  before(() => {
    tree = new Tree({}, settings);
    document.body.innerHTML = '<div id="tree">hola</div>';
  });

  describe('When providing some props', () => {
    it('should return the tree props with given value', () => {
      expect(tree.props).to.eql(settings);
    });

    it('should have the given width and height', () => {
      let {
        width,
        height,
        margin = {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      } = settings.canvasSetting;

      // console.log(tree);
      expect(parseInt(tree.canvas.attr('width'), 10)).to.equal(width + margin.right + margin.left);
      expect(parseInt(tree.canvas.attr('height'), 10)).to.equal(height + margin.top + margin.bottom);
    });

    it('should zoomable', () => {
      const spy = chai.spy.on(tree.canvas, 'call');

      expect(spy).to.have.been.called;
    });
  });

});
