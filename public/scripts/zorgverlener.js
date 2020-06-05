const margin = {
        top: 200,
        right: 200,
        bottom: 150,
        left: 200
    },
    width = 1500 - margin.left - margin.right,
    height = 1250 - margin.top - margin.bottom

let isThereAChart = false

const svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')')


// =======================GET DATA================================
const getUrl = window.location
const baseUrl = getUrl.protocol + '//' + getUrl.host
fetch(baseUrl + '/pamdata/PA043F3')
    .then(res => res.json())
    .then(res => {
        console.log(res.data)
        const data = []
        let week = []
        let count = 1
        res.data.pamData.forEach((item, i) => {
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
                return
            } else {
                week.push(activity)
            }
        })
        console.log(data[0].group)

        // =========================================
        // =============Select option===============
        // =========================================

        data.forEach((item) => {
            let option = 'Week ' + item.week
            let markup = `<option value="${item.week}">${option}</option>`
            let select = document.querySelector('select')
            select.insertAdjacentHTML('beforeend', markup)
        })

        d3.select('select').on('change', function (d) {
            let val = d3.select('option:checked').node().value
            if (isThereAChart) {
                return update(val)

            } else {
                makeChart(val)

            }
        })

        // =========================================
        // =============Bar chart===================
        // =========================================

        function getSubGroup(val) {
            const subgroups = Object.keys({
                light: data[val].light_activity,
                medium: data[val].medium_activity,
                heavy: data[val].heavy_activity
            })
            return subgroups
        }

        function getStackedData(subgroups, val) {
            const stackedData = d3.stack()
                .keys(subgroups)
                (data[val].group)
            return stackedData
        }

        function getGroup(val) {
            const groups = d3.map(data[val].group, (d) => {
                return (d.date)
            }).keys()
            return groups
        }

        function makeBars(subGroups, newData, maxValue, groups) {

            const x = d3.scaleLinear()
                .domain([0, maxValue])
                .nice()
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))

            const y = d3.scaleBand()
                .range([0, height])
                .domain(groups)
                .padding(.1);
            svg.append("g")
                .call(d3.axisLeft(y).tickFormat((d) => {
                    return getDay(d)
                }))

            const color = d3.scaleOrdinal()
                .domain(subGroups)
                .range(['#1AC6D0', '#15989F', '#382183'])



            let bars = svg.append("g")
                .selectAll("g")
                .data(newData)
                .enter().append("g")

            bars
                .attr("fill", function (d) {
                    return color(d.key);
                })
                .selectAll("rect")
                .data(function (d) {
                    return d;
                })
                .enter().append("rect")
                .attr("x", (d) => {
                    return x(d[0])
                })
                .attr("y", function (d) {
                    return y(d.data.date);
                })
                .attr('width', '0')
                .transition()
                .duration(1000)
                .attr("width", function (d) {
                    let x1 = x(d[1])
                    let x2 = x(d[0])
                    let coords = (x1 - x2)
                    return coords;
                })
                .attr("height", (y.bandwidth() - 50))

            isThereAChart = true
        }

        function makeLegend(subGroups) {
            const colors = d3.scaleOrdinal()
                .domain(subGroups)
                .range(['#1AC6D0', '#15989F', '#382183'])

            const legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', 'translate('+(width / 2.55)+', -150)');

            legend.selectAll('rect')
                .data(subGroups)
                .enter()
                .append('rect')
                .attr('y', 0)
                .attr('x', function (d, i) {
                    return i * 200;
                })
                .attr('width', 12)
                .attr('height', 12)
                .attr('fill', function (d, i) {
                    return colors(i);
                });

            legend.selectAll('text')
                .data(subGroups)
                .enter()
                .append('text')
                .text(function (d) {
                    let text = capitalizeFirstLetter(d) + ' activity'
                    return text;
                })
                .attr('y', 25)
                .attr('x', function (d, i) {
                    return (i * 200) - 50;
                })
                .attr('text-anchor', 'start')
                .attr('alignment-baseline', 'hanging');
        }


        function makeChart(val) {
            let subGroups = getSubGroup(val)
            let newData = getStackedData(subGroups, val)
            let groups = getGroup(val)
            let maxValue = maxVal(data[val].group.map((item) => {
                return item.total
            }))
            makeBars(subGroups, newData, maxValue, groups)
            makeLegend(subGroups)
        }
        // =========================================
        // =============Update======================
        // =========================================
        function update(val) {
            d3.selectAll('rect').transition().duration(1000).attr('width', '0').on('end', remove)

            function remove() {
                d3.selectAll('rect').remove()
                d3.selectAll('text').remove()
                d3.selectAll('.tick').remove()
                makeChart(val)
            }

        }

    })

function maxVal(val) {
    var max = val.reduce(function (a, b) {
        return Math.max(a, b);
    });
    return max
}

function getDay(d) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let date = new Date(d)
    let day = days[date.getDay()]
    return day
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }