async function draw(){
    // Loading data
    const dataSet = await d3.csv('/Scale/kqxs/kqxs.csv', d => {
        let day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return d
    })
    
    // console.log(dataSet)
    // console.log(range)
    const G1 = []
    const G2 = []
    let c1 = 0
    let c2 = 0
    let c5 = 0
    

    dataSet.forEach(d => {
        for (let i = 1; i < 28; ++i){
            if (parseInt(d['g'+i]) === 1){
                c1 += 1
            }
            else if (parseInt(d['g'+i]) === 2){
                c2 += 1
            }
            else if (parseInt(d['g'+i]) === 5){
                c5 += 1
            }
        }
    })


    const range = Array.from(Array(100).keys())

    let data = []
    for(let i = 0; i < range.length; ++i){
        let count = 0
        let temp = {}
        dataSet.forEach(d => {
            for (let j = 1; j < 28; ++j){
                if (range[i] === parseInt(d['g'+j])){
                    count += 1
                }
            }
        })
        temp.no = range[i]
        temp.count = count
        data.push(temp)
    }

    console.log(data)

    //scale
    const colorScale = d3.scaleLinear()
        .domain([d3.max(data, d=> d.count), d3.min(data, d => d.count)])
        .range(['green', 'red'])

    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', 10000)
        .attr('height', 1000)

    const svgWidth = d3.select('svg').node().clientWidth
    const svgHeight = d3.select('svg').node().clientHeight
    const dataLength = data.length

    svg.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('height', 9)
        .attr('width', d => d.count)
        .attr('x', -5)
        .attr('y', (d, i) => 15*i)
        .attr('fill', d => colorScale(d.count))
        .attr('rx', 5)
        .attr('ry', 5)
}

draw()