import { GridIntensity } from "./index"
import debugLib from "debug"
const debug = debugLib("tgwf:test:gridIntensity")


// not sure how to mock this, so using an array here as it's the slowest part of the test
describe("GridIntensity", () => {
  describe("fetching intensity data", () => {
    let fakeData

    beforeEach(() => {
      fakeData = '{"data":[{"from":"2020-09-19T11:30Z","to":"2020-09-19T12:00Z","intensity":{"forecast":83,"actual":85,"index":"low"}}]}'
    })

    test("fetches data on instantion, if nothing is available locally", async () => {
      const grid = new GridIntensity()

      grid.fetchIntensityData = jest.fn(x => {
        return Promise.resolve(fakeData)
      })
      await grid.setup()

      // expect the fetch API to be called
      expect(grid.fetchIntensityData).toHaveBeenCalled()
    })
    test("uses a local store when created if available", async () => {
      const grid = new GridIntensity()
      grid.data = fakeData
      grid.getLocalIntensityData = jest.fn(x => {
        return fakeData
      })
      grid.fetchIntensityData = jest.fn()

      grid.setup()
      expect(grid.fetchIntensityData).toHaveBeenCalledTimes(0)
      expect(grid.getLocalIntensityData).toHaveBeenCalledTimes(1)
    })
    test("makes new request for data if local store is out of date", () => {
      // arrange
      const grid = new GridIntensity()
      grid.data = JSON.parse(fakeData)
      grid.fetchIntensityData = jest.fn()

      // act
      grid.getCarbonIndex()

      console.log(grid.data.data.pop().to)
      // console.log(grid.data.data)
      console.log(new Date().toISOString())

      // assert
      expect(grid.fetchIntensityData).toHaveBeenCalled()
    })

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
