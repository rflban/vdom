import VirtualElement from './VirtualElement';
import Ref, { RefTypes } from './Ref';
import StringWrapper from './StringWrapper';

export default function createElement(
  type: string | Function,
  props: any = {},
  ...children: Array<any>
): VirtualElement {
  const { key, ref, ...restProps } = (props ?? {}) as unknown as { key?: string; ref?: Ref<RefTypes> };
  const vChildren: Array<VirtualElement | StringWrapper | Function > = children.flat().filter((child) => child).map((child) => {
    if (child instanceof VirtualElement) {
      return child;
    }
    if (typeof child === 'function') {
      return child;
    }

    return new StringWrapper(child.toString());
  });
  return new VirtualElement(type, restProps, vChildren, key, ref);
}
