async function fetchData() {
    const getUrl = window.location
    const baseUrl = getUrl .protocol + '//' + getUrl.host
    return await fetch(baseUrl + '/data/all/PA043F3')
        .then(res => res.json())
        .then(res => {
            const data = {
                1: res.data.trophyData.trofee1,
                2: res.data.trophyData.trofee2,
                3: res.data.trophyData.trofee3,
                4: res.data.trophyData.trofee4,
                5: res.data.trophyData.trofee5,
                6: res.data.trophyData.trofee6
            }
            console.log(res)
            return data
        })
}

async function generatePlanets() {
    const trophyData = await fetchData()
    const planets = ['green', 'yellow', 'brown', 'yellow', 'brown', 'earth']
    createPlanets(trophyData, planets)
}

let latestTrophy

function createPlanets(trophy, planets) {
    const source = '/images/planets'
    const collectedTrophy = '/images/trophy'
    const wrapper = document.querySelector('#grid')
    wrapper.insertAdjacentHTML('beforeend', `<div><img class="full" src="${source}/earth/full.png" /></div>`)
    Object.keys(trophy).forEach((singleTrophy, i) => {
        let sourceVar = ''
        let className = ''
        let collectedTrophySource
        if(trophy[singleTrophy] === 0) {
            sourceVar = '/' + planets[i] + '/outline.png'
            className = 'outline'
            collectedTrophySource = false
        } else {
            latestTrophy = singleTrophy
            sourceVar = '/' + planets[i] + '/full.png'
            className = 'full'
        }
        if(trophy[singleTrophy] === 3) {
            collectedTrophySource = '/gold.svg'
        } else if(trophy[singleTrophy] === 2) {
            collectedTrophySource = '/silver.svg'
        } else if(trophy[singleTrophy] === 1) {
            collectedTrophySource = '/bronze.svg'
        }
        wrapper.insertAdjacentHTML('beforeend', `<div>${collectedTrophySource === false ? '' : `<img class="trophy" src="${collectedTrophy + collectedTrophySource}" />`}<img class="${className}" data-weekNumber="${i + 2}" data-obtained="${collectedTrophySource}" data-trophy="${singleTrophy}" src="${source + sourceVar}" /></div>`)
    })
    placeRocket(latestTrophy)
    addPlanetEvents()
}

function placeRocket(latestTrophy) {
    const rocketWrapper = document.querySelector('.rocket')
    rocketWrapper.classList.add(`planet-${latestTrophy}`)
    setTimeout(() => {
        rocketWrapper.classList.add('transition')
        rocketWrapper.classList.add(`planet-${parseInt(latestTrophy) + 1}`)
        let spawnStars = setInterval(generateStars, 100)
        setTimeout(() => {
            clearInterval(spawnStars)
        }, 4000);
    }, 10);
    
}

let positionsTop = [0,0]

function generateStars() {
    const rocketWrapper = document.querySelector('.rocket')
    const rocket = document.querySelector('.rocket img')
    positionsTop[0] = formatTop(getComputedStyle(rocket).top)
    if(positionsTop[1] !== 0) {
        let newStar = document.createElement('img')
        const randomTop = (positionsTop[1] + 30) + Math.floor(Math.random() * 70)
        const randomLeft = formatLeft(getComputedStyle(rocket).left) - Math.floor(Math.random() * 70)
        newStar.classList.add('star')
        newStar.src = '/images/planets/star.svg'
        newStar.style.width = 5 + Math.floor(Math.random() * 20) + 'px'
        newStar.style.transform = 'rotate(' + Math.floor(Math.random() * 360) + 'deg' + ')'
        newStar.style.top = positionsTop[1] + 40 + 'px'
        newStar.style.left = formatLeft(getComputedStyle(rocket).left) + 'px'
        rocketWrapper.appendChild(newStar)
        setTimeout(() => {
            newStar.style.top = randomTop + 'px'
        newStar.style.left = randomLeft + 'px'
        }, 10);
        
        setTimeout(() => {
            newStar.classList.add('fade')
            setTimeout(() => {
                newStar.parentNode.removeChild(newStar)
            }, 200);
        }, 340);
    }
    positionsTop[1] = positionsTop[0]
}

function formatTop(top) {
    let newTop = top.toString()
    newTop = parseInt(newTop.substring(0, newTop.length - 2))
    return newTop
}

function formatLeft(left) {
    let newLeft = left.toString()
    newLeft = parseInt(newLeft.substring(0, newLeft.length - 2))
    return newLeft
}

function addPlanetEvents() {
    const barWrapper = document.querySelector('.bar-wrapper')
    const planets = document.querySelectorAll('#grid > div:not(:first-of-type) img:last-of-type')
    
    planets.forEach(planet => {
        planet.addEventListener('click', function (e) {
            addOverlayData(this)

            barWrapper.style.left = e.clientX + 'px'
            barWrapper.style.top = e.clientY + 'px'
            barWrapper.classList.add('show')
            setTimeout(() => {
                barWrapper.style.left = '0px'
                barWrapper.style.top = '0px'
            }, 100);
            
        })

        planet.addEventListener('mouseover', function() {
            console.log(this)
            this.parentNode.insertAdjacentHTML("beforeend", `<span class="weeknumber">Week ${this.dataset.weeknumber}</span>`)
            this.parentNode.classList.add('hover')
        })

        planet.addEventListener('mouseout', function() {
            const overlay = document.querySelector('span')
            overlay.parentNode.removeChild(overlay)
             this.parentNode.classList.remove('hover')
        })
    })

    document.querySelector('.cross').addEventListener('click', function () {
        barWrapper.classList.remove('show')
        const svg = document.querySelector('svg')
        svg.parentNode.removeChild(svg)
        const trophy = document.querySelectorAll('#graph-container img')
        if(trophy.length > 0) {
            trophy.forEach(singleTrophy => {
                singleTrophy.parentNode.removeChild(singleTrophy)
            })
        }
    })
}

function addOverlayData(planet) {
    const obtainedTrophy = planet.dataset.obtained
    obtainedTrophy === false ? null : insertTrophy(obtainedTrophy)
    // set the dimensions and margins of the graph
    const margin = {top: 50, right: 50, bottom: 100, left: 80},
    width = 960 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom

    // set the ranges
    const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1)
    const y = d3.scaleLinear()
    .range([height, 0])

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = d3.select('#graph-container').append('svg')
    .attr('class', 'graph')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 
        'translate(' + margin.left + ',' + margin.top + ')')

    //append title
    svg.append('text')
    .attr('x', '-40')
    .attr('y', '-25')
    .attr('dy', '.35em')
    .text('Week ' + planet.dataset.trophy)
    .style('color', '#fff')

    svg.append('text')
        .attr('transform',`translate(-300, ${height/2}) rotate(270)`)
        .attr('y', height/2)
        .style('text-anchor', 'middle')
        .style('font-size', '1rem')
        .text('Totaal aantal punten')

    // get url + fetch to get data
    let allData
    async function fetchData() {
    const getUrl = window.location
    const baseUrl = getUrl .protocol + '//' + getUrl.host
    return await fetch(baseUrl + '/data/all/PA043F3')
        .then(res => res.json())
        .then(res => {
            allData = res
            const selectedPlanet = planet.dataset.trophy
            console.log(selectedPlanet)
            const data = {
                curweek: allData.data.dailyData.slice((selectedPlanet -1) * 7,selectedPlanet * 7),
                curweekgoal: res.data.trophyData.goalweek1 / 7
            }
            return data
        })
    }

    function getColor(count, data) {
    if(count >= data.curweekgoal) {
        return '#249E93'
    } else {
        return 'rgba(36, 158, 147,.5)'
    }
    }

    function createChart(data) {
    // Scale the range of the data in the domains
    x.domain(data.curweek.map((d) => { return d.date }))
    y.domain([0, d3.max(data.curweek, (d) => { return d.totaalpunten })])

    // append the rectangles for the bar chart
    svg.selectAll('.bar')
        .data(data.curweek)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return x(d.date) })
        .attr('width', x.bandwidth())
        .attr('y', function(d) { return y(d.totaalpunten) })
        .attr('height', function(d) { return height - y(d.totaalpunten) })
        .style('fill', (d) => getColor(d.totaalpunten, data))

    // add the x Axis
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).tickFormat((d) => {
            return getDay(d)
        }))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-65)')

    // add the y Axis
    svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y))

    // add the goal line
    svg.append('line')
        .attr('class', 'goal')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(data.curweekgoal))
        .attr('y2', y(data.curweekgoal))
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '10,10')
        .attr('stroke', 'black')
    
    }

    

    async function plotData() {
        const data = await fetchData()
        createChart(data)
        console.log(data)
    }
    
    plotData()

    function getDay(d) {
        const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag']
        let date = new Date(d)
        let day = days[date.getDay()]
        return day
    }

    function insertTrophy(obtainedTrophy) {
        const source = '/images/trophy' + obtainedTrophy
        document.querySelector('#graph-container').insertAdjacentHTML('beforeend', `<img class="trophy" src="${source}" />`)
        setTimeout(() => {
            generateTrophyStars(10, 0)
        }, 500);
    }

    function generateTrophyStars(noS, index) {
        let newStar = document.createElement('img')
        const randomTop = Math.floor(Math.random() * 7)
        const randomLeft = Math.floor(Math.random() * 10)
        const plusOrMinus = Math.random() >= 0.5 ? '' : '-'
        newStar.classList.add('star')
        newStar.src = '/images/planets/star.svg'
        newStar.style.width = 5 + Math.floor(Math.random() * 20) + 'px'
        newStar.style.transform = 'rotate(' + Math.floor(Math.random() * 360) + 'deg' + ')'
        newStar.style.top = 21 + '%'
        newStar.style.left = 85 + '%'
        document.querySelector('#graph-container').appendChild(newStar)
        setTimeout(() => {
            if(plusOrMinus === '-') {
                newStar.style.top = 21 - randomTop + '%'
                newStar.style.left = 85 - randomLeft + '%'
            } else {
                newStar.style.top = 21 + randomTop + '%'
                newStar.style.left = 85 + randomLeft + '%'
            }
            
        }, 10);
        
        setTimeout(() => {
            newStar.classList.add('fade')
            setTimeout(() => {
                newStar.parentNode.removeChild(newStar)
            }, 200);
        }, 340);
        setTimeout(() => {
            console.log(noS, index)
            if(noS > index) {console.log(index);index++; generateTrophyStars(noS, index)}
        }, 50)
    }
        
}

generatePlanets()