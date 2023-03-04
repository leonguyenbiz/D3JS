async function circular(){
    // Loading Data Set
    const dataSet = await d3.csv('/Exercise - RS/MSP-2022/MSP-2022.csv', d => {
        d['surveyDate'] = new Date( 
                d['Survey Date'].split('/')[2],
                d['Survey Date'].split('/')[1]-1,
                d['Survey Date'].split('/')[0]
            )
        d['renewDate'] = new Date(
                2023,
                d['renew date'].split('/')[1]-1,
                d['renew date'].split('/')[0]
            )
        const today = new Date()
        const index = 1000*3600*24
        d.leftDays = Math.round((d.renewDate - today)/index)
        d['rmA+'] = d['A+'] - d['A+d']
        d['rmA'] = d['A'] - d['Ad']
        d['rmB'] = d['B'] - d['Bd']
        d['rmC'] = d['C'] - d['Cd']
        d.total = d['rmA+'] + d['rmA'] + d['rmB'] + d['rmC']

        return d
    })
    
    // set Dimension
    const dim = {
        width: 800,
        height: 800,
        margin: 10
    }
    dim.chtW = dim.width - dim.margin*2
    dim.chtH = dim.height - dim.margin*2
    var innerRadius = 180
    var outerRadius = Math.min(dim.width, dim.height)/2

    // set Drawing area
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dim.width)
        .attr('height', dim.height)

    const cht = svg.append('g')
        .attr(
            'transform',
            `translate(${dim.width/2}, ${dim.height/2})`
        )

    function draw(div){
        // Loading drawing data
        var drawData = []
        dataSet.map(d => {
            if (d.DIV === div && d.stt === 'n'){
                drawData.push(d)
            }
        })
        console.log(drawData)
        drawData = drawData.sort((a, b) => (b['rmA'] - a['rmA']))

        // set Scale
        const stackGenerator = d3.stack()
            .keys(['rmA+', 'rmA', 'rmB', 'rmC'])

        const stackData = stackGenerator(drawData).map((remGroup) => {
            remGroup.forEach((insuredName) => {
                insuredName.key = remGroup.key
            })
            return remGroup
        })

        console.log(stackData)

        const xScale = d3.scaleBand()
            .domain(drawData.map((d) => d['Insured name']))
            .range([0, 2*Math.PI])
            .align(0)

        // console.log(xScale('MASUDA VINYL VIETNAM CO., LTD'))

        const yScale = d3.scaleRadial()
            .domain([0, d3.max(drawData, d => d.total)])
            .range([innerRadius, outerRadius])

        // console.log(yScale(180))

        const colorScale = d3.scaleOrdinal()
            .domain(stackData.map(d => d.key))
            .range(d3.schemeSpectral[stackData.length])
            .unknown('#ccc')

        // Draw chart
        cht.append('g')
            .selectAll('g')
            .data(stackData)
            .join('g')
            .attr('fill', d => colorScale(d.key))

        cht.selectAll('path')
            .data(d => d)
            .join('path')
            .attr('d', d3.arc()
                .innerRadius(d => yScale(d[0]))
                .outerRadius(d => yScale(d[1]))
                .startAngle(d => xScale(d.data['Insured name']))
                .endAngle(d => xScale(d.data['Insured name'] + xScale.bandwidth()))
                .padAngle(0.01)
                .padRadius(innerRadius)
            )

    }

    d3.select('#division').on('change', function(e){
        e.preventDefault

        draw(this.value)
    })
    draw('VH')

}

circular()