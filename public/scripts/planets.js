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
        console.log(trophy[singleTrophy])
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
        wrapper.insertAdjacentHTML('beforeend', `<div>${collectedTrophySource === false ? '' : `<img class="trophy" src="${collectedTrophy + collectedTrophySource}" />`}<img class="${className}" src="${source + sourceVar}" /></div>`)
    })
    placeRocket(latestTrophy)
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
    console.log(latestTrophy)
    const rocketWrapper = document.querySelector('.rocket')
    const rocket = document.querySelector('.rocket img')
    positionsTop[0] = formatTop(getComputedStyle(rocket).top)
    console.log(positionsTop[0])
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

generatePlanets()