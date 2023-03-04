async function draw(){
    // Load data
    const dataSet = await d3.csv('/data/data.csv')

    const parseDate = d3.timeParse('%Y-%m-%d')
    const xAccessor = d => parseDate(d.date)
    const yAccessor = d => parseInt(d.close)

    // set Dimensions
    const dimensions = {
        width: 900,
        height: 500,
        margin: 50,
    }

    const ctrW = dimensions.width - dimensions.margin*2
    const ctrH = dimensions.height - dimensions.margin*2

    // Draw chart area
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    const ctr = svg.append('g')
        .attr(
            'transform',
            `translate (${dimensions.margin}, ${dimensions.margin})`
        )

    const tooltip = d3.select('#tooltip')
    const tooltipDot = ctr.append('circle')
        .attr('r', 5)
        .attr('fill', '#fc8781')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .style('opacity', 0)
        .style('pointer-events', 'none')

    // set Scales
    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataSet, yAccessor))
        .range([ctrH, 0])
        .nice()

    const xScale = d3.scaleUtc()
        .domain(d3.extent(dataSet, xAccessor))
        .range([0, ctrW])

    // console.log(xScale(xAccessor(dataSet[0])), dataSet[0])

    const lineGenerator = d3.line()
        .x((d) => xScale(xAccessor(d)))
        .y((d) => yScale(yAccessor(d)))

    // console.log(lineGenerator(dataSet))
    ctr.append('path')
        .datum(dataSet)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', '#30475e')
        .attr('stroke-width', 2)


    // Axis
    const yAxis = d3.axisLeft(yScale)
        .tickFormat((d) => `$${d}`)

    ctr.append('g')
        .call(yAxis)

    const xAxis = d3.axisBottom(xScale)

    ctr.append('g')
        .style('transform', `translateY(${ctrH}px)`)
        .call(xAxis)

    // Tooltip
    ctr.append('rect')
        .attr('width', ctrW)
        .attr('height', ctrH)
        .style('opacity', 0)
        .on('touchmouse mousemove', function(event) {
            const mousePos = d3.pointer(event, this)
            const date = xScale.invert(mousePos[0])
            
            // custom Bisector - left, center, right
            const bisector = d3.bisector(xAccessor).left
            const index = bisector(dataSet, date)
            const stock = dataSet[index - 1]

            // Update chart
            tooltipDot.style('opacity', 1)
                .attr('cx', xScale(xAccessor(stock)))
                .attr('cy', yScale(yAccessor(stock)))
                .raise()

            tooltip.style('display', 'block')
                .style('top', yScale(yAccessor(stock)) - 20 + "px")
                .style('left', xScale(xAccessor(stock)) + "px")

            tooltip.select('.price')
                .text(`$${yAccessor(stock)}`)

            const dateFormatter = d3.timeFormat('%B %-d, %Y')

            tooltip.select('.date')
                .text(`${dateFormatter(xAccessor(stock))}`)
        })
        .on('mouseleave', function(event){
            tooltipDot.style('opacity', 0)

            tooltip.style('display', 'none')
        })

}

draw()