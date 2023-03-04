async function draw(){
    // load data
    const dataSet = await d3.csv('/Section 7 - Even more Charts/Bar Chart/data/data.csv', (d, i, c) => {
        d3.autoType(d)
        d.total = d3.sum(c, (c) => d[c])

        return d
    })
    console.log(dataSet)
    dataSet.sort((a, b) => b.total - a.total)

    // set Dimension
    let dimensions = {
        width: 1000,
        height: 800,
        margin: 20
    }

    dimensions.chtW = dimensions.width - dimensions.margin*2
    dimensions.chtH = dimensions.height - dimensions.margin*2

    // drawing area
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    const cht = svg.append('g')
        .attr(
            'transform',
            `translate(${dimensions.margin}, ${dimensions.margin})`
        )

    // set Scale
    const stackGenerator = d3.stack()
        .keys(dataSet.columns.slice(1))

    // console.log(stackGenerator)
    
    const stackData = stackGenerator(dataSet).map((ageGroup) => {
        ageGroup.forEach((state) => {
            state.key = ageGroup.key
        })
        return ageGroup
    })

    console.log(stackData)

    const yScale = d3.scaleLinear()
        .domain([
        0, d3.max(stackData, (ag) => {
            return d3.max(ag, state => state[1])
            })
        ])
        .rangeRound([dimensions.chtH, dimensions.margin])

    const xScale = d3.scaleBand()
        .domain(dataSet.map(state => state.name))
        .range([dimensions.margin, dimensions.chtW])
        // .paddingInner(0.1)
        // .paddingOuter(0.1)
        .padding(0.2)
        
    const colorScale = d3.scaleOrdinal()
        .domain(stackData.map(d => d.key))
        .range(d3.schemeSpectral[stackData.length])
        .unknown('#ccc')

    // Draw Bars
    const ageGroups = cht.append('g')
        .classed('age-groups', true)
        .selectAll('g')
        .data(stackData)
        .join('g')
        .attr('fill', d => colorScale(d.key))

    // console.log(ageGroups)

    ageGroups.selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', d => xScale(d.data.name))
        .attr('y', d => yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => yScale(d[0]) - yScale(d[1]))

}

draw()