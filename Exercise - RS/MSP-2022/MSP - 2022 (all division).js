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

  dataSet = dataSet.sort((a, b) => (a.leftDays > b.leftDays) ? 1 : -1)
  
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
  
  const yAxisgroup = svg.append('g')
      .attr('transform', 'translate(460, 0)')
   
  // Scale
  const xScale = d3.scaleLinear()
      .domain([d3.min(dataSet, d => d.leftDays), d3.max(dataSet, d => d.leftDays)])
      .range([0, ctW])

  const yScale = d3.scaleLinear()
      .domain([0, dataSet.length - 1])
      .range([dimensions.margin, ctH - dimensions.margin])

  const colorScale =d3.scaleLinear()
      .domain([d3.max(dataSet, d => d.leftDays), d3.min(dataSet, d => d.leftDays)])
      .range(['lightgreen', 'red'])

  // Chart drawing
  ct.selectAll('rect')
      .data(dataSet)
      .join('rect')
      .attr('width', d => d.leftDays > 0 ? xScale(d.leftDays) - xScale(0) : xScale(0) - xScale(d.leftDays))
      .attr('height', ctH/dataSet.length - 2)
      .attr('x', d => d.leftDays > 0 ? xScale(0) : xScale(d.leftDays))
      .attr('y', (d, i) => 3 + yScale(i))
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', d => colorScale(d.leftDays))
      .attr('transform', 'translate(300, 0)')

  ct.selectAll('circle')
      .data(dataSet)
      .join('circle')
      .attr('r', 3)
      .attr('cx', 440)
      .attr('cy', (d, i) => 14 + yScale(i))
      .attr('fill', 'purple')
  
  // ct.selectAll('text')
  //     .data(dataSet)
  //     .join('text')
  //     .text(d => Math.round(d.leftDays) + ' days to Renew Date: '  + d.renewDate.toLocaleDateString('en-GB'))
  //     .attr('x', d => d.leftDays > 0 ? xScale(0) + 320 : 450)
  //     .attr('y', (d, i) => yScale(i) + 17)

  // labelGroup.selectAll('text')
  //     .data(dataSet)
  //     .join('text')
  //     .text(d => d['Insured name'])
  //     .attr('x', 0)
  //     .attr('y', (d, i) => yScale(i) - 3)
  //     .attr('text-anchor', 'left')

  ct.selectAll('text')
      .data(dataSet)
      .join('text')
      .call(
          text => text.append('tspan')
              .text( d => d['Insured name'])
              .attr('x', 0)
              .attr('y', (d, i) => yScale(i) +17)
              .attr('fill', 'black')
              .attr('transform', 'rotate(-270)')
              .style('font-size', 12)
              // .style('text-anchor', 'justify')
      )
      .call(
          text => text.append('tspan')
              .text(d => Math.round(d.leftDays) + ' days to Renew Date: '  + d.renewDate.toLocaleDateString('en-GB'))
              .attr('x', d => d.leftDays > 0 ? xScale(0) + 320 : 450)
              .attr('y', (d, i) => yScale(i) + 17)
              .attr('fill', 'black')
              .style('font-size', 12)
      )
  
  // const yAxis = d3.axisLeft(yScale)
      
  // yAxisgroup.call(yAxis)
}

extract()