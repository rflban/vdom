import VirtualElement from './VirtualElement';
import patch from './patchNode';
import { ContextType } from './Context';
import StringWrapper from './StringWrapper';
import { Debounce } from './util';
import type { IComponentProps, IComponentPropsCommon } from './IComponentProps';
import cloneElement from './cloneElement';
import Ref, { RefTypes } from './Ref';

interface IComponentPropsInternal {
  parentDomNode: HTMLElement;
  leftSibling: HTMLElement;
  vNode: VirtualElement;
}

interface WithChildrenProps {
  children?: Array<VirtualElement | StringWrapper | Function>;
  ref?: Ref<RefTypes>;
}

export default abstract class Component<
  Props = {},
  State = any,
  Snapshot = any,
  ContextValueType = null,
> {
  public props: Props & WithChildrenProps;

  public node: HTMLElement | null;

  public state: State;

  public children: Array<VirtualElement | StringWrapper | Function>;

  public context: ContextValueType;

  private destructListeners: Array<() => void>;

  constructor(props: Props) {
    this.node = null;
    this.children = [];
    this.setProps(props);
    this.destructListeners = [];
    this.enqueueUpdate = this.enqueueUpdate.bind(this);
  }

  destruct(): void {
    this.destructListeners.forEach((listener) => listener());
    this.destructListeners.length = 0;
  }

  setProps(_props: Props): void {
    const props = _props as Props & IComponentPropsInternal & IComponentPropsCommon & IComponentProps;
    const { ref } = props;
    if (ref) {
      ref.instance = this as unknown as Component;
    }

    const context = Object.getPrototypeOf(this).constructor
      .contextType as ContextType<ContextValueType>;
    let curVNode: VirtualElement | null = props.vNode;

    if (context != null) {
      // console.log("!!!!!!!!!!!!!!!!!!!");
      while (curVNode) {
        // console.log(curVNode);
        if (curVNode.component != null) {
          if (Object.getPrototypeOf(curVNode.component).constructor === context.Provider) {
            // console.log("????");
            this.context = (curVNode.component as any).props.value as ContextValueType;
            break;
          }
        }

        curVNode = curVNode.parent;
      }

      if (curVNode == null) {
        this.context = context.defaultValue;
      }
    }

    this.props = props as Props & WithChildrenProps;
  }

  abstract render(): VirtualElement;

  renderAndCopy(): VirtualElement {
    return cloneElement(this.render()) as VirtualElement;
  }

  didMount(): void {}

  // eslint-disable-next-line no-unused-vars
  didUpdate(_snapshot: Snapshot | null): void {}

  willUmount(): void {}

  // eslint-disable-next-line no-unused-vars
  makeSnapshot(_prevProps: Props & WithChildrenProps, _prevState: State): Snapshot | null {
    return null;
  }

  setState(partialState: any): void {
    const prevState = this.state;
    this.state = { ...this.state, ...partialState };
    this.enqueueUpdate(this.props, prevState);
  }

  @Debounce(10)
  enqueueUpdate(prevProps?: Props, prevState?: State): void {
    let { props: _props } = this;
    let { state } = this;

    const curProps = _props as Props & IComponentPropsInternal & IComponentPropsCommon & IComponentProps;

    if (prevProps != null) {
      _props = prevProps;
    }
    if (prevState != null) {
      state = prevState;
    }

    const props = _props as Props & IComponentPropsInternal & IComponentPropsCommon & IComponentProps;

    const snapshot = this.makeSnapshot(props as Props & WithChildrenProps, state);

    const rendered = this.renderAndCopy();
    const oldVNode = curProps.vNode.children[0];
    const { parentDomNode, leftSibling } = curProps as IComponentPropsInternal;

    if (typeof oldVNode === 'function') {
      throw 'Component oldVNode can not be function';
    }

    rendered.parent = curProps.vNode;
    rendered.pos = 0;
    curProps.vNode.children[0] = rendered;

    patch({
      parentDomNode,
      leftSibling,
      newVNode: rendered,
      oldVNode,
    });

    // this.props.vNode.children[0] = rendered;
    this.didUpdate(snapshot);
  }
}
