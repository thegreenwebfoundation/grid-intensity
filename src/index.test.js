import del from 'del'
import GridIntensity from './node'

// not sure how to mock this, so using an array here as it's the slowest part of the test
describe('GridIntensity', () => {
  let fakeData
  beforeEach(() => {
    fakeData =
      '{"data":[{"from":"2020-09-19T11:30Z","to":"2020-09-19T12:00Z","intensity":{"forecast":83,"actual":85,"index":"low"}}]}'
  })

  describe('fetching intensity data', () => {
    test('fetches data on instantion, if nothing is available locally', async () => {
      await del(['scratch'])
      const grid = new GridIntensity()

      grid.fetchIntensityData = jest.fn((x) => {
        return fakeData
      })
      await grid.setup()

      // expect the fetch API to be called
      expect(grid.fetchIntensityData).toHaveBeenCalled()
    })
    test('fetches data on instantion, recovers gracefully when no data from API', async () => {
      await del(['scratch'])
      const grid = new GridIntensity()

      grid.fetchIntensityData = jest.fn((x) => {
        return Promise.resolve([])
      })
      await grid.setup()

      // expect the fetch API to be called
      expect(grid.fetchIntensityData).toHaveBeenCalled()
    })

    test('uses a local store when created if available', async () => {
      const grid = new GridIntensity()
      grid.data = fakeData
      grid.getLocalIntensityData = jest.fn((x) => {
        return fakeData
      })
      grid.fetchIntensityData = jest.fn()

      grid.setup()
      expect(grid.fetchIntensityData).toHaveBeenCalledTimes(0)
      expect(grid.getLocalIntensityData).toHaveBeenCalledTimes(1)
      // console.log("indtensityDAta", grid.getLocalIntensityData())
      expect(grid.getLocalIntensityData).toHaveLength(1)
    })

    test('uses data from local store when present', async () => {
      const grid = new GridIntensity()
      grid.data = fakeData
      grid.getLocalIntensityData = jest.fn((x) => {
        return fakeData
      })
      grid.fetchIntensityData = jest.fn()

      grid.setup()
    })

    test('recovers gracefully when no data from localstorage', async () => {
      const grid = new GridIntensity()

      grid.getLocalIntensityData = jest.fn((x) => {
        return Promise.resolve([])
      })
      await grid.setup()

      // expect the fetch API to be called
      expect(grid.getLocalIntensityData).toHaveBeenCalled()
    })

    test('makes new request for data if local store is out of date', () => {
      // arrange
      const grid = new GridIntensity()
      grid.data = JSON.parse(fakeData)
      grid.fetchIntensityData = jest.fn((x) => {
        return Promise.resolve(JSON.parse(fakeData))
      })

      // act
      grid.getCarbonIndex()

      // assert
      expect(grid.fetchIntensityData).toHaveBeenCalled()
    })
  })
  describe('exposing intensity data API', () => {
    let grid, data
    beforeEach(() => {
      grid = new GridIntensity()
      data = JSON.parse(fakeData)
      grid.fetchIntensityData = jest.fn((x) => {
        return Promise.resolve(data)
      })
    })

    test('returns high carbonindex value', async () => {
      // arrange
      data.data[0].intensity.index = 'high'
      grid.data = data
      // act
      const result = await grid.getCarbonIndex({
        checkDate: Date.parse('2020-09-19T11:40Z')
      })

      // assert
      expect(result).toBe('high')
      expect(grid.fetchIntensityData).toHaveBeenCalledTimes(0)
    })
    test('returns medium carbonindex value', async () => {
      // arrange
      data.data[0].intensity.index = 'med'
      grid.data = data
      // act

      const result = await grid.getCarbonIndex({
        checkDate: Date.parse('2020-09-19T11:40Z')
      })

      // assert
      expect(result).toBe('med')
      expect(grid.fetchIntensityData).toHaveBeenCalledTimes(0)
    })
    test('returns low carbonindex value', async () => {
      // arrange
      data.data[0].intensity.index = 'low'
      grid.data = data
      // act
      const result = await grid.getCarbonIndex({
        checkDate: Date.parse('2020-09-19T11:40Z')
      })

      // assert
      expect(result).toBe('low')
      expect(grid.fetchIntensityData).toHaveBeenCalledTimes(0)
    })
  })
  describe('fetching next intensity interval', () => {
    let grid, data
    beforeEach(() => {
      grid = new GridIntensity()
      data = JSON.parse(fakeData)
      // grid.fetchIntensityData = jest.fn()
    })

    test('returns the next valid interval when present', async () => {
      grid.data = data
      // act
      const now = Date.parse('2020-09-19T11:40Z')
      const result = await grid.getNextInterval({
        checkDate: now
      })

      // assert
      // is the next interval less than 31 miutes ahead?
      // const minutesAhead = Interval.fromDateTimes(now, to).toDuration('minutes').toObject().minutes
      // expect(minutesAhead).toBeLessThan(31)
      // expect(minutesAhead).toBeGreaterThan(0)
      // is the interval ahead
    })
  })
})
