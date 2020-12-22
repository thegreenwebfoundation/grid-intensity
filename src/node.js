// 3rd party / native libs
import fetch from "cross-fetch"
import { LocalStorage } from "node-localstorage"

// local to this project
import settings from "./defaultSettings"
import GridIntensityMixin from "./gridIntensity"

// set up our objects
const localStorage = new LocalStorage("./scratch")
const GridIntensity = Object.create(GridIntensityMixin)

GridIntensity.fetch = fetch
GridIntensity.localStorage = localStorage
GridIntensity.data = []
GridIntensity.intensityProvider = settings.uk

export default GridIntensity
