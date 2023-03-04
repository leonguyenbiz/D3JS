async function draw(){
    // Loading Data
    const dataSet = await d3.csv('/Section 7 - Even more Charts/Pie Chart/data/data.csv')
    console.log(dataSet)
    // set Dimension
    const dimensions = {
        width: 700,
        height: 700,
        margin: 10,
    }

    const ctrW = dimensions.width - dimensions.margin*2
    const ctrH = dimensions.height - dimensions.margin*2
    const radius = ctrW/2


    // Drawing chart area
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    const ctr = svg.append('g')
        .attr(
            'transform',
            `translate(${dimensions.margin}, ${dimensions.margin})`
        )

    // set Scales
    const populationPie = d3.pie()
        .value((d) => d.value)
        .sort(null)

    const slices = populationPie(dataSet)
    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(60)
        // .innerRadius(250)
    
    const arcLabels = d3.arc()
        .outerRadius(radius)
        .innerRadius(300)


    const colors = d3.quantize(d3.interpolateSpectral, dataSet.length)
    const colorScale = d3.scaleOrdinal()
        .domain(dataSet.map(element => element.name))
        .range(colors)        

    // Draw shape
    const arcGroup = ctr.append('g')
        .attr(
            'transform',
            `translate(${ctrH/2}, ${ctrW/2})`
        )

    arcGroup.selectAll('path')
        .data(slices)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => colorScale(d.data.name))

    const labelsGroup = ctr.append('g')
        .attr(
            'transform',
            `translate(${ctrH/2}, ${ctrW/2})`
        )
        .classed('lables', true)

    labelsGroup.selectAll('text')
        .data(slices)
        .join('text')
        .attr('transform', d => `translate(${arcLabels.centroid(d)})`)
        .call(
            text => text.append('tspan')
                .style('font-weight', 'bold')
                .attr('y', -4)
                .text(d => d.data.name)
        )
        .call(
            text => text.filter((d) => (d.endAngle - d.startAngle) > 0.25)
                .append('tspan')
                .attr('y', 9)
                .attr('x', 0)
                .text(d => d.data.value)
        )
    
}

draw()