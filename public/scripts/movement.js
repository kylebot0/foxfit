
async function getData() {
    const baseUrl = window.location.protocol + '//' + window.location.host
    const endpoint = '/data/movement/'
    const userID = 'PA043F3'
    const response = await fetch(`${baseUrl}${endpoint}${userID}`)
    const json = await response.json()    
    return json.data
}


getData().then(data => {
    const startDate = new Date(data.user[0].startdate)    
    const weekDataDaily = filterForWeek(data.pamData, startDate, 6)
    console.log(weekDataDaily)
    
})

function filterForWeek(data, startDate, weekNumber) {
    console.log(data, startDate)
    const filteredData = data.filter(isWithinSelectedWeek)

    function isWithinSelectedWeek(datapoint) {
        const date = new Date(datapoint.date)
        const daysAway = getDayDifference(startDate, date)
        if (daysAway <= 7 * weekNumber && daysAway > 7 * (weekNumber - 1)) {
            return true
            
        }
        return false
    }

    function getDayDifference(date1, date2) {
        const diffTime = Math.abs(date1 - date2)
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return date2 < date1 ? diffDays * -1 : diffDays
    }
    
    return filteredData
}


const graphContainer = document.getElementById('graph-container')
const containerWidth = graphContainer.offsetWidth
const containerHeight = graphContainer.offsetHeight

const svg = d3.select('#graph-container').append('svg')
    .attr('id', 'movement-graph')
    .append('g')
    
const x = d3.scaleBand()
    .range([0, containerWidth])
    .padding(0.1)
const y = d3.scaleLinear()
    .range([containerHeight, 0])



// fetch(baseUrl + '/pamdata/PA043F3')
//     .then(res => res.json())
//     .then(json => {
//         console.log(json)        
//         const data = {
//             firstWeek: json.data.dailyData.slice(0, 7),
//             goalweek1: json.data.trophyData.goalweek2 / 7
//         }
//         console.log(data)

//         function getColor(count) {
//             if(count > data.goalweek1) {
//                 return 'green'
//             } else if(count + (data.goalweek1 / 10) > data.goalweek1) {
//                 return 'yellow'
//             } else {
//                 return 'red'
//             }
//         }

//         // Scale the range of the data in the domains
//         x.domain(data.firstWeek.map((d) => { return d.date }))
//         y.domain([0, d3.max(data.firstWeek, (d) => { return d.totaalpunten })])

//         // append the rectangles for the bar chart
//         svg.selectAll('.bar')
//             .data(data.firstWeek)
//             .enter().append('rect')
//             .attr('class', 'bar')
//             .attr('x', function(d) { return x(d.date) })
//             .attr('width', x.bandwidth())
//             .attr('y', function(d) { return y(d.totaalpunten) })
//             .attr('height', function(d) { return containerHeight - y(d.totaalpunten) })
//             .style('fill', (d) => getColor(d.totaalpunten))

//         // add the x Axis
//         svg.append('g')
//             .attr('transform', 'translate(0,' + containerHeight + ')')
//             .call(d3.axisBottom(x))
//             .selectAll('text')
//             .style('text-anchor', 'end')
//             .attr('dx', '-.8em')
//             .attr('dy', '.15em')
//             .attr('transform', 'rotate(-65)')

//         // add the y Axis
//         svg.append('g')
//             .call(d3.axisLeft(y))

//         // add the goal line
//         svg.append('line')
//             .attr('class', 'goal')
//             .attr('x1', 0)
//             .attr('x2', containerWidth)
//             .attr('y1', y(data.goalweek1))
//             .attr('y2', y(data.goalweek1))
//             .attr('stroke-width', 1)
//             .attr('stroke-dasharray', '10,10')
//             .attr('stroke', 'black')
//     })



