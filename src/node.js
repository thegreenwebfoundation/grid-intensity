// 3rd party / native libs
import fetch from "cross-fetch"
import debugLib from 'debug'
import { LocalStorage } from "node-localstorage"

// local to this project
import settings from "./defaultSettings"
import GridIntensityMixin from "./gridIntensity"
const debug = debugLib('tgwf.Gridintensity.node')
// set up our objects
const localStorage = new LocalStorage("./scratch")
const GridIntensity = Object.create(GridIntensityMixin)

GridIntensity.localStorage = localStorage
GridIntensity.data = []
GridIntensity.intensityProvider = settings.uk

GridIntensity.fetchIntensityData = async function() {
  debug("fetchIntensityData")
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
