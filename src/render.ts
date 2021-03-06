import VirtualElement from './VirtualElement';
import patch from './patchNode';

export default function render(vNode: VirtualElement, root: HTMLElement): void {
  root.innerHTML = '';

  patch({
    newVNode: vNode,
    oldVNode: null,
    parentDomNode: root,
    leftSibling: null,
  });
}
