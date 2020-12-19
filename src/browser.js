import GridIntensityMixin from "./gridintensity"

const GridIntensity = Object.create(GridIntensityMixin)

GridIntensity.fetch = fetch
GridIntensity.localStorage = localStorage
GridIntensity.data = []
GridIntensity.intensityProvider = settings.uk

GridIntensity.fetchIntensityData = async function () {
  const now = new Date()
  const [before, after] = this.intensityProvider.api.forwardLooking.split(
    "{from}"
  )
  const urlString = `${before}${now.toISOString()}${after}/`
  let res = await fetch(urlString)
  this.data = await res.json()
  return this.data
}

export default GridIntensity
