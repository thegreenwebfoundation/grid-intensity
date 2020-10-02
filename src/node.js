import { LocalStorage } from 'node-localstorage'

import GridIntensity from './gridIntensity'

GridIntensity.prototype.localStorage = new LocalStorage('./scratch')

export default GridIntensity
