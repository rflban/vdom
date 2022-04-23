import Component from './Component';

export type RefTypes = HTMLElement | Component;

export default class Ref<T extends RefTypes> {
  public instance: T;
}
