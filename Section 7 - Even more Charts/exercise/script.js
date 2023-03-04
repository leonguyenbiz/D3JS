async function draw(){
    // Loading data
    let div = []
    let divsh = []
    const dataSet = await d3.csv('/Section 7 - Even more Charts/exercise/Risk Survey data - original.csv', (d) => {
        d['Original_SI'] = parseInt(d[' Original SI '])
        d['VND_SI'] = parseInt(d[' VND SI '])
        d['Effective_date'] = new Date( d['Effective date'].split('/')[2],
                                        d['Effective date'].split('/')[1]-1,
                                        d['Effective date'].split('/')[0])
        d['Inception_date'] = new Date( d['Inception date'].split('/')[2],
                                        d['Inception date'].split('/')[1]-1,
                                        d['Inception date'].split('/')[0])
        d['Renew_date'] = new Date( d['Renew date'].split('/')[2],
                                    d['Renew date'].split('/')[1]-1,
                                    d['Renew date'].split('/')[0])
        
        var temp = {}
        if(d.DIV === 'VH'){
            temp.ctr = d.CTR
            temp.div = d.DIV
            temp.insuredName = d['Insured name']
            temp.riskLocation = d['Risk location']
            temp.effectiveDate = new Date(  d['Effective date'].split('/')[2],
                                            d['Effective date'].split('/')[1]-1,
                                            d['Effective date'].split('/')[0])
            temp.inceptionDate = new Date(  d['Inception date'].split('/')[2],
                                            d['Inception date'].split('/')[1]-1,
                                            d['Inception date'].split('/')[0])
            temp.renewDate = new Date(  d['Renew date'].split('/')[2],
                                        d['Renew date'].split('/')[1]-1,
                                        d['Renew date'].split('/')[0])
            temp.originalSi = parseInt(d[' Original SI '])
            temp.vndSi = parseInt(d[' VND SI '])
            div.push(temp)
        }

        divsh.push(d.DIV)

        return d
    })

    console.log(dataSet.columns)
    console.log(div)
    divsh = [...new Set(divsh)] //Remove all duplicated lines in array
    console.log(divsh)
    
    const divDetail = []
    for (let i = 0; i < divsh.length; ++i){
        let divtemp = {}
        let count = 0
        for (let j = 0; j < dataSet.length; ++j){
            if (divsh[i] === dataSet[j].DIV){
                count += 1
            }
        }
        divtemp.div = divsh[i]
        divtemp.num = count
        divDetail.push(divtemp)
    }
    console.log(divDetail)

    // console.log(dataSet[3].Effective_date.getDate() + '/' +
    //             (dataSet[3].Effective_date.getMonth() + 1) + '/' +
    //             dataSet[3].Effective_date.getFullYear())
    
    // Set dimension
    const dimension = {
        width: 600,
        height: 600,
        margin: 20
    }

    const ctrW = dimension.width - dimension.margin * 2
    const ctrH = dimension.height - dimension.margin * 2
    const radius = ctrW/2

    // Draw chart area
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimension.width)
        .attr('height', dimension.height)

    const ctr = svg.append('g')
        .attr(
            'transform',
            `translate(${dimension.margin}, ${dimension.margin})`
        )

    // Set Scale
    const populationPie = d3.pie()
        .value((d) => d.num)
        .sort(null)

    const slices = populationPie(divDetail)
    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(50)
    
    const arcLabel = d3.arc()
        .outerRadius(radius)
        .innerRadius(100)

    const color = d3.quantize(d3.interpolateSpectral, divDetail.length)
    const colorScale = d3.scaleOrdinal()
        .domain(divDetail.map(element => element.div))
        .range(color)

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
        .attr('fill', d => colorScale(d.data.div))

    const labelGroup = ctr.append('g')
        .attr(
            'transform',
            `translate(${ctrH/2}, ${ctrW/2})`
        )
        .classed('label', true)

    labelGroup.selectAll('text')
        .data(slices)
        .join('text')
        .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
        .call(
            text => text.append('tspan')
                .style('font-weight', 'bold')
                .attr('y', -10)
                .text(d => d.data.div)
        )
        .call(
            text => text.filter((d) => (d.endAngle - d.startAngle) > 0.1)
                .append('tspan')
                .attr('y', 9)
                .attr('x', 0)
                .text( d => d.data.num)
        )
}

draw()

async function draw2(){
    // Loading Data
    let VH1 = 0
    const dataSet = await d3.csv('/Section 7 - Even more Charts/exercise/Risk Survey data - original.csv', d => {
        if (d.DIV === 'VH'){
            VH1 +=1
        }
        return d
    })
    
    let VH = 0
    dataSet.forEach(d => {
        if (d.DIV === 'VH'){
            VH += 1
        }
    })
    console.log(VH)
    console.log(VH1)
}

draw2()