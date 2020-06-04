/* eslint-disable no-undef */

// EXECUTED FUNCTIONS

getData().then(data => {
    const weekSelectElement = document.getElementById('select-week')

    weekSelectElement.addEventListener('change', (event) => {
        const startDate = new Date(data.user[0].startdate)   
        const selectedWeekNr = event.target.selectedIndex
        const pamDataForWeek = filterForWeek(data.pamData, startDate, selectedWeekNr)
        const dailyDataForWeek = filterForWeek(data.daily, startDate, selectedWeekNr)

        const averageFeel = d3.mean(data.daily, (d) => {
            return d3.mean([d.morningfeel, d.eveningfeel], d => d < 0 ? 'not valid' : d )
        })

        createGraphs(pamDataForWeek, dailyDataForWeek, averageFeel)
        // updateFeelingGraph(dailyDataForWeek)
    })
})

// GRAPH FUNCTIONS

function createGraphs(pamData, dailyData, averageFeel) {    
    const graphContainer = document.getElementById('graph-container')
    graphContainer.innerHTML = ''

    // graph size dynamics
    const [containerWidth, containerHeight] = [graphContainer.offsetWidth, graphContainer.offsetHeight]
    
    const margin = {left:50, right:50, top:40, bottom: 40}
    const gapHeight = 0

    const [movementGraphWidth, movementGraphHeight] = [containerWidth - margin.left - margin.right , (containerHeight / 2) - margin.top - gapHeight /2]
    const [feelingGraphWidth, feelingGraphHeight] = [containerWidth - margin.left - margin.right , (containerHeight / 2) - margin.bottom - gapHeight /2]

    console.log(pamData)    

    // create svg
    const svg = d3.select('#graph-container').append('svg')
        .attr('height', containerHeight)
        .attr('width', containerWidth)
        .attr('id', 'movement-graph')

    createMovementGraph(svg, pamData, movementGraphWidth, movementGraphHeight, margin)
    createFeelingGraph(svg, dailyData, averageFeel, feelingGraphWidth, feelingGraphHeight, movementGraphHeight, gapHeight, margin)
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

    const xAxis = d3.axisBottom(x).ticks(0).tickFormat('').tickSize(0)
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
        .style('fill', '#9DD3CF')
        .attr('x', function(d) { return x(new Date(d.date)) })
        .attr('width', x.bandwidth())
        .attr('y', function(d) { return y(d.light_activity) })
        .attr('height', function(d) { return graphHeight - y(d.light_activity) })

    chartGroup.selectAll('.bar-medium')
        .data(pamData)
        .enter().append('rect')
        .attr('class', 'bar-medium')
        .style('fill', '#3CC3B8')
        .attr('x', function(d) { return x(new Date(d.date)) })
        .attr('width', x.bandwidth())
        .attr('y', function(d) { return y(d.medium_activity + d.light_activity) })
        .attr('height', function(d) { return graphHeight - y(d.medium_activity) })

    chartGroup.selectAll('.bar-heavy')
        .data(pamData)
        .enter().append('rect')
        .attr('class', 'bar-heavy')
        .style('fill', '#249E93')
        .attr('x', function(d) { return x(new Date(d.date)) })
        .attr('width', x.bandwidth())
        .attr('y', function(d) { return y(d.heavy_activity + d.medium_activity + d.light_activity) })
        .attr('height', function(d) { return graphHeight - y(d.heavy_activity) })
}


function createFeelingGraph(svg, dailyData, averageFeel, graphWidth, graphHeight, upperGraphHeight, gapHeight, margin) {
    console.log(dailyData)
    const averageFeelForThisWeek = d3.mean(dailyData, (d) => { return d3.mean([d.morningfeel, d.eveningfeel], d => d < 0 ? 'not valid' : d ) })

    const x = d3.scaleBand()
        .domain(dailyData.map(d => new Date(d.date)))
        .range([0, graphWidth])
        .paddingInner(0.2)
        .paddingOuter(0.2)

    const y = d3.scaleLinear()
        .domain([0, 12])
        .range([graphHeight, 0])

    const xAxis = d3.axisBottom(x).ticks(7).tickFormat(x => {
        const formatTime = d3.timeFormat('%A')
        return formatTime(x)
    })
    const yAxis = d3.axisLeft(y).ticks(9).tickPadding(10).tickSize(2)

    const chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top + upperGraphHeight + gapHeight})`).attr('class', 'feel-graph')

    chartGroup.append('g')
        .attr('class','feel-axis-y axis y')
        .call(yAxis)

    chartGroup.append('g')
        .attr('class','axis x')
        .attr('transform', `translate(0, ${graphHeight})`)
        .call(xAxis)
        
    chartGroup.selectAll('.bar-divider')
        .data(dailyData)
        .enter().append('line')
        .attr('class', 'bar-divider')
        .attr('x1', function(d) {
            let currentDate = new Date(d.date)
            currentDate.setDate(currentDate.getDate() + 1)
            let newX = x(currentDate) - (x.paddingInner() * graphWidth / 14)
            return newX > 0 ? newX : graphWidth - (x.paddingInner() * graphWidth / 14)
        })
        .attr('y1', 0)
        .attr('x2', function(d) {
            let currentDate = new Date(d.date)
            currentDate.setDate(currentDate.getDate() + 1)
            let newX = x(currentDate) - (x.paddingInner() * graphWidth / 14)
            return newX > 0 ? newX : graphWidth - (x.paddingInner() * graphWidth / 14)
        })
        .attr('y2', graphHeight)
        .attr('stroke-width', 0.5)
        .attr('stroke', '#197068')
        .attr('stroke-dasharray', 4)

    chartGroup.selectAll('.bar-morning')
        .data(dailyData)
        .enter().append('rect')
        .attr('class', 'bar-morning')
        .style('fill', d => d.morningfeel < 0 ? '#ededed' : '#9DD3CF')
        .attr('x', function(d) { return x(new Date(d.date)) })
        .attr('width', x.bandwidth() / 2)
        .attr('y', function(d) { return y(d.morningfeel < 0 ? 10 : d.morningfeel) })
        .attr('height', function(d) { return graphHeight - y(d.morningfeel < 0 ? 10 : d.morningfeel) })

    chartGroup.selectAll('.bar-evening')
        .data(dailyData)
        .enter().append('rect')
        .attr('class', 'bar-evening')
        .style('fill', d => d.eveningfeel < 0 ? 'none' : '#249E93')
        .attr('x', function(d) { return x(new Date(d.date)) + x.bandwidth() / 2 })
        .attr('width', x.bandwidth() / 2)
        .attr('y', function(d) { return y(d.eveningfeel < 0 ? 10 : d.eveningfeel) })
        .attr('height', function(d) { return graphHeight - y(d.eveningfeel < 0 ? 10 : d.eveningfeel) })
    
    chartGroup.append('line')
        .attr('class', 'baseline')
        .attr('x1', 0)
        .attr('y1', y(averageFeelForThisWeek))
        .attr('x2', graphWidth)
        .attr('y2', y(averageFeelForThisWeek))
        .attr('stroke-width', 1)
        .attr('stroke', '#197068')

    chartGroup.append('line')
        .attr('class', 'total-average')
        .attr('x1', 0)
        .attr('y1', y(averageFeel))
        .attr('x2', graphWidth)
        .attr('y2', y(averageFeel))
        .attr('stroke-width', 1)
        .attr('stroke', '#197068')
        .attr('stroke-dasharray', 4)

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