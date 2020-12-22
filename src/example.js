import GridIntensity from "./browser"

async function main() {
  const grid = Object.create(GridIntensity)
  await grid.setup(window.fetch)
  const index = await grid.getCarbonIndex()

  document.querySelector(".result").textContent = index
  document.querySelector("body").classList = []
  document.querySelector("body").classList.add(`${index}-grid-intensity`)
}

main()
