import GridIntensity from './gridintensity'

GridIntensity.prototype.fetch = fetch
GridIntensity.prototype.localStorage = localStorage

// we need to override the function here because we otherwise get the error in browsers
// TypeError: 'fetch' called on an object that does not implement interface Window
GridIntensity.prototype.fetchIntensityData = async function () {

  const now = Date()
  const [before, after] = this.intensityProvider.api.forwardLooking.split("{from}")
  const urlString = `${before}${now.toISO()}${after}/`
  let res = await fetch(urlString)
  this.data = await res.json()
  return this.data
}

export default GridIntensity
