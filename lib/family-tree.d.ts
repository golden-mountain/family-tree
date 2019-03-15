declare interface IObject {
  readonly name: string;
}

/**
 * Tree Interface
 */
declare interface ITree extends IObject {
  data: any,
  props: ITreeProps,
  node: INode,
  hierarchy: IHierarchy,
  link: ILink,
  events: IEvents,
  // below are d3 objects
  zoom: any,
  treemap: any,
  canvas: any,
  mappedHierarchy: any,
  load: () => void
}

/**
 * Define the properties for Tree
 */
declare interface ITreeProps {
  canvas?: ICanvasProps,
  selector?: string,
  zoom?: IZoomProps,
  node?: INodeProps,
  link?: ILinkProps,
  animationTimeout?: number
}

declare interface INodeProps {
  width?: number,
  height?: number,
  radius?: number,
  depth?: number,
  selector?: string,
  klass?: string,
  styles?: any,
  attrs?: any,
  label?: ILabel,
  expander?: IExpander
}

declare interface ILabel {
  attrs?: any,
  text?: any
}

declare interface IMargin {
  left?: number,
  right?: number,
  top?: number,
  bottom?: number
}

/**
 * Define the props for Canvas
 */
declare interface ICanvasProps {
  width?: number,
  height?: number,
  margin?: IMargin
}

declare interface IEvents extends IObject {
  tree?: ITree,
  expandingChildren: (d: any) => void
}

/**
 * Expander interface
 */
declare interface IExpander {
  selector?: string,
  attrs?: any,
  styles?: any,
  text?: any
}

/**
 * Node Interface
 */
declare interface INode extends IObject {
  load: (previousNode?: any) => void
}

/**
 * Hierarchy Interface
 */
declare interface IHierarchy extends IObject {
  instance: any
}

/**
 * Zoom Interface
 */
declare interface IZoomProps {
  transform?: () => void,
  minScale?: number,
  maxScale?: number
}

/**
 * Link interface
 */
declare interface ILink extends IObject {
  props?: ILinkProps,
  load: (previousNode?: any) => void
}

/**
 * Link props interface
 */
declare interface ILinkProps {
  attrs?: any,
  styles?: any,
  selector?: string
}

