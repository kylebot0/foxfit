/* eslint-disable no-undef */

// SETTINGS
const settings = {
    container: {
        id: 'graph-container',
    },
    margins: {
        left:50,
        right:50,
        top:40,
        bottom: 40
    },
    spaceBetweenGraphs: 0
}

const getters = {
    container: {
        getElement: () => document.getElementById(settings.container.id),
        getWidth: () => getters.container.getElement().offsetWidth,
        getHeight: () => getters.container.getElement().offsetHeight
    },
    movementGraph: {
        getWidth: () => getters.container.getWidth() - settings.margins.left - settings.margins.right,
        getHeight: () => (getters.container.getHeight() / 2) - settings.margins.top - settings.spaceBetweenGraphs / 2
    },
    feelingGraph: {
        getWidth: () => getters.container.getWidth() - settings.margins.left - settings.margins.right,
        getHeight: () => (getters.container.getHeight() / 2) - settings.margins.bottom - settings.spaceBetweenGraphs /2
    }
}


// EXECUTION
getData().then(data => {
    const weekSelectElement = document.getElementById('select-week')
    const startDate = new Date(data.user[0].startdate)   
    const selectedWeekNr = weekSelectElement.selectedIndex
    const pamDataForWeek = filterForWeek(data.pamData, startDate, selectedWeekNr)
    const dailyDataForWeek = filterForWeek(data.daily, startDate, selectedWeekNr)

    createGraphs(pamDataForWeek, dailyDataForWeek)

    weekSelectElement.addEventListener('change', (event) => { 
        const selectedWeekNr = event.target.selectedIndex
        const pamDataForWeek = filterForWeek(data.pamData, startDate, selectedWeekNr)
        const dailyDataForWeek = filterForWeek(data.daily, startDate, selectedWeekNr)

        // createGraphs(pamDataForWeek, dailyDataForWeek)
        updateMovementGraph(pamDataForWeek)
        updateFeelingGraph(dailyDataForWeek)
    })
})

// GRAPH FUNCTIONS
function createGraphs(pamData, dailyData) {
    // clear container (remove when update function is finished)
    getters.container.getElement().innerHTML = ''

    // graph size dynamics
    
    console.log(pamData)    

    // create svg
    const svg = d3.select('#graph-container').append('svg')
        .attr('height', getters.container.getHeight())
        .attr('width', getters.container.getWidth())
        .attr('class', 'graph')

    createMovementGraph(svg, pamData)
    createFeelingGraph(svg, dailyData)
}

function createMovementGraph(svg, pamData) {
    
    const x = d3.scaleBand()
        .domain(pamData.map(d => new Date(d.date)))
        .range([0, getters.movementGraph.getWidth()])
        .paddingInner(0.2)
        .paddingOuter(0.2)

    const y = d3.scaleLinear()
        .domain([0, 400])
        .range([getters.movementGraph.getHeight(), 0])

    const xAxis = d3.axisBottom(x).ticks(0).tickFormat('').tickSize(0)
    const yAxis = d3.axisLeft(y).ticks(9).tickPadding(10).tickSize(2)

    const chartGroup = svg.append('g')
        .attr('transform', `translate(${settings.margins.left}, ${settings.margins.top})`)
        .attr('id', 'chart-group-movement')

    chartGroup.append('g')
        .attr('class','axis y')
        .call(yAxis)

    chartGroup.append('g')
        .attr('class','axis x')
        .attr('transform', `translate(0, ${getters.movementGraph.getHeight()})`)
        .call(xAxis)

    updateMovementGraph(pamData)
}

function createFeelingGraph(svg, dailyData) {

    const x = d3.scaleBand()
        .domain(dailyData.map(d => new Date(d.date)))
        .range([0, getters.feelingGraph.getWidth()])
        .paddingInner(0.2)
        .paddingOuter(0.2)

    const y = d3.scaleLinear()
        .domain([0, 12])
        .range([getters.feelingGraph.getHeight(), 0])

    const xAxis = d3.axisBottom(x).ticks(7).tickFormat(x => {
        const formatTime = d3.timeFormat('%A')
        return formatTime(x)
    })

    const yAxis = d3.axisLeft(y).ticks(9).tickPadding(10).tickSize(2)

    const chartGroup = svg.append('g')
        .attr('transform', `translate(${settings.margins.left}, ${settings.margins.top + getters.movementGraph.getHeight() + settings.spaceBetweenGraphs})`)
        .attr('class', 'feel-graph')    
        .attr('id', 'chart-group-feeling')

    chartGroup.append('g')
        .attr('class','feel-axis-y axis y')
        .call(yAxis)

    chartGroup.append('g')
        .attr('class','axis x')
        .attr('transform', `translate(0, ${getters.feelingGraph.getHeight()})`)
        .call(xAxis)
        
    chartGroup.selectAll('.bar-divider')
        .data(dailyData)
        .enter().append('line')
        .attr('class', 'bar-divider')
        .attr('x1', function(d) {
            let currentDate = new Date(d.date)
            currentDate.setDate(currentDate.getDate() + 1)
            let newX = x(currentDate) - (x.paddingInner() * getters.feelingGraph.getWidth() / 14)
            return newX > 0 ? newX : getters.feelingGraph.getWidth() - (x.paddingInner() * getters.feelingGraph.getWidth() / 14)
        })
        .attr('y1', 0)
        .attr('x2', function(d) {
            let currentDate = new Date(d.date)
            currentDate.setDate(currentDate.getDate() + 1)
            let newX = x(currentDate) - (x.paddingInner() * getters.feelingGraph.getWidth() / 14)
            return newX > 0 ? newX : getters.feelingGraph.getWidth() - (x.paddingInner() * getters.feelingGraph.getWidth() / 14)
        })
        .attr('y2', getters.feelingGraph.getHeight())
        .attr('stroke-width', 0.5)
        .attr('stroke', '#197068')
        .attr('stroke-dasharray', 4)

    updateFeelingGraph(dailyData)
}

function updateMovementGraph(pamData) {
    const chartGroup = d3.select('#chart-group-movement')

    const x = d3.scaleBand()
        .domain(pamData.map(d => new Date(d.date)))
        .range([0, getters.movementGraph.getWidth()])
        .paddingInner(0.2)
        .paddingOuter(0.2)

    const y = d3.scaleLinear()
        .domain([0, 400])
        .range([getters.movementGraph.getHeight(), 0])

    const selectedBarLightElements = 
    chartGroup.selectAll('.bar-light')
        .data(pamData)

    const selectedBarMediumElements = 
    chartGroup.selectAll('.bar-medium')
        .data(pamData)

    const selectedBarHeavyElements = 
    chartGroup.selectAll('.bar-heavy')
        .data(pamData)

    selectedBarLightElements
        .exit().remove()
    selectedBarLightElements
        .enter().append('rect').merge(selectedBarLightElements)
        .attr('class', 'bar-light')
        .attr('x', function(d) { return x(new Date(d.date)) })
        .attr('width', x.bandwidth())
        .transition()
        .duration(300)
        .attr('y', function(d) { return y(d.light_activity) })
        .attr('height', function(d) { return getters.movementGraph.getHeight() - y(d.light_activity) })
        .style('fill', '#9DD3CF')

    selectedBarMediumElements
        .exit().remove()
    selectedBarMediumElements
        .enter().append('rect').merge(selectedBarMediumElements)
        .attr('class', 'bar-medium')
        .attr('x', function(d) { return x(new Date(d.date)) })
        .attr('width', x.bandwidth())
        .transition()
        .duration(300)
        .attr('y', function(d) { return y(d.medium_activity + d.light_activity) })
        .attr('height', function(d) { return getters.movementGraph.getHeight() - y(d.medium_activity) })
        .style('fill', '#3CC3B8')

    selectedBarHeavyElements
        .exit().remove()
    selectedBarHeavyElements
        .enter().append('rect').merge(selectedBarHeavyElements)
        .attr('class', 'bar-heavy')
        .attr('x', function(d) { return x(new Date(d.date)) })
        .attr('width', x.bandwidth())
        .transition()
        .duration(300)
        .attr('y', function(d) { return y(d.heavy_activity + d.medium_activity + d.light_activity) })
        .attr('height', function(d) { return getters.movementGraph.getHeight() - y(d.heavy_activity) })
        .style('fill', '#249E93')
}

function updateFeelingGraph(dailyData) {
    
    const chartGroup = d3.select('#chart-group-feeling')    

    const selectedBarMorningElements = 
    chartGroup.selectAll('.bar-morning').data(dailyData)

    const selectedBarEveningElements =
    chartGroup.selectAll('.bar-evening').data(dailyData)

    const x = d3.scaleBand()
        .domain(dailyData.map(d => new Date(d.date)))
        .range([0, getters.feelingGraph.getWidth()])
        .paddingInner(0.2)
        .paddingOuter(0.2)

    const y = d3.scaleLinear()
        .domain([0, 12])
        .range([getters.feelingGraph.getHeight(), 0])
    
    selectedBarMorningElements.exit().remove()
    selectedBarMorningElements.enter().append('rect').merge(selectedBarMorningElements)
        .attr('class', 'bar-morning')
        .attr('x', function(d) { return x(new Date(d.date)) })
        .attr('width', x.bandwidth() / 2)
        .transition()
        .duration(300)
        .attr('y', function(d) { return y(d.morningfeel < 0 ? 10 : d.morningfeel) })
        .attr('height', function(d) { return getters.feelingGraph.getHeight() - y(d.morningfeel < 0 ? 10 : d.morningfeel) })
        .style('fill', d => d.morningfeel < 0 ? 'white' : '#9DD3CF')

    selectedBarEveningElements.exit().remove()    
    selectedBarEveningElements.enter().append('rect').merge(selectedBarEveningElements)
        .attr('class', 'bar-evening')
        .attr('x', function(d) { return x(new Date(d.date)) + x.bandwidth() / 2 })
        .attr('width', x.bandwidth() / 2)
        .transition()
        .duration(300)
        .attr('y', function(d) { return y(d.eveningfeel < 0 ? 10 : d.eveningfeel) })
        .attr('height', function(d) { return getters.feelingGraph.getHeight() - y(d.eveningfeel < 0 ? 10 : d.eveningfeel) })
        .style('fill', d => d.eveningfeel < 0 ? 'white' : '#249E93')
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