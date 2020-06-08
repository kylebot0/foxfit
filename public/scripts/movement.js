const margin = {
        top: 200,
        right: 200,
        bottom: 150,
        left: 200
    },
    width = window.innerWidth - margin.left - margin.right,
    height = 1250 - margin.top - margin.bottom

let isThereAChart = false
let isThereALegend = false

const svg = d3.select('body').append('svg')
    .attr('class', 'graph')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')')


// =======================GET DATA================================
const getUrl = window.location
const baseUrl = getUrl.protocol + '//' + getUrl.host
async function getData() {
    const baseUrl = window.location.protocol + '//' + window.location.host
    const endpoint = '/data/all/'
    const userID = 'PA043F3'
    const response = await fetch(`${baseUrl}${endpoint}${userID}`)
    const json = await response.json()
    return json
}

function transformData(rawData) {
    const data = []
    let week = []
    let count = 1
    rawData.data.pamData.forEach((item, i) => {
        let activity = {
            date: item.date,
            total: (item.light_activity + item.medium_activity + item.heavy_activity),
            light: item.light_activity,
            medium: item.medium_activity,
            heavy: item.heavy_activity
        }
        if (week.length >= 7) {
            data.push({
                week: count,
                group: week
            })
            count = count + 1
            week = []
            week.push(activity)
            return
        } else {
            week.push(activity)
        }
    })
    return data
}
// =========================================
// =============Select option===============
// =========================================
init()

async function init(){
    let rawData = await getData()
    let transformedData = transformData(rawData)
    bindSelect(transformedData)
}

function bindSelect(data){
    data.forEach((item) => {
        let option = 'Week ' + item.week
        let markup = `<option value="${item.week}">${option}</option>`
        let select = document.querySelector('select')
        select.insertAdjacentHTML('beforeend', markup)
    })

    makeChart(1, data)

    d3.select('select').on('change', function (d) {
        let val = d3.select('option:checked').node().value
        d3.selectAll('.bar').transition().duration(1000).attr('width', '0').on('end', crt)
        function crt(){
            d3.selectAll('.bar').remove()
            d3.selectAll('.tick').remove()
            makeChart(val, data)
        }
        
        // update(val, data)
    })
}


// =========================================
// =============Bar chart===================
// =========================================

function getSubGroup(val, data) {
    const subgroups = Object.keys({
        light: data[val].light_activity,
        medium: data[val].medium_activity,
        heavy: data[val].heavy_activity
    })
    return subgroups
}

function getStackedData(subgroups, val, data) {
    const stackedData = d3.stack()
        .keys(subgroups)
        (data[val].group)
    return stackedData
}

function getGroup(val, data) {
    const groups = d3.map(data[val].group, (d) => {
        return (d.date)
    }).keys()
    return groups
}

function makeBars(subGroups, newData, maxValue, groups) {
    const x = d3.scaleLinear()
        .domain([0, 400])
        .nice()
        .range([0, width])
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))

    const y = d3.scaleBand()
        .range([0, height])
        .domain(groups)
    svg.append('g')
        .call(d3.axisLeft(y).tickFormat((d) => {
            return getDay(d)
        }))

    const color = d3.scaleOrdinal()
        .domain(subGroups)
        .range(['#1AC6D0', '#15989F', '#382183'])



    let bars = svg.append('g')
        .selectAll('g')
        .data(newData)
        .enter().append('g')

    // console.log(bars)

    bars
        .attr('fill', function (d) {
            return color(d.key)
        })
        .attr('class', (d) => {
            return d.key + ' chart'
        })
        .selectAll('rect')
        .data(function (d) {
            return d
        })
        .enter().append('rect')
        .attr('class', (d) => {
            return 'bar'
        })
        .attr('x', (d) => {
            return x(d[0])
        })
        .attr('y', function (d) {
            return y(d.data.date)
        })
        .attr('width', '0')
        .transition()
        .duration(1000)
        .attr('width', function (d) {
            let x1 = x(d[1])
            let x2 = x(d[0])
            let coords = (x1 - x2)
            return coords
        })
        .attr('height', (y.bandwidth() - 50))

    isThereAChart = true
}

function makeLegend(subGroups, val) {
    const colors = d3.scaleOrdinal()
        .domain(subGroups)
        .range(['#1AC6D0', '#15989F', '#382183'])

    const legend = d3.select('svg').append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (width / 2) + ', 100)')

    legend.selectAll('rect')
        .data(subGroups)
        .enter()
        .append('rect')
        .attr('id', (d) => {
            return d
        })
        .attr('class', 'active')
        .attr('y', 0)
        .attr('x', (d, i) => {
            return i * 200
        })
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', (d, i) => {
            return colors(i)
        })

    legend.selectAll('text')
        .data(subGroups)
        .enter()
        .append('text')
        .text((d) => {
            let text = capitalizeFirstLetter(d) + ' activity'
            return text
        })
        .attr('y', 25)
        .attr('x', (d, i) => {
            return (i * 200) - 50
        })
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'hanging')

    legend.selectAll('rect')
        .on('click', function (d) {
            let thisRect = this
            onClick(thisRect, val)
        })
}


function makeChart(val, data) {
    let subGroups = getSubGroup(val, data)
    let newData = getStackedData(subGroups, val, data)
    let groups = getGroup(val, data)
    let maxValue = maxVal(data[val].group.map((item) => {
        return item.total
    }))
    makeBars(subGroups, newData, maxValue, groups)
    if (isThereALegend) {
        return
    } else {
        makeLegend(subGroups, val)
        isThereALegend = true
    }
}
// =========================================
// =============Update======================
// =========================================
function update(val, data) {
    d3.selectAll('.bar').transition().duration(1000).attr('width', '0').on('end', updateChart)

    function updateChart() {
        // d3.selectAll('.bar').remove()
        // d3.selectAll('.tick').remove()
        // makeChart(val)
        let subGroups = getSubGroup(val, data)
        let newData = getStackedData(subGroups, val, data)
        let groups = getGroup(val, data)

        const x = d3.scaleLinear()
            .domain([0, 400])
            .nice()
            .range([0, width])
        svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x))

        const y = d3.scaleBand()
            .range([0, height])
            .domain(groups)
        svg.append('g')
            .call(d3.axisLeft(y).tickFormat((d) => {
                return getDay(d)
            }))

        let bars = svg.append('g')
            .selectAll('g')
            .data(newData)
            .enter().append('g')

        bars
            .data(function (d) {
                console.log(d)
                return d
            })
            .enter()
            .attr('x', (d) => {
                return x(d[0])
            })
            .attr('y', function (d) {
                return y(d.data.date)
            })
            .attr('width', function (d) {
                let x1 = x(d[1])
                let x2 = x(d[0])
                let coords = (x1 - x2)
                return coords
            })
            .attr('height', (y.bandwidth() - 50))

    }

}

function onClick(thisRect) {
    let rect = d3.select(thisRect)
    console.log(rect.attr('id'))
    if (rect.attr('class') == 'active') {
        rect
            .transition()
            .duration(350)
            .attr('class', 'inactive')

        d3.select('.' + rect.attr('id'))
            .selectAll('.bar')
            .attr('width', '0')


    } else {
        rect
            .transition()
            .duration(350)
            .attr('class', 'active')

    }
}

function maxVal(val) {
    var max = val.reduce(function (a, b) {
        return Math.max(a, b)
    })
    return max
}

function getDay(d) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let date = new Date(d)
    let day = days[date.getDay()]
    return day
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}