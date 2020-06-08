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
}

generatePlanets()