async function draw(){
    // Loading general data
    const dataSet = await d3.csv('/Section 6 - Histogram/excercise/Book1.csv')
    console.log(dataSet.columns)

    // Create data for chart
    // const drawData = []
    // for (var i = 0; i < dataSet.length; ++i){
    //     temp = {}
    //     if (dataSet[i].DIV === 'MS'){
    //         temp.insuredName = dataSet[i].Insuredname
    //         temp.div = dataSet[i].DIV
    //         temp.si = dataSet[i].VNDSI
    //         drawData.push(temp)
    //     }
    // }
    // console.log(drawData)
    
    // const xAccessor = d => parseInt(d.si)
    // const yAccessor = d => d.length

    // set Dimensions
    const dimensions = {
        width: 800,
        height: 600,
        margin: 20
    }

    const ctrW = dimensions.width - dimensions.margin*2
    const ctrH = dimensions.height - dimensions.margin*2

    // // Scale
    // const xScale = d3.scaleLinear()
    //     .domain(d3.extent(drawData, xAccessor))
    //     .range([0, ctrW])
    //     .nice()
    // // console.log(xScale(100))

    // const bin = d3.bin()
    //     .domain(xScale.domain())
    //     .value(xAccessor)
    //     .thresholds(10)

    // const newDrawData = bin(drawData)
    // const padding = 5

    // const yScale = d3.scaleLinear()
    //     .domain([0, d3.max(newDrawData, yAccessor)])
    //     .range([ctrH, 0])
    //     .nice()

    // console.log(d3.max(newDrawData, yAccessor))
    // console.log(yScale(100))

    // console.log({original: drawData, new: newDrawData})

    // Drawing area
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    const ctr = svg.append('g')
        .attr(
            'transform',
            `translate(${dimensions.margin}, ${dimensions.margin})`
        )
    
    // Draw bars
    // ctr.selectAll('rect')
    //     .data(newDrawData)
    //     .join('rect')
    //     .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - padding]))
    //     .attr('height', d => ctrH - yScale(yAccessor(d)))
    //     .attr('x', d => xScale(d.x0))
    //     .attr('y', d => yScale(yAccessor(d)))
    //     .attr('fill', '#01c5c4')

    // ctr.append('g')
    //     .classed('bar-labels', true)
    //     .selectAll('text')
    //     .data(newDrawData)
    //     .join('text')
    //     .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0))/2)
    //     .attr('y', d => yScale(yAccessor(d)) - 10)
    //     .text(yAccessor)

    // Draw Axis
    // const xAxis = d3.axisBottom(xScale)

    // const xAxisGroup = ctr.append('g')
    //     .style('transform', `translateY(${ctrH}px)`)

    // xAxisGroup.call(xAxis)

    const labelGroup = ctr.append('g')
        .classed('bar-labels', true)

    const xAxisGroup = ctr.append('g')
        .style('transform', `translateY(${ctrH}px)`)
    
    const meanLine = ctr.append('line')
        .classed('mean-line', true)

    function histogram(metric){
        // Create data for chart
        const drawData = []
        for (var i = 0; i < dataSet.length; ++i){
            temp = {}
            if (dataSet[i].DIV === metric){
                temp.insuredName = dataSet[i].Insuredname
                temp.div = dataSet[i].DIV
                temp.si = dataSet[i].VNDSI
                drawData.push(temp)
            }
        }

        const xAccessor = d => parseInt(d.si)
        const yAccessor = d => d.length

        // Scale
        const xScale = d3.scaleLinear()
            .domain(d3.extent(drawData, xAccessor))
            .range([0, ctrW])
            .nice()

        const bin = d3.bin()
            .domain(xScale.domain())
            .value(xAccessor)
            .thresholds(10)

        const newDrawData = bin(drawData)
        const padding = 5

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(newDrawData, yAccessor)])
            .range([ctrH, 0])
            .nice()

        const exitTransition = d3.transition().duration(500)
        const updateTransition = exitTransition.transition().duration(500)

        // Draw bars
        ctr.selectAll('rect')
            .data(newDrawData)
            .join(
                (enter) => enter.append('rect')
                    .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - padding]))
                    .attr('height', 0)
                    .attr('x', d => xScale(d.x0))
                    .attr('y', ctrH)
                    .attr('fill', '#b8de6f'),
                (update) => update,
                (exit) => exit.attr('fill', '#f39233')
                    .transition(exitTransition)
                    .attr('y', ctrH)
                    .attr('height', 0)
                    .remove()
            )
            .transition(updateTransition)
            .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - padding]))
            .attr('height', d => ctrH - yScale(yAccessor(d)))
            .attr('x', d => xScale(d.x0))
            .attr('y', d => yScale(yAccessor(d)))
            .attr('fill', '#01c5c5')


        labelGroup.selectAll('text')
            .data(newDrawData)
            .join(
                (enter) => enter.append('text')
                    .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0))/2)
                    .attr('y', ctrH)
                    .text(yAccessor),
                (update) => update,
                (exit) => exit.transition(exitTransition)
                    .attr('y', ctrH)
                    .remove()
            )
            .transition(updateTransition)
            .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0))/2)
            .attr('y', d => yScale(yAccessor(d)) - 10)
            .text(yAccessor)

        const mean = d3.mean(drawData, xAccessor)
            
        meanLine.raise()
            .transition(updateTransition)
            .attr('x1', xScale(mean))
            .attr('y1', 0)
            .attr('x2', xScale(mean))
            .attr('y2', ctrH)

        // Draw Axis
        const xAxis = d3.axisBottom(xScale)

        xAxisGroup.transition()
            .call(xAxis)

    }

    d3.select('#metric').on('change', function(e) {
        e.preventDefault()

        // console.log(this)
        histogram(this.value)
    })

    histogram('VH')
}

draw()