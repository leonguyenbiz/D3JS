async function followup(){
    // loading data
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

    console.log(dataSet.columns)
    // console.log(dataSet)

    // set Dimensions
    const dimension = {
        width: 650,
        height: 3000,
        margin: 5
    }
    const chtW = dimension.width - dimension.margin*2
    const chtH = dimension.height - dimension.margin*2

    // set drawing area
    const svg = d3.select('#remain')
        .append('svg')
        .attr('width', dimension.width)
        .attr('height', dimension.height)

    const cht = svg.append('g')
        .attr(
            'transform',
            `translate(${dimension.margin}, ${dimension.margin})`
        )

    const remGroup = cht.append('g')

    function remaining(div){
        // create drawing data
        const remData = []
        dataSet.map(d => {
            if (d.DIV === div && d.stt === 'n'){
                remData.push(d)
            }
        })
        remData.sort((a, b) => (b.rmA - a.rmA))
        // console.log(remData)

        // set Scale
        const stackGenerator = d3.stack()
            // .keys(dataSet.columns.slice(1))
            .keys(['rmA+', 'rmA', 'rmB', 'rmC'])

        // console.log(stackGenerator)

        const stackData = stackGenerator(remData).map((remGroup) => {
            remGroup.forEach((insuredName) => {
                insuredName.key = remGroup.key
            })
            return remGroup
        })

        console.log(stackData)

        const xScale = d3.scaleLinear()
            .domain([
                0, d3.max(stackData, (re) => {
                    return d3.max(re, insuredName => insuredName[1])
                })
            ])
            .range([dimension.margin, chtW])

        // console.log(xScale(10))

        const yScale = d3.scaleBand()
            .domain(remData.map(insuredName => insuredName['Insured name']))
            .range([dimension.margin, chtH-2000])
            .padding(0.2)

        // console.log(yScale('MICROTECHNO CO., LTD'))

        const colorScale = d3.scaleOrdinal()
            .domain(stackData.map(d => d.key))
            .range(d3.schemeSpectral[stackData.length])
            .unknown('#ccc')

        // console.log(colorScale('rmA'))

        // draw bars
        remGroup.selectAll('g')
            .data(stackData)
            .join('g')
            .attr('fill', d => colorScale(d.key))

        console.log(remGroup)

        remGroup.selectAll('rect')
            .data(d => d)
            .join('rect')
            .attr('x', 100)
            .attr('y', d => yScale(d.data['Insured name']))
            .attr('height', yScale.bandwidth())
            .attr('width', d => xScale(d[1]) - xScale(d[0]))
    }
    
    d3.select('#metric').on('change', function(e){
        e.preventDefault

        remaining(this.value)
    })
    remaining('VH')
 
}

followup()

async function torenew(){
    // Load General Data Set
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
        return d
    })
    // console.log(dataSet.columns)

    // set Dimension for chart drawing
    const dimensions = {
        width: 700,
        height: 3000,
        margin: 5
    }

    const chtW = dimensions.width - dimensions.margin*2
    const chtH = dimensions.height - dimensions.margin*2

    // set Drawing area
    const svg = d3.select('#torenew')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    const cht = svg.append('g')
        .attr(
            'transform',
            `translate(${dimensions.margin}, ${dimensions.margin})`
        )


    function daytoRenew(div){
        // create data to draw
        var dtrData = []
        dataSet.map(d =>{
            if(d.DIV === div && d.stt === 'n'){
                dtrData.push(d)
            }
        })
        // sort data
        dtrData = dtrData.sort((a,b) => (a.leftDays > b.leftDays ? 1 : -1))

        // set dimension
        const dimensions = {
            width: 700,
            height: 3000,
            margin: 10
        }
        const chtW = dimensions.width - dimensions.margin*2
        const chtH = dimensions.height - dimensions.margin*2

        // set Scale
        const xScale = d3.scaleLinear()
            .domain(d3.extent(dtrData, d => d.leftDays))
            .range([300, chtW])
            .nice()

        const yScale = d3.scaleLinear()
            .domain([0, dataSet.length])
            .range([dimensions.margin, chtH - dimensions.margin])

        const colorScale = d3.scaleLinear()
            .domain(d3.extent(dtrData, d => d.leftDays))
            .range(['red', 'lightgreen'])

        // draw chart
        cht.selectAll('rect')
            .data(dtrData)
            .join('rect')
            .attr('x', d => d.leftDays > 0 ? xScale(0) : xScale(d.leftDays))
            .attr('y', (d, i) => yScale(i))
            .attr('width', d => d.leftDays > 0 ? xScale(d.leftDays) - xScale(0) : xScale(0) - xScale(d.leftDays))
            .attr('height', chtH/dataSet.length-3)
            .attr('fill', d => colorScale(d.leftDays))
            .attr('rx', 3)
            .attr('ry', 3)

        d3.select('#torenewtext').text('There is ' + dtrData.length + ' cases are not completly finished' +
                            ' recommendations before renew date')

    }

    d3.select('#metric2').on('change', function(e){
        e.preventDefault
        
        daytoRenew(this.value)
    })

    daytoRenew('VH')
}

torenew()

// async function followup(){
//     // Load General Data Set
//     const dataSet = await d3.csv('/Exercise - RS/MSP-2022/MSP-2022.csv', d => {
//         d['surveyDate'] = new Date( 
//                 d['Survey Date'].split('/')[2],
//                 d['Survey Date'].split('/')[1]-1,
//                 d['Survey Date'].split('/')[0]
//             )
//         d['renewDate'] = new Date(
//                 2023,
//                 d['renew date'].split('/')[1]-1,
//                 d['renew date'].split('/')[0]
//             )
//         const today = new Date()
//         const index = 1000*3600*24
//         d.leftDays = Math.round((d.renewDate - today)/index)
//         return d
//     })
//     console.log(dataSet.columns)

//     // set Dimension for chart drawing
//     const dimensions = {
//         width: 700,
//         height: 3000,
//         margin: 5
//     }

//     const chtW = dimensions.width - dimensions.margin*2
//     const chtH = dimensions.height - dimensions.margin*2

//     // set Drawing area
//     const svg = d3.select('#remain')
//         .append('svg')
//         .attr('width', dimensions.width)
//         .attr('height', dimensions.height)

//     const cht = svg.append('g')
//         .attr(
//             'transform',
//             `translate(${dimensions.margin}, ${dimensions.margin})`
//         )

//     const clientName = d3.select('#clientname')
//         .append('svg')
//         .attr('width', dimensions.width - 350)
//         .attr('height', dimensions.height)

//     const name = clientName.append('g')
//         .attr(
//             'transform',
//             `translate(${dimensions.margin}, ${dimensions.margin})`
//         )
//         .style('text-anchor', 'right')
    
//     function remaining(div){
//         // Load drawing data
//         var remData = []
//         dataSet.map(d => {
//             if (d.DIV === div && d.stt === 'n'){
//                 d['rmA+'] = d['A+'] - d['A+d']
//                 d['rmA'] = d['A'] - d['Ad']
//                 d['rmB'] = d['B'] - d['Bd']
//                 d['rmC'] = d['C'] - d['Cd']
//                 remData.push(d)
//             }
            
//         })
//         remData = remData.sort((a, b) => (a.rmA > b.rmA ? -1 : 1))

//         // set Scale
//         const xScale = d3.scaleLinear()
//             .domain(d3.extent(remData, d => d.rmA))
//             .range([1, chtW - 500])

//         const yScale = d3.scaleLinear()
//             .domain([0, dataSet.length - 3])
//             .range([dimensions.margin, chtH - dimensions.margin])

//         const colorScale = d3.scaleLinear()
//             .domain(d3.extent(remData, d => d.rmA))
//             .range(['lightgreen', 'red'])

//         // Draw chart
//         cht.selectAll('rect')
//             .data(remData)
//             .join('rect')
//             .attr('x', 301)
//             .attr('y', (d, i) => yScale(i) + 6)
//             .attr('width', d => xScale(d.rmA))
//             .attr('height', chtH/dataSet.length - 3)
//             .attr('rx', 3)
//             .attr('ry', 3)
//             .attr('fill', d => d.leftDays = 0 ? 'black' : colorScale(d.rmA))

//         d3.select('#remaintext').text('There is ' + remData.length + ' cases are not fully ' +
//                                 'completed recommendation before Renew Date. Detail as below:')

//         // list out client name
//         name.selectAll('text')
//             .data(remData)
//             .join('text')
//             .text(d => d['Insured name'])
//             .attr('x', 0)
//             .attr('y', (d, i) => yScale(i) + 3)
//     }


//     // d3.select('#charttype').on('change', function(e){
//     //     e.preventDefault()
//     //     if (this.value === 'remaining'){
//     //         d3.select('#metric').on('change', function(e){

//     //             remaining(this.value)
//     //         })
//     //     }
//     //     else if(this.value === 'daytorenew') {
//     //         d3.select('#metric').on('change', function(e){

//     //             daiToRenew(this.value)
//     //         })
//     //     }
//     // })

//     d3.select('#metric').on('change', function(e){
//         e.preventDefault()

//         remaining(this.value)
//     })

//     remaining('VH')
// }

// followup()