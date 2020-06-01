// set the dimensions and margins of the graph
const margin = {top: 20, right: 20, bottom: 150, left: 40},
    width = 960 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// set the ranges
const x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
const y = d3.scaleLinear()
          .range([height, 0]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
// get url + fetch to get data
const getUrl = window.location;
const baseUrl = getUrl .protocol + "//" + getUrl.host
fetch(baseUrl + '/pamdata/PA043F3')
    .then(res => res.json())
    .then(res => {
        const data = {
            firstWeek: res.data.dailyData.slice(0, 7),
            goalweek1: res.data.trophyData.goalweek2 / 7
        }
        console.log(data)

        function getColor(count) {
            if(count > data.goalweek1) {
                return 'green'
            } else if(count + (data.goalweek1 / 10) > data.goalweek1) {
                return 'yellow'
            } else {
                return 'red'
            }
        }

        // Scale the range of the data in the domains
        x.domain(data.firstWeek.map((d) => { return d.date; }));
        y.domain([0, d3.max(data.firstWeek, (d) => { return d.totaalpunten; })]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
        .data(data.firstWeek)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.totaalpunten); })
        .attr("height", function(d) { return height - y(d.totaalpunten); })
        .style("fill", (d) => getColor(d.totaalpunten))

        // add the x Axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

        // add the y Axis
        svg.append("g")
        .call(d3.axisLeft(y));

         // add the goal line
         svg.append("line")
         .attr("class", "goal")
         .attr('x1', 0)
         .attr('x2', width)
         .attr('y1', y(data.goalweek1))
         .attr('y2', y(data.goalweek1))
         .attr('stroke-width', 1)
         .attr('stroke-dasharray', '10,10')
         .attr('stroke', 'black')
        })

       




