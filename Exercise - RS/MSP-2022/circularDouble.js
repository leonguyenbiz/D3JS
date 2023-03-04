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

    innerRadius = 250
    outerRadius = Math.min(dim.width, dim.height)/2.5 // the outerRadius goes from the middle of the SVG area to the border
    console.log(outerRadius)

    // drawing area
    const svg = d3.select('#chart')
        .append('svg')
            .attr('width', dim.width)
            .attr('height', dim.height)
    
    const chtAp = svg.append('g')
        .attr(
            'transform',
            `translate(${dim.chtW/2}, ${dim.chtH/2})`
        )
    
    const chtA = svg.append('g')
        .attr(
            'transform',
            `translate(${dim.chtW/2}, ${dim.chtH/2})`
        )

    // const chtLabel = cht.append('g')
    
    const chtB = svg.append('g')
        .attr(
            'transform',
            `translate(${dim.chtW/2}, ${dim.chtH/2})`
        )

    function drawCir(div){
        // Loading drawing data
        var drawData = []
        dataSet.map(d => {
            if (d.DIV === div && d.stt === 'n'){
                drawData.push(d)
            }
        })
        console.log(drawData)
        drawData = drawData.sort((a, b) => (b['rmA+'] - a['rmA+']))
        drawData = drawData.sort((a, b) => (b.rmA - a.rmA))
        drawData = drawData.sort((a, b) => (b.rmB - a.rmB))

        // set Scale
        const xScale = d3.scaleBand()
            .range([0, 3*Math.PI]) // x axis goes from 0 to 2pi = all around the circle. if stop at 1Pi, it will be around a half circle
            .align(0)   //This does nothing
            .domain(drawData.map(d => d['Insured name'])) // The domain of the X axis is the list of Insured name.

        const yScaleAp = d3.scaleRadial()
            .domain(d3.extent(drawData, d => d['rmA+']))
            .range([innerRadius, outerRadius])

        const yScaleA = d3.scaleRadial()
            .domain(d3.extent(drawData, d => d.rmA))
            .range([innerRadius, 100])

        const yScaleB = d3.scaleRadial()
            .domain(d3.extent(drawData, d => d.rmB))
            .range([10, 200])

        // add the bars
        chtAp.selectAll('path')
            .data(drawData)
            .join('path')
                .attr('fill', 'red')
                .attr('class', 'rmA+')
                .attr('d', d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(d => yScaleAp(d['rmA+']))
                    .startAngle(d => xScale(d['Insured name']))
                    .endAngle(d => xScale(d['Insured name']) + xScale.bandwidth())
                    .padAngle(0.01)
                    .padRadius(innerRadius)
                    )

        // add label
        chtAp.selectAll('text')
            .data(drawData)
            .join('text')
            .text(d => d['Insured name'])
            .attr('transform', function(d){
                return (xScale(d['Insured name']) + xScale.bandwidth()/2 + Math.PI) % (2*Math.PI) < Math.PI ? 'rotate(180)' : 'rotate(0)'
            })
            .attr('text-anchor', function(d){
                return (xScale(d['Insured name']) + xScale.bandwidth()/2 + Math.PI) % (2*Math.PI) < Math.PI ? 'end' : 'start'
            })
            .attr('transform', function(d){
                return 'rotate(' + ((xScale(d['Insured name']) + xScale.bandwidth()/2)*180/Math.PI -90) + ')' + 'translate(' + (yScaleAp(d['rmA+'])+10) + ', 0)'
            })
        
        // add second round
        chtA.selectAll('path')
            .data(drawData)
            .join('path')
                .attr('fill', 'orange')
                .attr('d', d3.arc()
                        .innerRadius(d => yScaleA(0))
                        .outerRadius(d => yScaleA(d.rmA))
                        .startAngle(d => xScale(d['Insured name']))
                        .endAngle(d => xScale(d['Insured name']) + xScale.bandwidth())
                        .padAngle(0.01)
                        .padRadius(innerRadius)
                    )
        
        
        // add third round
        chtB.selectAll('path')
            .data(drawData)
            .join('path')
                .attr('fill', 'green')
                .attr('d', d3.arc()
                    .innerRadius(d => yScaleB(0))
                    .outerRadius(d => yScaleB(d.rmB))
                    .startAngle(d => xScale(d['Insured name']))
                    .endAngle(d => xScale(d['Insured name']) + xScale.bandwidth())
                    .padAngle(0.01)
                    .padRadius(innerRadius)
                )
    }

    d3.select('#division').on('change', function(e){
        e.preventDefault

        drawCir(this.value)
    })

    drawCir('VH')

}

circular()