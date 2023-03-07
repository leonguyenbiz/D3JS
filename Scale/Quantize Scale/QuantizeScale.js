// let quanScl = d3.scaleQuantize()
// let quanScIn = d3.scaleQuantize()
//     .domain([1, 5])
//     .range([10, 20, 30])
// quanScIn.invertExtent()

// data
const revenues = [1857, 2169, 1615, 1511, 1434]

const svgWidth = document.querySelector('svg').clientWidth
const svgHeight = document.querySelector('svg').clientHeight

const growFactor = d3.scaleQuantize()
    .domain([Math.min(...revenues), Math.max(...revenues)])
    .range(['#87CEFA', '#ADD8E6', '#4683b4'])

d3.select('svg')
    .selectAll('rect')
    .data(revenues)
    .join('rect')
    .attr('width', svgWidth/revenues.length - 15)
    .attr('height', d => d/5)
    .attr('x', (d, i) => i*svgWidth/revenues.length)
    .attr('y', d => (svgHeight - d/5)-25)
    .attr('fill', d => growFactor(d))
    .attr('rx', 5)
    .attr('ry', 5)

d3.select('svg')
    .selectAll('text')
    .data(revenues)
    .join('text')
    .text(d => d)
    .attr('x', (d, i) => i*svgWidth/revenues.length + 45)
    .attr('y', svgHeight)
    // .style('text-angchor', 'start')
    .style('fill', 'red')
    .style('font-weight', 600)