import VirtualElement from './VirtualElement';
import StringWrapper from './StringWrapper';

export default function cloneElement(vNode: VirtualElement | StringWrapper | Function, additionalProps?: any): VirtualElement | StringWrapper | Function {
  if (vNode instanceof StringWrapper) {
    return new StringWrapper(vNode.data);
  }
  if (typeof vNode === 'function') {
    return vNode;
  }

  const { ref, key, ...props } = additionalProps ?? {};

  return new VirtualElement(
    vNode.type,
    {...vNode.props, ...props},
    vNode.children.map((child) => {
      return cloneElement(child);
    }),
    key ?? vNode.key,
    ref ?? vNode.ref,
  );
}
