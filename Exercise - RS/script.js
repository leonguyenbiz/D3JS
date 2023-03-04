async function draw(){
    // Load Data
    const dataSet = await d3.csv('/Exercise - RS/Risk Survey data.csv')

    const xAccessor = (d) => d.Insured_name
    const yAccessor = (d) => parseInt(d.VND_SI)
    const nu = dataSet.length

    // Dimension
    const dimensions = {
        width: 1400,
        height: 600,
        margin: 30
    }

    //Scale
    const vertiScale = d3.scaleLinear()
        // .domain(d3.extent(dataSet, yAccessor))
        .domain([d3.max(dataSet, yAccessor), d3.min(dataSet, yAccessor)])
        .range([dimensions.height - dimensions.margin, 0])
    
    // Chart space
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width - dimensions.margin)
        .attr('height', dimensions.height - dimensions.margin)

    const chartspace = svg.append('g')
        .style('transform', 'translate(3,3)')
        .style('font-size', '16px')
        .style('dominant-baseline', 'middle')

    chartspace.selectAll('rect')
        .data(dataSet)
        .join('rect')
        .attr('width', 6)
        .attr('height', d => vertiScale(yAccessor(d)))
        .attr('x', (d, i) => 6*(i%nu)-1)
        .attr('y', d=> (dimensions.height - vertiScale(yAccessor(d)) - dimensions.margin)|0)
        .attr('fill', 'green')
    
    chartspace.append('text')
        .text('Total Sum Insured')
        .attr('font-size', '30px')
        .attr('x', 600)
        .attr('y', 40)

    // text to data
    const text = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width - dimensions.margin)
        .attr('height', dimensions.height - dimensions.margin)

    const textspace = text.append('g')
    textspace.selectAll('text')
        .data(dataSet)
        .join('text')
        .text(xAccessor)
        .attr('y', (d, i) => -6*(i%nu))
        .attr('x', 0)
        // .attr('y', dimensions.height)
        .attr('transform', 'rotate(-270)')
        .attr('font-size', '5px')
}

draw()