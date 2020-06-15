const margin = {
        top: 100,
        right: 200,
        bottom: 250,
        left: 200
    },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - 250 - margin.top - margin.bottom

let isThereAChart = false

const svg = d3.select('.svg')
    .attr('class', 'graph left')
    .attr('width', (width + margin.left + margin.right) / 2)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
        'translate(180,' + margin.top + ')')

const svg2 = d3.select('.svg2')
    .attr('class', 'graph right')
    .attr('width', (width + margin.left + margin.right) / 2)
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
    makeLeftChart(0, transformedData)

    toggleOptions(0, transformedData)
    addSlider()
    onDateHover()
    addLabel()
    d3.select('.select-left').on('change', function (d) {
        let val = d3.select('.select-left option:checked').node().value - 1
        let rightVal = d3.select('.select-right option:checked').node().value - 1

        d3.selectAll('.legend rect')
            .transition()
            .duration(350)
            .attr('class', 'active')

        updateRight(rightVal, transformedData)
        updateLeft(val, transformedData)
        toggleOptions(val, transformedData)
        onDateHover()
    })
    d3.select('.select-right').on('change', function (d) {
        let val = d3.select('.select-right option:checked').node().value - 1
        let leftVal = d3.select('.select-left option:checked').node().value - 1

        d3.selectAll('.legend rect')
            .transition()
            .duration(350)
            .attr('class', 'active')

        updateRight(val, transformedData)
        updateLeft(leftVal, transformedData)
        toggleOptions(val, transformedData)
        onDateHover()
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
    svg2.append('g')
        .attr('transform', 'translate(' + width / 2 + ', 0)')
        .attr('class', 'y-axis-right')
        .call(d3.axisRight(y).tickFormat((d) => {
            return getDay(d)
        }))

    const color = d3.scaleOrdinal()
        .domain(subGroups)
        .range(['#9dd3cf', '#3cc3b8', '#249e93'])



    let bars = svg.append('g').attr('class', 'bar-group')
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
        .attr('height', (y.bandwidth() - 15))

    isThereAChart = true
}

function makeLeftBars(subGroups, newData, maxValue, groups) {
    const x = d3.scaleLinear()
        .domain([0, 400])
        .nice()
        .range([0, width / 2])
    svg2.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))

    const y = d3.scaleBand()
        .range([0, height])
        .domain(groups)
    svg.append('g')
        .attr('class', 'y-axis-left')
        .call(d3.axisLeft(y).tickFormat((d) => {
            return getDay(d)
        }))

    const color = d3.scaleOrdinal()
        .domain(subGroups)
        .range(['#9dd3cf', '#3cc3b8', '#249e93'])



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
        .attr('width', '0')
        .transition()
        .duration(500)
        .attr('width', function (d) {
            let x1 = x(d[1])
            let x2 = x(d[0])
            let coords = (x1 - x2)
            return coords
        })
        .attr('height', (y.bandwidth() - 15))

    isThereAChart = true
}

function makeLegend(subGroups, val) {
    const colors = d3.scaleOrdinal()
        .domain(subGroups)
        .range(['#9dd3cf', '#3cc3b8', '#249e93'])

    const legend = d3.select('.legend').append('g')

    legend.append('g').selectAll('rect')
        .data(subGroups)
        .enter()
        .append('rect')
        .attr('id', (d) => {
            return d
        })
        .attr('class', 'active')
        .attr('y', 75)
        .attr('x', (d, i) => {
            return (width / 2) + i * 200
        })
        .attr('width', 20)
        .attr('height', 20)
        .attr('stroke', 'rgb(43, 116, 122)')
        .attr('stroke-width', '2')
        .attr('fill', (d, i) => {
            return colors(i)
        })

    legend.append('g').selectAll('.vinkje')
        .data(subGroups)
        .enter()
        .append('line')
        .attr('id', (d) => {
            return d
        })
        .attr('class', 'vinkje')
        .attr('y1', 85)
        .attr('y2', 90)
        .attr('x1', (d, i) => {
            return (width / 2) + i * 200 + 5
        })
        .attr('x2', (d, i) => {
            return (width / 2) + i * 200 + 10
        })
        .attr('stroke-width', 2)
        .attr('stroke', 'rgb(43, 116, 122)')

    legend.append('g').selectAll('.vinkje2')
        .data(subGroups)
        .enter()
        .append('line')
        .attr('id', (d) => {
            return d
        })
        .attr('class', 'vinkje2')
        .attr('y1', 90)
        .attr('y2', 78)
        .attr('x1', (d, i) => {
            return (width / 2) + i * 200 + 10
        })
        .attr('x2', (d, i) => {
            return (width / 2) + i * 200 + 17
        })
        .attr('stroke-width', 2)
        .attr('stroke', 'rgb(43, 116, 122)')


    legend.append('g').selectAll('text')
        .data(subGroups)
        .enter()
        .append('text')
        .text((d) => {
            let text = capitalizeFirstLetter(d) + ' activity'
            return text
        })
        .attr('y', 100)
        .attr('x', (d, i) => {
            return (width / 2) + (i * 200) - 50
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
    makeLegend(subGroups, val)
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

function addSlider() {
    d3.select('body').on('keypress', (e) => {
        if (d3.event.keyCode === 114) {
            d3.selectAll('.page-line').remove()
        }
    })
    d3.selectAll('.graph')
        .on('click', function (d) {
            let chart = d3.select('.graph').node().getBoundingClientRect()
            let bar = d3.select('.graph > g').node().getBoundingClientRect()
            let mousex = d3.event.pageX - document.querySelector('.graph').getBoundingClientRect().x

            d3.selectAll('.page-line').remove()

            d3.select('.right').append('line')
                .attr('x1', () => {
                    if (mousex > chart.width) {
                        return mousex - chart.width
                    }
                    return chart.width - mousex
                })
                .attr('x2', () => {
                    if (mousex > chart.width) {
                        return mousex - chart.width
                    }
                    return chart.width - mousex
                })
                .attr('y1', bar.bottom - 350)
                .attr('y2', bar.top - 350)
                .attr('stroke-width', '1').style('stroke', 'black')
                .attr('class', 'page-line')
                .attr('stroke-dasharray', '10 10')

            d3.select('.right').append('rect')
                .attr('x', '0')
                .attr('y', bar.top - 350)
                .attr('height', (bar.height))
                .attr('width', () => {
                    if (mousex > chart.width) {
                        return mousex - chart.width
                    }
                    return chart.width - mousex
                })
                .attr('fill', '#9DD3CF')
                .attr('opacity', '0.4')
                .attr('class', 'page-line')

            d3.selectAll('.left').append('line')
                .attr('x1', () => {
                    if (mousex > chart.width) {
                        return chart.width * 2 - mousex
                    }
                    return mousex
                })

            d3.select('.left').append('rect')
                .attr('x', () => {
                    if (mousex > chart.width) {
                        return chart.width * 2 - mousex
                    }
                    return mousex
                })
                .attr('y', bar.top - 350)
                .attr('height', (bar.height))
                .attr('width', () => {
                    if (mousex > chart.width) {
                        return mousex - chart.width
                    }
                    return chart.width - mousex
                })
                .attr('fill', '#9DD3CF')
                .attr('opacity', '0.4')
                .attr('class', 'page-line')

            d3.selectAll('.left').append('line')
                .attr('x1', () => {
                    if (mousex > chart.width) {
                        return chart.width * 2 - mousex
                    }
                    return mousex
                })

            d3.selectAll('.left').append('line')
                .attr('x1', () => {
                    if (mousex > chart.width) {
                        return chart.width * 2 - mousex
                    }
                    return mousex
                })
                .attr('x2', () => {
                    if (mousex > chart.width) {
                        return chart.width * 2 - mousex
                    }
                    return mousex
                })
                .attr('y1', bar.bottom - 350)
                .attr('y2', bar.top - 350)
                .attr('stroke-width', '1').style('stroke', 'black')
                .attr('class', 'page-line')
                .attr('stroke-dasharray', '10 10')
            console.log(chart.width, mousex)

        })
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
    svg.select('.y-axis-left')
        .call(d3.axisLeft(y).tickFormat((d) => {
            return getDay(d)
        }))

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
        .attr('height', (y.bandwidth() - 15))

    // toggleOptions(val, data)
}

function updateRight(val, data) {
    let subGroups = getSubGroup(val, data)
    let newData = getStackedData(subGroups, val, data)
    let groups = getGroup(val, data)

    const x = d3.scaleLinear()
        .domain([0, 400])
        .nice()
        .range([0, width / 2])

    const y = d3.scaleBand()
        .range([0, height])
        .domain(groups)
    svg2.select('.y-axis-right')
        .attr('transform', 'translate(' + width / 2 + ', 0)')
        .attr('class', 'y-axis-right')
        .call(d3.axisRight(y).tickFormat((d) => {
            return getDay(d)
        }))

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
        .attr('height', (y.bandwidth() - 15))

    // toggleOptions(val, data)
}

function toggleOptions(val, data) {
    let rightVal = d3.select('.select-right option:checked').node().value - 1
    let leftVal = d3.select('.select-left option:checked').node().value - 1
    let filtered = []
    d3.select('.legend').selectAll('rect')
        .on('click', function (d) {
            let rect = d3.select(this)
            let id = rect.attr('id')
            let line = d3.selectAll(`line#${id}`)
            console.log(line)


            if (rect.attr('class') == 'active') {
                filtered.push(id)
                line
                    .transition()
                    .duration(350)
                    .attr('class', 'inactive-line')
                rect
                    .transition()
                    .duration(350)
                    .attr('class', 'inactive')
                // console.log(data)
                let newDataRight = []
                let newDataLeft = []
                filtered.forEach((item) => {
                    if (newDataRight.length == 0) {
                        newDataRight = filterData(data, item, rightVal)
                        newDataLeft = filterData(data, item, leftVal)
                    }
                    newDataRight = filterData(newDataRight, item, rightVal)
                    newDataLeft = filterData(newDataLeft, item, leftVal)
                    switch (item) {
                        case 'light':
                            updateRight(rightVal, newDataRight)
                            updateLeft(leftVal, newDataLeft)
                            break;
                        case 'medium':
                            updateRight(rightVal, newDataRight)
                            updateLeft(leftVal, newDataLeft)
                            break;
                        case 'heavy':
                            updateRight(rightVal, newDataRight)
                            updateLeft(leftVal, newDataLeft)
                            break;
                    }
                })

            } else {
                filtered = filtered.filter(item => item !== id)
                line
                    .transition()
                    .duration(350)
                    .attr('class', '')
                rect
                    .transition()
                    .duration(350)
                    .attr('class', 'active')
                if (filtered.length == 0) {
                    updateRight(rightVal, data)
                    updateLeft(leftVal, data)
                }
                let newDataRight = []
                let newDataLeft = []
                filtered.forEach((item) => {
                    if (newDataRight.length == 0) {
                        newDataRight = filterData(data, item, rightVal)
                        newDataLeft = filterData(data, item, leftVal)
                    }
                    newDataRight = filterData(newDataRight, item, rightVal)
                    newDataLeft = filterData(newDataLeft, item, leftVal)
                    switch (item) {
                        case 'light':
                            updateRight(rightVal, newDataRight)
                            updateLeft(leftVal, newDataLeft)
                            break;
                        case 'medium':
                            updateRight(rightVal, newDataRight)
                            updateLeft(leftVal, newDataLeft)
                            break;
                        case 'heavy':
                            updateRight(rightVal, newDataRight)
                            updateLeft(leftVal, newDataLeft)
                            break;
                    }
                })
            }
        })
}

function onDateHover() {
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.selectAll('.y-axis-left text').on('mouseover', function (d) {
        hover(d)
    }).on("mouseout", function (d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);
    });
    d3.selectAll('.y-axis-right text').on('mouseover', function (d) {
        hover(d)
    }).on("mouseout", function (d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);
    });

    function hover(value) {
        console.log(getDay(value))
        let day = getDate(value)
        let chart = d3.select('.graph').node().getBoundingClientRect()
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html('<h2>' + day + '</h2>')
            .style("left", () => {
                let x = 0
                if (d3.event.pageX > chart.width) {
                    x = -130
                } else {
                    x = 30
                }
                return (d3.event.pageX + x) + "px"
            })
            .style("top", (d3.event.pageY - 30) + "px");

    }
    console.log()
}

function addLabel() {
    svg.append('text').style('text-anchor', 'middle')
        .style('font-size', '1rem')
        .text('Beweging (minuten)')
        .attr('transform', `translate(${width / 4}, ${height + 50})`)
        
        svg2.append('text').style('text-anchor', 'middle')
        .style('font-size', '1rem')
        .text('Beweging (minuten)')
        .attr('transform', `translate(${width / 4}, ${height + 50})`)
}

function maxVal(val) {
    var max = val.reduce(function (a, b) {
        return Math.max(a, b)
    })
    return max
}

function getDay(d) {
    const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag']
    let date = new Date(d)
    let day = days[date.getDay()]
    return day
}

function getDate(d) {
    let date = new Date(d)
    return date.toLocaleDateString("nl-NL")
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}