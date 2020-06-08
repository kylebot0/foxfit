// set the dimensions and margins of the graph
const margin = {top: 20, right: 20, bottom: 150, left: 40},
    width = 960 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom

// set the ranges
const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1)
const y = d3.scaleLinear()
    .range([height, 0])

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 
        'translate(' + margin.left + ',' + margin.top + ')')

// get url + fetch to get data
let allData
async function fetchData() {
    const getUrl = window.location
    const baseUrl = getUrl .protocol + '//' + getUrl.host
    return await fetch(baseUrl + '/data/all/PA043F3')
        .then(res => res.json())
        .then(res => {
            allData = res
            const data = {
                curweek: res.data.dailyData.slice(0, 7),
                curweekgoal: res.data.trophyData.goalweek1 / 7
            }
            return data
        })
}

function getColor(count, data) {
    if(count >= data.curweekgoal) {
        return 'green'
    } else if(count + (data.curweekgoal / 10) > data.curweekgoal) {
        return 'yellow'
    } else {
        return 'red'
    }
}

function createChart(data) {
    // Scale the range of the data in the domains
    x.domain(data.curweek.map((d) => { return d.date }))
    y.domain([0, d3.max(data.curweek, (d) => { return d.totaalpunten })])

    // append the rectangles for the bar chart
    svg.selectAll('.bar')
        .data(data.curweek)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return x(d.date) })
        .attr('width', x.bandwidth())
        .attr('y', function(d) { return y(d.totaalpunten) })
        .attr('height', function(d) { return height - y(d.totaalpunten) })
        .style('fill', (d) => getColor(d.totaalpunten, data))

    // add the x Axis
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-65)')

    // add the y Axis
    svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y))

    // add the goal line
    svg.append('line')
        .attr('class', 'goal')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(data.curweekgoal))
        .attr('y2', y(data.curweekgoal))
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '10,10')
        .attr('stroke', 'black')
}


async function plotData() {
    const data = await fetchData()
    createChart(data)
    console.log(data)
}
       
plotData()

const selector = document.querySelector('select')
selector.addEventListener('change', () => {
    const selectedValue = selector.options[selector.selectedIndex].value
    const goalweek = 'goalweek' + selectedValue
    const data = {
        curweek: allData.data.dailyData.slice((selectedValue -1) * 7,selectedValue * 7),
        curweekgoal: allData.data.trophyData[goalweek] / 7
    }
    updateChart(data)
})

function updateChart(data) {
    x.domain(data.curweek.map((d) => { return d.date }))
    y.domain([0, d3.max(data.curweek, (d) => { return d.totaalpunten })])

    svg.selectAll('.bar')
        .data(data.curweek) 
        .transition()
        .duration(300)
        .attr('y', function(d) { return y(d.totaalpunten) })
        .attr('height', function(d) { return height - y(d.totaalpunten) })
        .style('fill', (d) => getColor(d.totaalpunten, data))   

    svg.selectAll('.goal')
        .transition()
        .duration(300)
        .attr('y1', y(data.curweekgoal))
        .attr('y2', y(data.curweekgoal))

    svg.selectAll('.y-axis')
        .call(d3.axisLeft(y))

    svg.selectAll('.x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-65)')
}


