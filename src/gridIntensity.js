import debugLib from 'debug'
const debug = debugLib('tgwf.GridIntensity')

class NoMoreIntervalsError extends Error { }

const GridIntensityMixin = {
  /**
   * Populate the local cache with carbon intensity
   * data, ready for queries.
   */
  async setup() {
    this.data = this.getLocalIntensityData()

    if (this.data.length < 1) {
      debug("setup")
      this.data = await this.fetchIntensityData()
    }
  },
  /**
   * Fetch cached carbon intensity data, returning
   * an array of carbon intensity objects, or an empty
   * array if nothing present
   */
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
  /**
   * Return next 30 minute interval from the list of 30 minute
   * intervals containing carbon intensity data, based on the
   * date in the object passed in. Returns the next date based
   * on the current time if no data provided
   */
  getNextInterval(options) {

    debug("getNextInterval")

    let now
    let nextInterval = null
    if (options && options.checkDate) {
      now = options.checkDate
    } else {
      now = new Date()
    }
    // loop forward through the intervals, and checkin if the time now is
    // greater, and return the first one to be greater than now, AND less than
    // 31mins ahead too
    for (const inter of this.data.data) {
      debug({ inter })
      debug({ to: inter.to })
      const until = Date.parse(inter.to)

      if (until > now) {
        nextInterval = inter
      }
    }
    if (!nextInterval) {
      throw new NoMoreIntervalsError("We didn't find any more intervals left to interate through");
    }
    return nextInterval
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
    debug("getReadingForInterval")
    try {
      let latestReading = this.getNextInterval({ checkDate: requiredDate })
      debug({ latestReading })
      // return latestReading.intensity.index
    } catch (err) {
      if (err instanceof NoMoreIntervalsError) {
        debug(`No intervals found locally later than ${requiredDate}`)
      } else {
        debug(e)
      }
      return null
    }

    if (!latestReading) {
      // fetch new data, and try again
      debug("Trying the API to fetch for new grid intensity data")
      let newIntervals
      try {
        newIntervals = await this.fetchIntensityData()
        let storage = this.localStorage
        storage.setItem("gridIntensityData", JSON.stringify(newIntervals))
        this.data = newIntervals
      } catch (err) {
        debug("err", e)
      }

      debug({ requiredDate })
      latestReading = this.getNextInterval({ checkDate: requiredDate })
    }
    debug({ latestReading })

    const latestReadingDate = Date.parse(latestReading.to)

    if (requiredDate > latestReadingDate) {
      // fetch new data, as this out of date
      try {
        this.data = await this.fetchIntensityData()
        latestReading = this.data.data[0]
      } catch (err) {
        console.error("problem fetching latest reading")
        console.error(err)
      }


    }
    return latestReading
  },
  /**
   * Build and return the url for sending a fetch() request to the chosen provider
   */
  buildFetchUrl() {
    const now = new Date()
    const [before, after] = this.intensityProvider.api.forwardLooking.split(
      "{from}"
    )
    return `${before}${now.toISOString()}${after}/`
  },
  /**
   * Fetch the carbon index for the time interval in the options
   * provided
   * Returns a string, describing the carbon intensity
   */
  async getCarbonIndex(options) {
    let now = this.getInterval(options)
    try {
      const latestReading = await this.getReadingForInterval(now)
      debug({ latestReading })
      return latestReading
    } catch (err) {
      debug("Problem fetching the reading for interval", now)
      console.error(err)

    }
  }

}

export default GridIntensityMixin
