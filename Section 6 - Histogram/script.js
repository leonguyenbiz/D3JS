async function draw(){
    // Load data
    const dataSet = await d3.json('/Section 6 - Histogram/data/data.json')
    // console.log(dataSet)

    // Dimension
    const dimensions = {
        width: 800,
        height: 400,
        margin: 50
    }

    dimensions.ctrWidth = dimensions.width - dimensions.margin * 2
    dimensions.ctrHeight = dimensions.height - dimensions.margin * 2

    // Space of chart
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    const ctr = svg.append('g')
        .attr(
            'transform',
            `translate(${dimensions.margin}, ${dimensions.margin})`
        )

    const labelGroup = ctr.append('g')
        .classed('bar-labels', true)

    const xAxisGroup = ctr.append('g')
        .style('transform', `translateY(${dimensions.ctrHeight}px)`)


    function histogram(metric){
        const xAccessor = d => d.currently[metric]
        const yAccessor = d => d.length

        // Scale
        const xScale = d3.scaleLinear()
            .domain(d3.extent(dataSet, xAccessor))
            .range([0, dimensions.ctrWidth])
            .nice()

        const bin = d3.bin()
            .domain(xScale.domain())
            .value(xAccessor)
            .thresholds(10)

        const newDataSet = bin(dataSet)
        // console.log({ original:dataSet, new: newDataSet})
        const padding = 3

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(newDataSet, yAccessor)])
            .range([dimensions.ctrHeight, 0])
            .nice()

            // Draw bars
        ctr.selectAll('rect')
            .data(newDataSet)
            .join('rect')
            .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - padding]))
            .attr('height', d => dimensions.ctrHeight - yScale(yAccessor(d)))
            .attr('x', d => xScale(d.x0))
            .attr('y', d => yScale(yAccessor(d)))
            .attr('fill', '#01C5C4')


        labelGroup.selectAll('text')
            .data(newDataSet)
            .join('text')
            .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0))/2)
            .attr('y', d => yScale(yAccessor(d)) - 10)
            .text(yAccessor)

        // Draw Axises
        const xAxis = d3.axisBottom(xScale)
        
                
        xAxisGroup.call(xAxis)
    }

    d3.select('#metric').on('change', function(e){
        e.preventDefault()

        histogram(this.value)
        // console.log(this)
    })

    histogram('humidity')
}

draw()