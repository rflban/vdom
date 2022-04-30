import VirtualElement from './VirtualElement';
import StringWrapper from './StringWrapper';

export default function cloneElement(vNode: VirtualElement | StringWrapper, additionalProps?: any): VirtualElement | StringWrapper {
  if (vNode instanceof StringWrapper) {
    return new StringWrapper(vNode.data);
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
