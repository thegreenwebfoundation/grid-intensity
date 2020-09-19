import gridIntensity from "./index"
import debugLib from "debug"
const debug = debugLib("tgwf:test:gridIntensity")


// not sure how to mock this, so using an array here as it's the slowest part of the test
describe("GridIntensity", () => {
  describe("fetching intensity data", () => {
    test.todo("fetches data on instantion, if nothing is available locally")
    test.todo("uses a local store when created if available")
    test.todo("makes new request for data if local store is out of date")
  })
  describe("exposing intensity data API", () => {
    test.todo("returns high carbonindex value")
    test.todo("returns medium carbonindex value")
    test.todo("returns low carbonindex value")
  })
  describe("updating carbon index over time", () => {
    test.todo("updates result every 30 mins, based on local store of data")
  })
})
