// 3rd party / native libs
import debugLib from 'debug'

// local to this project
import GridIntensityMixin from "./gridIntensity"
import settings from "./defaultSettings"

// set up our objects
const GridIntensity = Object.create(GridIntensityMixin)
// const debug = debugLib('tgwf.Gridintensity.node')

GridIntensity.localStorage = window.localStorage
GridIntensity.data = []
GridIntensity.intensityProvider = settings.uk

GridIntensity.fetchIntensityData = async function () {
  const urlString = this.buildFetchUrl()
  try {
    const res = await fetch(urlString)
    this.data = await res.json()
  } catch (error) {
    console.error("Couldn't fetch new data. Doing nothing further")
    console.error(error)
  }
  return this.data
}

export default GridIntensity

