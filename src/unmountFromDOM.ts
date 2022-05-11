import { removeVNodeFromDom } from './patchNode';

export default function (rootDOM: HTMLElement): void {
  const componentsContainer = (rootDOM as any).componentsContainer;

  if (componentsContainer) {
    componentsContainer.forEach((c: any) => {
      removeVNodeFromDom(c.props.vNode);
    });
  }
}
