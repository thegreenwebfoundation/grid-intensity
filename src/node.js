import fetch from "cross-fetch"
import { LocalStorage } from "node-localstorage"
import settings from "./defaultSettings"

import GridIntensityMixin from "./gridIntensity"

const localStorage = new LocalStorage("./scratch")

const GridIntensity = Object.create(GridIntensityMixin)

GridIntensity.fetch = fetch
GridIntensity.localStorage = localStorage
GridIntensity.data = []
GridIntensity.intensityProvider = settings.uk

GridIntensity.fetchIntensityData = async function fetchIntensityData() {
  const now = new Date()
  const [before, after] = this.intensityProvider.api.forwardLooking.split(
    "{from}"
  )
  const urlString = `${before}${now.toISOString()}${after}/`
  let res = await this.fetch(urlString)
  this.data = await res.json()
  return this.data
}

export default GridIntensity
