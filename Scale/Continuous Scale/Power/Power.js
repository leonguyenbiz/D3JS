//d3.scalePow() = d3.scaleLinear()
let powerScale = d3.scalePow()
let linearScale = d3.scaleLinear()

// .exponent()
powerScale.exponent(2)

// .domain() and .range()
powerScale.domain([2, 4]).range([9, 10])
linearScale.domain([2, 4]).range([9, 10])