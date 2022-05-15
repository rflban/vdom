interface Decorator {
  // eslint-disable-next-line no-unused-vars
  (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
}

export function Debounce(ms: number): Decorator {
  // eslint-disable-next-line func-names
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalFunc = descriptor.value;
    const timeoutIDProp = Symbol('timeoutIdProp');

    // eslint-disable-next-line no-param-reassign
    descriptor.value = function decorated(...args: any): void {
      if (this[timeoutIDProp] != null) {
        clearTimeout(this[timeoutIDProp]);
      }

      this[timeoutIDProp] = setTimeout((): void => {
        originalFunc.apply(this, args);
        this[timeoutIDProp] = null;
      }, ms);
    };

    return descriptor;
  };
}

/**
 * Merges specified objects into one
 * @param {...Object}
 * objs - objects to merge
 * @returns {Object}
 * Returns merged object
 * @example
 * zip({ name: 'a'}, {age: 5 });
 * // returns { name: 'a', age: '5' }
 * @example
 * zip({});
 * // returns {}
 * @example
 * zip({}, question: 'why?');
 * // returns { question: 'why?' }
 * @example
 * zip({question: 'why?'}, {question: 'who?'});
 * // returns { question: 'why?' }
 */
export const zip = (...objs: object[]): any => {
  return objs.reduce((acc, cur) => ({ ...cur, ...acc }), {});
};
