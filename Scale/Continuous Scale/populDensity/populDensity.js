const top10PopDensity = [
    {
      country: "Macao",
      density: 20777.5
    },
    {
      country: "Singapore",
      density: 7952.9
    },
    {
      country: "Hong Kong",
      density: 7096.1
    },
    {
      country: "Gibraltar",
      density: 3371.8
    },
    {
      country: "Baharain",
      density: 2017.2
    },
    {
      country: "Maldives",
      density: 1718.9
    },
    {
      country: "Malta",
      density: 1514.4
    },
    {
      country: "Bangladesh",
      density: 1239.5
    },
    {
      country: "Bermuda",
      density: 1183.7
    },
    {
      country: "Channel Islands",
      density: 861.1
    }
  ]

const svgWidth = d3.select('svg').node().clientWidth
const svgHeight = d3.select('svg').node().clientHeight
const dataLenght = top10PopDensity.length
const popDenMin = 0

let densityList = []

top10PopDensity.forEach(country => densityList.push(country.density))

const popDenMax = Math.max(...densityList)

console.log(svgWidth, svgHeight, dataLenght, densityList, popDenMax)

const popDenLinScale = d3.scaleLinear()
  .domain([popDenMin, popDenMax])
  .range([0, svgWidth])

const popDenColorLinScale = d3.scaleLinear()
  .domain([popDenMin, popDenMax])
  .range(['antiquewhite', 'tomato'])

const yScale = d3.scaleLinear()
  .domain([0, dataLenght - 1])
  .range([0, svgHeight - 50])

d3.select('svg')
  .selectAll('rect')
  .data(top10PopDensity)
  .join('rect')
  .attr('width', d => popDenLinScale(d.density))
  .attr('height', svgHeight/dataLenght -5)
  .attr('x', 0)
  .attr('y', (d, i) => 5 + yScale(i))
  .attr('rx', 5)
  .attr('ry', 5)
  .attr('fill', d => popDenColorLinScale(d.density))

d3.select('svg')
  .selectAll('text')
  .data(top10PopDensity)
  .join('text')
  .text(d => `${d.country}, ${d.density}`)
  .attr('x', 10)
  .attr('y', (d, i) => 5 + yScale(i) + 27)
  .attr('fill', 'blue')
  .style('text-anchor', 'start')
  .style('font-size', 12)
  .style('font-weight', 600)
  .style('letter-spacing', 0.3)

document.querySelector('#scalesubmit')
  .addEventListener('click', (e)=>{
    const input = document.querySelector('#scaleinput').value
    if (input >= 0 && input <=100){
        document.querySelector('#scaleoutput').innerText =
            popDenLinScale.invert(input / 100 * svgWidth).toFixed(2)
    }
  })