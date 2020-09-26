import fetch from 'cross-fetch';
import { LocalStorage } from 'node-localstorage'

import GridIntensity from './gridIntensity'

const localStorage = new LocalStorage('./scratch');

GridIntensity.prototype.getLocalStoragePolyFill = function () {
  return localStorage
}
GridIntensity.prototype.getFetch = function () {
  return fetch
}

export default GridIntensity
