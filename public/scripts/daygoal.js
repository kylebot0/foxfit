// set the dimensions and margins of the graph
const margin = {top: 50, right: 50, bottom: 100, left: 80},
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
let svg = d3.select('#graph-container').append('svg')
    .attr('class', 'graph')
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
        return '#249E93'
    } else {
        return 'rgba(36, 158, 147,.5)'
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
        .call(d3.axisBottom(x).tickFormat((d) => {
            return getDay(d)
        }))
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

    svg.append('text')
        .attr('transform',`translate(-300, ${height/2}) rotate(270)`)
        .attr('y', height/2)
        .style('text-anchor', 'middle')
        .style('font-size', '1rem')
        .text('Totaal aantal punten')
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
    if(selectedValue !== 'all') {
        const data = {
            curweek: allData.data.dailyData.slice((selectedValue -1) * 7,selectedValue * 7),
            curweekgoal: allData.data.trophyData[goalweek] / 7
        }
        const allSVG = document.querySelectorAll('svg')
        if(allSVG.length > 1) {
            allSVG.forEach(svg => {
                svg.parentNode.removeChild(svg)
            })
            svg = d3.select('#graph-container').append('svg')
            .attr('class', 'graph')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 
                'translate(' + margin.left + ',' + margin.top + ')')
            createChart(data)
        } else {
            updateChart(data)
        }
        
    } else {
        const curSVG = document.querySelector('svg')
        curSVG.parentNode.removeChild(curSVG)
        for(let i = 0;i<6;i++) {
            const goalweek = 'goalweek' + (i+1)
            const data = {
                curweek: allData.data.dailyData.slice(i * 7,(i + 1) * 7),
                curweekgoal: allData.data.trophyData[goalweek] / 7
            }
            console.log(data)
            createAllCharts(data, i)
        }
    }
    
})

function createAllCharts(data, i) {
    const svg = d3.select('#graph-container').append('svg')
    .attr('class', 'graph')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 
        'translate(' + margin.left + ',' + margin.top + ')')
    // Scale the range of the data in the domains
    x.domain(data.curweek.map((d) => { return d.date }))
    y.domain([0, d3.max(data.curweek, (d) => { return d.totaalpunten })])

    // append the rectangles for the bar chart
    svg.selectAll(`.bar-${i}`)
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
        .call(d3.axisBottom(x).tickFormat((d) => {
            return getDay(d)
        }))
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

    svg.append('text')
        .attr('transform',`translate(-300, ${height/2}) rotate(270)`)
        .attr('y', height/2)
        .style('text-anchor', 'middle')
        .style('font-size', '1rem')
        .text('Totaal aantal punten')
    
    svg.append('text')
        .attr('x', '-40')
        .attr('y', '-25')
        .attr('dy', '.35em')
        .text('Week ' + (i + 1))
        .style('color', '#fff')
}

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
        .call(d3.axisBottom(x).tickFormat((d) => {
            return getDay(d)
        }))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-65)')
}


function getDay(d) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let date = new Date(d)
    let day = days[date.getDay()]
    return day
}