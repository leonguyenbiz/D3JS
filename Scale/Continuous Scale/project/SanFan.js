const yearSFTempData = [66, 67, 64, 63, 62, 60, 57, 68, 70, 69, 63, 57];

const svgW = d3.select('#chart svg').node().clientWidth
const svgH = d3.select('#chart svg').node().clientHeight

// console.log(svgW)

const dataLength = yearSFTempData.length

d3.select('#chart svg')
    .attr('viewBox', `0 -${svgH} ${svgW} ${svgH}`)

const colorScale = d3.scaleLinear()
    .domain([Math.min(...yearSFTempData), Math.max(...yearSFTempData)])
    .range(['blue', 'orange'])

const rScale = d3.scaleLinear()
    .domain([Math.min(...yearSFTempData), Math.max(...yearSFTempData)])
    .range([15, 25])

const xTimeScale = d3.scaleTime()
    .domain([new Date(2019, 0), new Date(2019, `${dataLength - 1}`)])
    .range([30, svgW - 30])

console.log(xTimeScale(22))

const yScale = d3.scaleLinear()
    .domain([Math.min(...yearSFTempData), Math.max(...yearSFTempData)])
    .range([50, svgH - 50])
// console.log(yScale(50))

d3.select('#chart svg')
    .selectAll('circle')
    .data(yearSFTempData)
    .join('circle')
    .attr('cx', (d, i) => xTimeScale(new Date(2019, i)))
    .attr('cy', d => -yScale(d))
    .attr('r', d => rScale(d))
    .attr('fill', d => colorScale(d))

const monthName = xTimeScale.ticks(12).map(xTimeScale.tickFormat(12, '%b'))
// console.log(monthName)

// d3.select('#chart svg')
//     .selectAll('text')
//     .data(yearSFTempData)
//     .join('text')
//     .text((d, i) => monthName[i] + '~' + d)
//     .attr('x', (d, i) => xTimeScale(new Date(2019, i)))
//     .attr('y', -svgH + 15)
//     .attr('fill', d => colorScale(d))
//     .style('text-anchor', 'middle')
//     .style('font-size', 12)
//     .style('font-weight', 300)

// d3.select('#chart svg')
//     .selectAll('text')
//     .data(yearSFTempData)
//     .join('text')
//     .text(d => d)
//     .attr('x', (d, i) => xTimeScale(new Date(2019, i)))
//     .attr('y', d => -yScale(d)+3)
//     .style('text-anchor', 'middle')
//     .style('font-size', 12)
//     .style('font-weight', 300)
//     .style('fill', 'white')

d3.select('#chart svg')
    .selectAll('text')
    .data(yearSFTempData)
    .join('text')
    .call(
        text => text.append('tspan')
            .text((d, i) => monthName[i] + '~' + d)
            .attr('x', (d, i) => xTimeScale(new Date(2019, i)))
            .attr('y', -svgH + 15)
            .attr('fill', d => colorScale(d))
            .style('text-anchor', 'middle')
            .style('font-size', 12)
            .style('font-weight', 300)
    )
    .call(
        text => text.append('tspan')
            .text(d => d)
            .attr('x', (d, i) => xTimeScale(new Date(2019, i)))
            .attr('y', d => -yScale(d)+3)
            .style('text-anchor', 'middle')
            .style('font-size', 12)
            .style('font-weight', 300)
            .style('fill', 'white')
    )