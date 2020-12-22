const GridIntensityMixin = {
  async setup() {
    this.data = this.getLocalIntensityData()

    if (this.data.length < 1) {
      this.data = await this.fetchIntensityData()
    }
  },
  getLocalIntensityData() {
    let storage = this.localStorage
    const intervalsString = storage.getItem("gridIntensityData")

    if (!intervalsString) {
      return []
    }

    // we have no local data - return early
    if (!intervalsString.length) {
      return []
    }

    // try to parse what we already have
    try {
      parsedIntervals = JSON.parse(intervalsString)
      console.debug({ parsedIntervals })
      return parsedIntervals
    } catch (err) {
      storage.setItem("gridIntensityData", [])
      return []
    }
  },
  getNextInterval(options) {
    // returns very next 30 minute interval from the list of intervals
    // loops forward through the intervals, checking it the time now is
    // greater, and returns the first one to be greater than now, AND less than
    // 31mins ahead too

    let now
    if (options && options.checkDate) {
      now = options.checkDate
    } else {
      now = new Date()
    }
    for (const inter of this.data.data) {
      const until = Date.parse(inter.to)

      if (until > now) {
        return inter
      }
    }
    return null
  },
  getInterval(options) {
    let now
    if (options && options.checkDate) {
      now = options.checkDate
    } else {
      now = new Date()
    }
    return now
  },

  async getReadingForInterval(requiredDate) {
    let latestReading
    latestReading = this.getNextInterval({ checkDate: requiredDate })
    if (!latestReading) {
      // fetch new data, and try again
      const newIntervals = await this.fetchIntensityData()
      let storage = this.localStorage
      storage.setItem("gridIntensityData", JSON.stringify(newIntervals))
      this.data = newIntervals
      latestReading = this.getNextInterval({ checkDate: requiredDate })
    }

    const latestReadingDate = Date.parse(latestReading.to)

    if (requiredDate > latestReadingDate) {
      // fetch new data, as this out of date
      this.data = await this.fetchIntensityData()
      latestReading = this.data.data[0]
    }
    return latestReading
  }
}

export default GridIntensityMixin
