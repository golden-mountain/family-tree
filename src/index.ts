import Tree from './tree';

declare global {
  interface Window { Tree: any; }
}

window.Tree = Tree || {};

export default Tree;
