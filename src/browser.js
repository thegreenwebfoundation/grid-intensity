import GridIntensity from './gridintensity'

GridIntensity.prototype.getLocalStoragePolyFill = function () {
  return localStorage
}
GridIntensity.prototype.getFetch = function () {
  return fetch
}

export { GridIntensity }
