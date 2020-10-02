import fetch from 'cross-fetch'
import { LocalStorage } from 'node-localstorage'

import GridIntensity from './gridIntensity'

const localStorage = new LocalStorage('./scratch')

GridIntensity.prototype.fetch = fetch
GridIntensity.prototype.localStorage = localStorage

export default GridIntensity
