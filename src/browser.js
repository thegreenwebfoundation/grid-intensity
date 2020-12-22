// 3rd party / native libs

// local to this project
import GridIntensityMixin from "./gridIntensity"
import settings from "./defaultSettings"

// set up our objects
const GridIntensity = Object.create(GridIntensityMixin)

GridIntensity.fetch = fetch
GridIntensity.localStorage = localStorage
GridIntensity.data = []
GridIntensity.intensityProvider = settings.uk

export default GridIntensity

