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

const svg = d3.select('.svg')
    .attr('class', 'graph')
    .attr('width', (width + margin.left + margin.right)/2)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
        'translate(180,' + margin.top + ')')

const svg2 = d3.select('.svg2')
    .attr('class', 'graph')
    .attr('width', (width + margin.left + margin.right)/ 2)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
        'translate(10,' + margin.top + ')')

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

function filterData(data, id, val) {
    const deepCopy = JSON.parse(JSON.stringify(data))
    let week = deepCopy[val].group
    week.forEach((d) => {
        d[id] = 0
        // delete d[id]
    })
    return deepCopy
}
// =========================================
// =============Select option===============
// =========================================
init()

async function init() {
    let rawData = await getData()
    const transformedData = transformData(rawData)
    bindSelect(transformedData)
    makeRightChart(0, transformedData)
    makeLeftChart(1, transformedData)

    toggleOptions(0, transformedData)
    d3.select('.select-left').on('change', function (d) {
        let val = d3.select('.select-left option:checked').node().value
        val = val - 1
        updateLeft(val, transformedData)
        toggleOptions(val, transformedData)
    })
    d3.select('.select-right').on('change', function (d) {
        let val = d3.select('.select-right option:checked').node().value
        val = val - 1
        updateRight(val, transformedData)
        toggleOptions(val, transformedData)
    })

}

function bindSelect(data) {
    data.forEach((item) => {
        let option = 'Week ' + item.week
        let markup = `<option value="${item.week}">${option}</option>`
        let select = document.querySelectorAll('select')
        select.forEach((e) => {
            e.insertAdjacentHTML('beforeend', markup)
        })
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

function makeRightBars(subGroups, newData, maxValue, groups) {
    const x = d3.scaleLinear()
        .domain([0, 400])
        .nice()
        .range([width / 2, 0])
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))

    const y = d3.scaleBand()
        .range([0, height])
        .domain(groups)

    // svg.append('g')
    //     .call(d3.axisLeft(y).tickFormat((d) => {
    //         return getDay(d)
    //     }))

    const color = d3.scaleOrdinal()
        .domain(subGroups)
        .range(['#1AC6D0', '#15989F', '#382183'])



    let bars = svg.append('g').attr('class','bar-group')
        .selectAll('g')
        .data(newData)
        .enter().append('g')

    console.log(bars)

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
            return x(d[1])
        })
        .attr('y', function (d) {
            return y(d.data.date)
        })
        .attr('width', '0')
        .transition()
        .duration(500)
        .attr('width', function (d) {
            let x1 = x(d[1])
            let x2 = x(d[0])
            let coords = (x2 - x1)
            return coords
        })
        .attr('height', (y.bandwidth() - 50))

    isThereAChart = true
}

function makeLeftBars(subGroups, newData, maxValue, groups) {
    const x = d3.scaleLinear()
        .domain([0, 400])
        .nice()
        .range([0, width /2])
    svg2.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))

    const y = d3.scaleBand()
        .range([0, height])
        .domain(groups)

    // svg.append('g')
    //     .call(d3.axisLeft(y).tickFormat((d) => {
    //         return getDay(d)
    //     }))

    const color = d3.scaleOrdinal()
        .domain(subGroups)
        .range(['#1AC6D0', '#15989F', '#382183'])



    let bars = svg2.append('g')
        .selectAll('g')
        .data(newData)
        .enter().append('g')

    console.log(bars)

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
        // .attr('transform', 'translate(-420, 0)')
        .attr('width', '0')
        .transition()
        .duration(500)
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


}

function makeLeftChart(val, data) {
    let subGroups = getSubGroup(val, data)
    let newData = getStackedData(subGroups, val, data)
    let groups = getGroup(val, data)
    let maxValue = maxVal(data[val].group.map((item) => {
        return item.total
    }))
    makeLeftBars(subGroups, newData, maxValue, groups)
    if (isThereALegend) {
        return
    } else {
        makeLegend(subGroups, val)

        isThereALegend = true
    }

}
function makeRightChart(val, data) {
    let subGroups = getSubGroup(val, data)
    let newData = getStackedData(subGroups, val, data)
    let groups = getGroup(val, data)
    let maxValue = maxVal(data[val].group.map((item) => {
        return item.total
    }))
    makeRightBars(subGroups, newData, maxValue, groups)
}
// =========================================
// =============Update======================
// =========================================
function updateLeft(val, data) {
    let subGroups = getSubGroup(val, data)
    let newData = getStackedData(subGroups, val, data)
    let groups = getGroup(val, data)

    const x = d3.scaleLinear()
    .domain([0, 400])
    .nice()
    .range([width / 2, 0])

    const y = d3.scaleBand()
        .range([0, height])
        .domain(groups)

    let bars = svg
        .selectAll('g.chart')
        .data(newData)

    bars
        .selectAll('rect')
        .data(function (d) {
            return d
        })
        .transition()
        .duration(500)
        .attr('x', (d) => {
            return x(d[1])
        })
        .attr('y', function (d) {
            return y(d.data.date)
        })
        .attr('width', function (d) {
            let x1 = x(d[1])
            let x2 = x(d[0])
            let coords = (x2 - x1)
            return coords
        })
        .attr('height', (y.bandwidth() - 50))

    // toggleOptions(val, data)
}

function updateRight(val, data) {
    let subGroups = getSubGroup(val, data)
    let newData = getStackedData(subGroups, val, data)
    let groups = getGroup(val, data)

    const x = d3.scaleLinear()
        .domain([0, 400])
        .nice()
        .range([0, width /2])

    const y = d3.scaleBand()
        .range([0, height])
        .domain(groups)

    let bars = svg2
        .selectAll('g.chart')
        .data(newData)

    bars
        .selectAll('rect')
        .data(function (d) {
            return d
        })
        .transition()
        .duration(500)
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

    // toggleOptions(val, data)
}

function toggleOptions(val, data) {
    let newData = []
    d3.select('.legend').selectAll('rect')
        .on('click', function (d) {
            let rect = d3.select(this)
            let id = rect.attr('id')

            if (rect.attr('class') == 'active') {
                rect
                    .transition()
                    .duration(350)
                    .attr('class', 'inactive')
                newData = filterData(data, id, val)
                console.log(data)
                update(val, newData)
            } else {
                rect
                    .transition()
                    .duration(350)
                    .attr('class', 'active')
                console.log(data)
                update(val, data)
            }
        })
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