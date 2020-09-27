import GridIntensity from './browser'

async function main() {
  const grid = new GridIntensity()
  await grid.setup()
  const index = await grid.getCarbonIndex()
  console.log({ index })
  document.querySelector('.result').textContent = index
}


main()
