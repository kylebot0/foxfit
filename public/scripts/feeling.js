/* eslint-disable no-undef */

// SETTINGS
const settings = {
    container: {
        id: 'graph-container',
    },
    margins: {
        left:100,
        right:50,
        top:40,
        bottom: 40
    },
    spaceBetweenGraphs: 0,
    dayLabels: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
    
    visibleIntensities: {
        light: true,
        medium: true,
        heavy: true
    }
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

    
    const checkboxes = document.querySelectorAll('.checkbox-level')
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', e => { 

            const selectedWeekNr = weekSelectElement.selectedIndex
            const pamDataForWeek = filterForWeek(data.pamData, startDate, selectedWeekNr)
            const dailyDataForWeek = filterForWeek(data.daily, startDate, selectedWeekNr)

            settings.visibleIntensities[e.target.value] = e.target.checked

            updateMovementGraph(pamDataForWeek)
            updateFeelingGraph(dailyDataForWeek)
        })
    })

    createGraphs(pamDataForWeek, dailyDataForWeek)

    weekSelectElement.addEventListener('change', (event) => { 
        const selectedWeekNr = event.target.selectedIndex
        const pamDataForWeek = filterForWeek(data.pamData, startDate, selectedWeekNr)
        const dailyDataForWeek = filterForWeek(data.daily, startDate, selectedWeekNr)

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

    chartGroup.append('text')
        .attr('transform',`translate(-${settings.margins.left / 2 + 4 }, ${getters.movementGraph.getHeight() / 2}) rotate(270)`)
        .style('text-anchor', 'middle')
        .style('font-size', '1rem')
        .text('Beweging (minuten)')

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
        // const formatTime = d3.timeFormat('%A')
        // return formatTime(x)
    
        return settings.dayLabels[x.getDay()]
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
        
    chartGroup.append('text')
        .attr('transform',`translate(-${settings.margins.left / 2 + 4 }, ${getters.feelingGraph.getHeight() / 2}) rotate(270)`)
        .style('text-anchor', 'middle')
        .style('font-size', '1rem')
        .text('Gevoelsscore')
        
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
        .attr('y', function(d) { 
            let yPos = 0
            return settings.visibleIntensities.light ? y(d.light_activity) : y(0)
        })
        .attr('height', function(d) {
            if (!settings.visibleIntensities.light) return 0
            return getters.movementGraph.getHeight() - y(d.light_activity) 
        })
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
        .attr('y', function(d) { 
            let yPos = 0
            if (settings.visibleIntensities.light) yPos += d.light_activity
            if (settings.visibleIntensities.medium) yPos += d.medium_activity
            return y(yPos) 
        })
        .attr('height', function(d) { 
            if (!settings.visibleIntensities.medium) return 0
            return getters.movementGraph.getHeight() - y(d.medium_activity) 
        })
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
        .attr('y', function(d) {
            let yPos = 0
            if (settings.visibleIntensities.light) yPos += d.light_activity
            if (settings.visibleIntensities.medium) yPos += d.medium_activity
            if (settings.visibleIntensities.heavy) yPos += d.heavy_activity
            return y(yPos) 
        })
        .attr('height', function(d) { 
            if (!settings.visibleIntensities.heavy) return 0
            return getters.movementGraph.getHeight() - y(d.heavy_activity) 
        })
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
        .on('mouseover', function(d) {
            handleMouseOver(chartGroup, this, 'rgb(26, 71, 75)', d.morningfeel <= 0 ? 0 : d.morningfeel, 'ochtend' )
        })
        .on('mouseout', function(d) {
            const color = d.morningfeel < 0 ? 'white' : '#9DD3CF'
            handleMouseOut(chartGroup, this, color)
        })     
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
        .on('mouseover', function(d) {
            handleMouseOver(chartGroup, this, 'rgb(26, 71, 75)', d.eveningfeel <= 0 ? 0 : d.eveningfeel, 'avond')
        })
        .on('mouseout', function(d) {
            const color = d.eveningfeel < 0 ? 'white' : '#249E93'
            handleMouseOut(chartGroup, this, color)
        })     
        .attr('class', 'bar-evening')
        .attr('x', function(d) { return x(new Date(d.date)) + x.bandwidth() / 2 })
        .attr('width', x.bandwidth() / 2)
        .transition()
        .duration(300)
        .attr('y', function(d) { return y(d.eveningfeel < 0 ? 10 : d.eveningfeel) })
        .attr('height', function(d) { return getters.feelingGraph.getHeight() - y(d.eveningfeel < 0 ? 10 : d.eveningfeel) })
        .style('fill', d => d.eveningfeel < 0 ? 'white' : '#249E93')
}

function handleMouseOver(chartGroup, object, color, textValue, labelText) {
    if (textValue !== 0) {
        const bar = d3.select(object)
    
        bar.transition().duration(100).style('fill', color)
        
        const x = Number(bar.attr('x')) + Number((bar.attr('width') / 2))    
        const y = getters.feelingGraph.getHeight() - bar.attr('height') - 5
        
        const labelY = getters.feelingGraph.getHeight() - (bar.attr('height') / 2)
        
        chartGroup
            .append('text')
            .attr('class', 'tooltip')
            .style('text-anchor', 'middle')
            .style('font-size', '1rem')
            .attr('x', x)
            .attr('y', y)
            .text(textValue)
    
        chartGroup
            .append('text')
            .attr('class', 'bar-label')
            .style('text-anchor', 'middle')
            .style('font-size', '1rem')
            .attr('transform', `translate(${x}, ${labelY}) rotate(270)`)
            .text(labelText)
    }
}
function handleMouseOut(chartGroup, object, color) {
    d3.select(object).transition().duration(100).style('fill', color)
    chartGroup.selectAll('.tooltip').remove()
    chartGroup.selectAll('.bar-label').remove()
}

makeLegend()

function makeLegend() {
    const subGroups = ['licht', 'medium', 'zwaar']
    const legendTexts = ['lichte beweging', 'medium beweging', 'zware beweging']
    const width = window.innerWidth
    const topPosition = -20

    const colors = d3.scaleOrdinal()
        .domain(subGroups)
        .range(['#9dd3cf', '#3cc3b8', '#249e93'])

    const legend = d3.select('#feeling-legend')

    const legendGroup = legend.selectAll('g')
        .data(subGroups)
        .enter()
        .append('g')
        .on('click', function(d) {
            d3.select(this).classed('inactive', d3.select(this).classed('inactive') ? false : true)
            console.log(`#${d}`)
            
            document.getElementById(d).click()
            
        })
        .attr('y', 40 + topPosition)
        .attr('x', (d, i) => {
            return (width / 2) + i * 200 - 200
        })

    legendGroup.append('rect')
        .attr('class', 'checkbox')
        .attr('y', 40 + topPosition)
        .attr('x', (d, i) => {
            return (width / 2) + i * 200 - 200 - 10
        })
        .attr('width', 20)
        .attr('height', 20)
        .attr('stroke', 'rgb(43, 116, 122)')
        .attr('stroke-width', '2')
        .attr('fill', (d, i) => {
            return colors(i)
        })

    legendGroup
        .append('line')
        .attr('class', 'vinkje')
        .attr('y1', 50 + topPosition)
        .attr('y2', 55 + topPosition)
        .attr('x1', (d, i) => {
            return (width / 2) + i * 200 - 5 - 200
        })
        .attr('x2', (d, i) => {
            return (width / 2) + i * 200 - 200
        })
        .attr('stroke-width', 2)
        .attr('stroke', 'rgb(43, 116, 122)')

    legendGroup
        .append('line')
        .attr('class', 'vinkje')
        .attr('y1', 55 + topPosition)
        .attr('y2', 43 + topPosition)
        .attr('x1', (d, i) => {
            return (width / 2) + i * 200 - 200
        })
        .attr('x2', (d, i) => {
            return (width / 2) + i * 200 + 7 - 200
        })
        .attr('stroke-width', 2)
        .attr('stroke', 'rgb(43, 116, 122)')

    legendGroup.append('text')
        .text((d, i) => {
            return legendTexts[i]
        })
        .attr('y', 70 + topPosition)
        .attr('x', (d, i) => {
            return (width / 2) + (i * 200) - 200
        })
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'hanging')
        .style('font-size', '1rem')
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