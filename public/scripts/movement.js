/* eslint-disable no-undef */

// EXECUTED FUNCTIONS

getData().then(data => {
    const weekSelectElement = document.getElementById('select-week')

    weekSelectElement.addEventListener('change', (event) => {
        const startDate = new Date(data.user[0].startdate)   
        const selectedWeekNr = event.target.selectedIndex
        const pamDataForWeek = filterForWeek(data.pamData, startDate, selectedWeekNr)
        const dailyDataForWeek = filterForWeek(data.daily, startDate, selectedWeekNr)

        createGraphs(pamDataForWeek, dailyDataForWeek)
        // updateFeelingGraph(dailyDataForWeek)
    })
})

// GRAPH FUNCTIONS

function createGraphs(pamData, dailyData) {    
    const graphContainer = document.getElementById('graph-container')
    graphContainer.innerHTML = ''

    // graph size dynamics
    const [containerWidth, containerHeight] = [graphContainer.offsetWidth, graphContainer.offsetHeight]
    
    const margin = {left:50, right:50, top:40, bottom: 40}
    const gapHeight = 30

    const [movementGraphWidth, movementGraphHeight] = [containerWidth - margin.left - margin.right , (containerHeight / 2) - margin.top - gapHeight /2]
    const [feelingGraphWidth, feelingGraphHeight] = [containerWidth - margin.left - margin.right , (containerHeight / 2) - margin.bottom - gapHeight /2]

    console.log(pamData)    

    // create svg
    const svg = d3.select('#graph-container').append('svg')
        .attr('height', containerHeight)
        .attr('width', containerWidth)
        .attr('id', 'movement-graph')

    createMovementGraph(svg, pamData, movementGraphWidth, movementGraphHeight, margin)
    createFeelingGraph(svg, dailyData, feelingGraphWidth, feelingGraphHeight, movementGraphHeight, gapHeight,  margin)
}

function createMovementGraph(svg, pamData, graphWidth, graphHeight, margin) {
    const x = d3.scaleBand()
        .domain(pamData.map(d => new Date(d.date)))
        .range([0, graphWidth])
        .paddingInner(0.2)
        .paddingOuter(0.2)

    const y = d3.scaleLinear()
        .domain([0, 400])
        .range([graphHeight, 0])

    const xAxis = d3.axisBottom(x).ticks(7)
    const yAxis = d3.axisLeft(y).ticks(9).tickPadding(10).tickSize(2)

    const chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

    chartGroup.append('g')
        .attr('class','axis y')
        .call(yAxis)

    chartGroup.append('g')
        .attr('class','axis x')
        .attr('transform', `translate(0, ${graphHeight})`)
        .call(xAxis)

    chartGroup.selectAll('.bar-light')
        .data(pamData)
        .enter().append('rect')
        .attr('class', 'bar-light')
        .style('fill', '#ffeebf')
        .attr('x', function(d) { return x(new Date(d.date)) })
        .attr('width', x.bandwidth())
        .attr('y', function(d) { return y(d.light_activity) })
        .attr('height', function(d) { return graphHeight - y(d.light_activity) })

    chartGroup.selectAll('.bar-medium')
        .data(pamData)
        .enter().append('rect')
        .attr('class', 'bar-medium')
        .style('fill', '#ffd970')
        .attr('x', function(d) { return x(new Date(d.date)) })
        .attr('width', x.bandwidth())
        .attr('y', function(d) { return y(d.medium_activity + d.light_activity) })
        .attr('height', function(d) { return graphHeight - y(d.medium_activity) })

    chartGroup.selectAll('.bar-heavy')
        .data(pamData)
        .enter().append('rect')
        .attr('class', 'bar-heavy')
        .style('fill', '#ffbb00')
        .attr('x', function(d) { return x(new Date(d.date)) })
        .attr('width', x.bandwidth())
        .attr('y', function(d) { return y(d.heavy_activity + d.medium_activity + d.light_activity) })
        .attr('height', function(d) { return graphHeight - y(d.heavy_activity) })
}


function createFeelingGraph(svg, dailyData, graphWidth, graphHeight, upperGraphHeight, gapHeight, margin) {
    console.log(dailyData)
    
    const x = d3.scaleBand()
        .domain(dailyData.map(d => new Date(d.date)))
        .range([0, graphWidth])
        .paddingInner(0.2)
        .paddingOuter(0.2)

    const y = d3.scaleLinear()
        .domain([0, 10])
        .range([graphHeight, 0])

    const xAxis = d3.axisBottom(x).ticks(7)
    const yAxis = d3.axisLeft(y).ticks(9).tickPadding(10).tickSize(2)

    const chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top + upperGraphHeight + gapHeight})`)

    chartGroup.append('g')
        .attr('class','axis y')
        .call(yAxis)

    chartGroup.append('g')
        .attr('class','axis x')
        .attr('transform', `translate(0, ${graphHeight})`)
        .call(xAxis)

    chartGroup.selectAll('.bar-morning')
        .data(dailyData)
        .enter().append('rect')
        .attr('class', 'bar-morning')
        .style('fill', '#ffeebf')
        .attr('x', function(d) { return x(new Date(d.date)) })
        .attr('width', x.bandwidth())
        .attr('y', function(d) { return y(d.morningfeel) })
        .attr('height', function(d) { return graphHeight - y(d.morningfeel) })
}


function updateMovementGraph(pamData) {
    console.log(pamData)    
}

// MAIN FUNCTIONS
async function getData() {
    const baseUrl = window.location.protocol + '//' + window.location.host
    const endpoint = '/data/movement/'
    const userID = 'PA043F3'
    const response = await fetch(`${baseUrl}${endpoint}${userID}`)
    const json = await response.json()    
    return json.data
}

// HELPER FUNCTIONS
function filterForWeek(data, startDate, weekNumber) {
    const filteredData = data.filter((datapoint) => {
        return isWithinSelectedWeek(datapoint, startDate, weekNumber)
    })
    return filteredData    
}

function getDayDifference(date1, date2) {
    const diffTime = Math.abs(date1 - date2)
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return date2 < date1 ? diffDays * -1 : diffDays
}

// CHECKER FUNCTIONS
function isWithinSelectedWeek(datapoint, startDate, weekNumber) {
    const dateForDataPoint = new Date(datapoint.date)
    const daysAway = getDayDifference(startDate, dateForDataPoint)
    const withinWeek = daysAway <= 7 * weekNumber && daysAway > 7 * (weekNumber - 1)
    return withinWeek ? true : false
}