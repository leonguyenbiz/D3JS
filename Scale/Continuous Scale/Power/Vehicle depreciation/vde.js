document.querySelector('button')
    .addEventListener('click', () => {
        let cost = document.querySelector('#cost').value
        let rate = document.querySelector('#rate').value
        cost = Number(cost)
        rate = Number(rate)

        const svgWidth = d3.select('#chart svg').node().clientWidth
        const svgHeight = d3.select('#chart svg').node().clientHeight

        const powerScale = d3.scalePow()
            .exponent(`${1 - rate / 100}`)
            .domain([`${cost}`, 0])
            .range([svgWidth, 0])

        const colorScale = d3.scalePow()
            .exponent(`${1 - rate / 100}`)
            .domain([`${cost}`, 0])
            .range(['green', 'pink'])

        let yearlyValue = []
        while(cost > 1000){
            cost = Math.pow(cost, 1 - (rate/100))
            yearlyValue.push(Math.round(cost))
        }
        console.log(yearlyValue)

        d3.select('svg')
            .selectAll('react')
            .data(yearlyValue)
            .join('rect')
            .attr('width', d => powerScale(d))
            .attr('height', svgHeight / yearlyValue.length - 5)
            .attr('x', 0)
            .attr('y', (d, i) => i*svgHeight/yearlyValue.length + 2)
            .style('fill', d => colorScale(d))

        d3.select('svg')
            .selectAll('text')
            .data(yearlyValue)
            .join('text')
            .text((d, i) => `At the end of year ${i + 1}, ${d}`)
            .attr('x', d => powerScale(d) + 10)
            .attr('y', (d, i) => i * svgHeight / yearlyValue.length + svgHeight / yearlyValue.length / 2)
            .style('fill', d => colorScale(d))
            .style('font-size', 12)
            .style('font-weight', 500)
    })

    // Time Scale
    let timeScale = d3.scaleTime()

    let myDate = new Date()
    console.log(myDate)

    timeScale.domain([new Date(2000, 0, 1), new Date(2000, 0, 31)])
    timeScale.range([1, 31])

    console.log(timeScale.invert(26))