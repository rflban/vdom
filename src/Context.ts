import VDom from './index';
import type { IComponentProps } from './IComponentProps';
import Fragment from './Fragment';
import { createElement } from './all';

export type ContextType<T> = {
  Provider: Function;
  Consumer: Function;
  defaultValue: T;
};

export const createContext = <T,>(defaultValue: T): ContextType<T> => {
  interface ProviderProps extends IComponentProps {
    value: T;
  }

  class Provider extends VDom.Component<ProviderProps> {
    render = (): VDom.VirtualElement => createElement(Fragment, {}, this.props.children);
  }

  class Consumer extends VDom.Component {
    static contextType = {
      Provider,
      defaultValue,
    };

    render = (): VDom.VirtualElement => {
      if (!this.props.children || this.props.children.length !== 1 || typeof this.props.children[0] !== 'function') {
        throw 'Context Consumer can accept only 1 function child';
      }

      return this.props.children[0](this.context);
    }
  }

  return {
    Provider,
    Consumer,
    defaultValue,
  };
};
