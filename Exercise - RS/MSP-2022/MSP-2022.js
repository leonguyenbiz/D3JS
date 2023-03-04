async function extract(){
    // Loading data
    var dataSet = await d3.csv('/Exercise - RS/MSP-2022/MSP-2022.csv', d => {
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
        d.leftDays = (d.renewDate - today)/index
        return d
    })

    // dataSet = dataSet.sort((a, b) => (a.leftDays > b.leftDays) ? 1 : -1)
    
    // set Dimension
    const dimensions = {
        width: 1200,
        height: 5000,
        margin: 20
    }

    const ctW = dimensions.width - dimensions.margin * 2
    const ctH = dimensions.height - dimensions.margin * 2

    // Drawing area
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    const ct = svg.append('g')
        .attr(
            'transform',
            `translate(${dimensions.margin}, ${dimensions.margin})`
        )

    const textGroup = svg.append('g')
        .attr(
            'transform',
            `translate(${dimensions.margin}, ${dimensions.margin})`
        )
        .style('font-size', 13)

    // const baseLine = ct.append('line')

    function drawByChartType(){
        function remaining (div){
            // create data to display remaining recommendation
            var remData = []

            dataSet.map(d => {
                if (d.DIV === div && d.stt === 'n'){
                    d['rmA+'] = d['A+'] - d['A+d']
                    d['rmA'] = d['A'] - d['Ad']
                    d['rmB'] = d['B'] - d['Bd']
                    d['rmC'] = d['C'] - d['Cd']
                    remData.push(d)
                }
                return d
            })

            remData = remData.sort((a, b) => (a['rmA'] > b['rmA'] ? -1 : 1))

            // const xAccessor = d => d.rmA

            // set Scale
            const xScaleRm = d3.scaleLinear()
                .domain([d3.min(remData, d => d.rmA), d3.max(remData, d => d.rmA)])
                .range([0, ctW - 500])
                .nice()

            const yScale = d3.scaleLinear()
                .domain([0, dataSet.length - 2])
                .range([dimensions.margin, ctH - dimensions.margin])
                .nice()

            const colorScale = d3.scaleLinear()
                .domain([d3.max(remData, d=>d.rmA), d3.min(remData, d=>d.rmA)])
                .range(['red', 'lightgreen'])

            // Chart drawing
            ct.selectAll('rect')
                .data(remData)
                .join('rect')
                .attr('x', d => d.rmA)
                .attr('y', (d, i) => 3 + yScale(i))
                .attr('width', d => xScaleRm(d.rmA))
                .attr('height', (d, i) => ctH/dataSet.length - 2)
                .attr('rx', 6)
                .attr('ry', 6)
                .attr('fill', d => colorScale(d.rmA))
                .attr('transform', 'translate(300, 0)')

        }

        function daitorenew(div){
            // Create data for chart
            var drawData = []

            dataSet.map(d => {
                if (d.DIV === div){
                    drawData.push(d)
                }
            })

            drawData = drawData.sort((a, b) => (a.leftDays > b.leftDays) ? 1 : -1)
            
            const xAccessor = d => d.leftDays

            // Scale
            const xScale = d3.scaleLinear()
                .domain(d3.extent(drawData, xAccessor))
                .range([0, ctW - 500])
                .nice()

            const yScale = d3.scaleLinear()
                .domain([0, dataSet.length - 1])
                .range([dimensions.margin, ctH - dimensions.margin])
                .nice()

            const colorScale =d3.scaleLinear()
                .domain(d3.extent(drawData, xAccessor))
                .range(['red', 'lightgreen'])

            // Chart drawing
            ct.selectAll('rect')
                .data(drawData)
                .join('rect')
                .attr('width', d => d.leftDays > 0 ? xScale(d.leftDays) - xScale(0) : xScale(0) - xScale(d.leftDays))
                .attr('height', ctH/dataSet.length - 2)
                .attr('x', d => d.leftDays > 0 ? xScale(0) : xScale(d.leftDays))
                .attr('y', (d, i) => 3 + yScale(i))
                .attr('rx', 6)
                .attr('ry', 6)
                .attr('fill', d => colorScale(d.leftDays))
                .attr('transform', 'translate(300, 0)')
            
            // textGroup.selectAll('text')
            //     .data(drawData)
            //     .join('text')
            //     .text(d => d['Insured name'])
            //     .attr('x', 0)
            //     .attr('y', (d, i) => yScale(i) +17)
            //     .attr('fill', 'black')

            // ct.selectAll('text')
            //     .data(drawData)
            //     .join('text')
            //     .text(d => Math.round(d.leftDays) + ' days to Renew Date: '  + d.renewDate.toLocaleDateString('en-GB')) 
            //     //             ' there, ' + (d['A+'] - d['A+d']) + ' A+, ' + (d['A'] - d['Ad']) + ' A recommendations not done yet!!!')
            //     .attr('x', d => d.leftDays > 0 ? xScale(0) + 320 : 400)
            //     .attr('y', (d, i) => yScale(i) + 17)
            //     .attr('fill', 'black')
            //     .style('font-size', 13)
        }
        
        d3.select('#charttype').on('change', function(e){
           e.preventDefault()
           if (this.value === 'remaining'){
                d3.select('#metric').on('change', function(e){
                    remaining(this.value)
                })
           }
           else {
                d3.select('#metric').on('change', function(e){
                    daitorenew(this.value)
            })
           }
        })

        d3.select('#metric').on('change', function(e){
            e.preventDefault
            remaining(this.value)
        })

    remaining('VH')
    }


    drawByChartType()

    // function remaining(){
        // // create data to display remaining recommendation
        // var remData = []

        // dataSet.map(d => {
        //     d['rmA+'] = d['A+'] - d['A+d']
        //     d['rmA'] = d['A'] - d['Ad']
        //     d['rmB'] = d['B'] - d['Bd']
        //     d['rmC'] = d['C'] - d['Cd']
        //     remData.push(d)
        //     return d
        // })

        // remData = remData.sort((a, b) => (a['rmA'] > b['rmA'] ? -1 : 1))

        // const xAccessor = d => d.rmA

        // // set Scale
        // const xScale = d3.scaleLinear()
        //     .domain([d3.min(remData, d => d.rmA), d3.max(remData, d => d.rmA)])
        //     .range([3, ctW - 500])
        //     .nice()

        // const yScale = d3.scaleLinear()
        //     .domain([0, remData.length - 1])
        //     .range([dimensions.margin, ctH - dimensions.margin])
        //     .nice()

        // const colorScale = d3.scaleLinear()
        //     .domain([d3.max(remData, d=>d.rmA), d3.min(remData, d=>d.rmA)])
        //     .range(['red', 'cyan'])

        // // Chart drawing
        // ct.selectAll('rect')
        //     .data(remData)
        //     .join('rect')
        //     .attr('x', d => d.rmA)
        //     .attr('y', (d, i) => 3 + yScale(i))
        //     .attr('width', d => xScale(d.rmA))
        //     .attr('height', (d, i) => ctH/remData.length - 2)
        //     .attr('rx', 6)
        //     .attr('ry', 6)
        //     .attr('fill', d => colorScale(d.rmA))
                
        // console.log(remData)
    // }
    // remaining()
        
    // function renewDate(div){

        // // Create data for chart
        // var drawData = []

        // dataSet.map(d => {
        //     if (d.DIV === div){
        //         drawData.push(d)
        //     }
        // })

        // drawData = drawData.sort((a, b) => (a.leftDays > b.leftDays) ? 1 : -1)
        
        // const xAccessor = d => d.leftDays

        // // Scale
        // const xScale = d3.scaleLinear()
        //     .domain(d3.extent(drawData, xAccessor))
        //     .range([0, ctW-500])
        //     .nice()

        // const yScale = d3.scaleLinear()
        //     .domain([0, dataSet.length - 1])
        //     .range([dimensions.margin, ctH - dimensions.margin])
        //     .nice()

        // const colorScale =d3.scaleLinear()
        //     .domain(d3.extent(drawData, xAccessor))
        //     .range(['red', 'lightgreen'])

        // // Chart drawing
        // ct.selectAll('rect')
        //     .data(drawData)
        //     .join('rect')
        //     .attr('width', d => d.leftDays > 0 ? xScale(d.leftDays) - xScale(0) : xScale(0) - xScale(d.leftDays))
        //     .attr('height', ctH/dataSet.length - 2)
        //     .attr('x', d => d.leftDays > 0 ? xScale(0) : xScale(d.leftDays))
        //     .attr('y', (d, i) => 3 + yScale(i))
        //     .attr('rx', 6)
        //     .attr('ry', 6)
        //     .attr('fill', d => colorScale(d.leftDays))
        //     .attr('transform', 'translate(300, 0)')
        
        // textGroup.selectAll('text')
        //     .data(drawData)
        //     .join('text')
        //     .text(d => d['Insured name'])
        //     .attr('x', 0)
        //     .attr('y', (d, i) => yScale(i) +17)
        //     .attr('fill', 'black')

        // ct.selectAll('text')
        //     .data(drawData)
        //     .join('text')
        //     .text(d => Math.round(d.leftDays) + ' days to Renew Date: '  + d.renewDate.toLocaleDateString('en-GB')) 
        //     //             ' there, ' + (d['A+'] - d['A+d']) + ' A+, ' + (d['A'] - d['Ad']) + ' A recommendations not done yet!!!')
        //     .attr('x', d => d.leftDays > 0 ? xScale(0) + 320 : 400)
        //     .attr('y', (d, i) => yScale(i) + 17)
        //     .attr('fill', 'black')
        //     .style('font-size', 13)
        // .call(
        //     text => text.append('tspan')
        //         .text( d => d['Insured name'])
        //         .attr('x', 0)
        //         .attr('y', (d, i) => yScale(i) +17)
        //         .attr('fill', 'black')
        //         .attr('transform', 'rotate(-270)')
        //         .style('font-size', 12)
        //         // .style('text-anchor', 'justify')
        // )
        // .call(
        //     text => text.append('tspan')
        //         .text(d => Math.round(d.leftDays) + ' days to Renew Date: '  + d.renewDate.toLocaleDateString('en-GB'))
        //         .attr('x', d => d.leftDays > 0 ? xScale(0) + 320 : 450)
        //         .attr('y', (d, i) => yScale(i) + 17)
        //         .attr('fill', 'black')
        //         .style('font-size', 12)
        // )

        // baseLine.raise()
        //     .attr('x1', 382)
        //     .attr('y1', 0)
        //     .attr('x2', 382)
        //     .attr('y2', ctH)
        //     .style('stroke', 'darkgreen')
        //     .style('stroke-width', 1)
    // }

    // d3.select('#metric').on('change', function(e) {
    //     e.preventDefault()

    //     renewDate(this.value)
    // })

    // renewDate('VH')
}

extract()

// console.log(new Date(2023, 1))