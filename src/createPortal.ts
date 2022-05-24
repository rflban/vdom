import {
  Component,
  createElement,
  Fragment,
  VirtualElement,
  render,
  Ref,
  RefTypes,
  unmountFromDOM,
} from './all';

interface PortalOutProps {
  ref?: Ref<RefTypes>;
}

interface PortalEntryProps {
  parentDOM: HTMLElement;
}

class PortalOut extends Component {
  render() {
    const {
      children,
    } = this.props;

    return createElement(Fragment, {}, this.props.children);
  }
}

class PortalEntry extends Component<PortalEntryProps> {
  private readonly outRef = new Ref<PortalOut>();

  didMount() {
    const {
      parentDOM,
      children,
    } = this.props;

    render(
      createElement(PortalOut, { ref: this.outRef }, children),
      parentDOM,
    );
  }

  didUpdate(_snapshot: any) {
    const { instance: portalOut } = this.outRef;
    portalOut.props.children = this.props.children;
    portalOut.enqueueUpdate();
  }

  willUmount() {
    const {
      parentDOM,
    } = this.props;

    unmountFromDOM(parentDOM);
  }

  render() {
    return createElement(Fragment, {}, []);
  }
}

export default function createPortal(vNode: VirtualElement, parentDOM: HTMLElement): VirtualElement {
  return createElement(PortalEntry, { parentDOM }, [vNode]);
}
