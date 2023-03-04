//d3.scaleLinear()
let xScale = d3.scaleLinear([0, 1], [0, 10])
xScale = d3.scaleLinear([0, 100], [0, 25])

// .domain()
const svg = d3.select('svg')
    .attr('width', 400)
    .attr('height', 500)
const svgW = svg.attr('width')

xScale = d3.scaleLinear()
    .domain([50, 100])
    .range([20, 75])

const xScale1 = d3.scaleLinear()
    .domain([10, 100])
    .range([0, svgW])

const xScale2 = d3.scaleLinear()
    .domain([20, 80, 155])
    .range([0, 150, svgW])

const colorScale = d3.scaleLinear()
    .domain([20, 100, 189])
    .range(['red', 'green', 'blue'])

const rect = svg.selectAll('rect')
    .data([75])
    .join('rect')
    .attr('width', d => xScale(d))
    .attr('height', 20)
    .attr('x', 0)
    .attr('y', 10)
    .attr('fill', d => colorScale(d))

d3.select('svg')
    .selectAll('circle')
    .data([80])
    .join('circle')
    .attr('r', 50)
    .attr('cx', d => xScale1(d)/2)
    .attr('cy', d => xScale1(d)/2)
    .attr('fill', colorScale(140))

console.log(xScale2.invert(30))
console.log(xScale2.invert(500))

// .rangeRound()
let x1Scale = d3.scaleLinear()
    .domain([13, 153])
    .rangeRound([50, 100])

console.log(x1Scale(155.33))

// .clamp(boolean)
let x2Scale = d3.scaleLinear()
    .domain([20, 50, 90])
    .range([0, 150, svgW])

x2Scale.clamp(true)

// .unknown()

x2Scale.unknown('Think about it')

// .interpolate(interpolate_variable)
let color2 = d3.scaleLinear()
    .domain([20, 80, 100])
    .range(['red', 'green', 'blue'])
    .interpolate(d3.interpolateHcl)

const rect2 = d3.select('svg')
    .append('rect')
    .data([50])
    .attr('x', 150)
    .attr('y', 150)
    .attr('width', d => xScale1(d))
    .attr('height', d => xScale2(d))
    .attr('fill', d => color2(d))

// .ticks(count)
xScale2.ticks()
console.log(xScale.ticks())
console.log(xScale.ticks(20))

// .tickFormat(count, specifier(optional))
let xTicks = xScale2.ticks(6)
let xTickFormat = xScale2.tickFormat(6, '+')

xTicks.map(xTickFormat)
console.log(xTicks.map(xTickFormat))

// d3.tickFormat(start, stop, count, specifier(optional))
let d3TickFormat = d3.tickFormat(-1, 1, 6, '-')
console.log(d3TickFormat(-0.5))

console.log(xTicks.map(d3TickFormat))

// .nice(count(0ptional))
let x3Scale = d3.scaleLinear()
    .domain([1.234, 8.912])
    .range([20, 100])

x3Scale.nice()
console.log(x3Scale.ticks())

// .copy()
let x4Scale = xScale