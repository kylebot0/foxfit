const usernameElement = document.getElementById('username')
const startDateElement = document.getElementById('startdate')
const pamIdElement = document.getElementById('pamid')
const dayGoalsListElement = document.getElementById('daygoals')

fetchData().then(data => {
    console.log(data)

    const startdate = transformDate(new Date(data.startdate))

    usernameElement.innerText = data.username
    startDateElement.innerText = startdate
    pamIdElement.innerText = data.pamid
    const dayGoals = [ data.dagdoel1, data.dagdoel2, data.dagdoel3, data.dagdoel4, data.dagdoel5, data.dagdoel6 ]

    for (let i = 1; i <= dayGoals.length; i++) {
        const newLi = document.createElement('li')
        newLi.innerText = `Week ${i}: ${dayGoals[i-1]} punten`
        dayGoalsListElement.appendChild(newLi)
    }
})

async function fetchData() {
    const getUrl = window.location
    const baseUrl = getUrl .protocol + '//' + getUrl.host
    return await fetch(baseUrl + '/data/user/PA043F3')
        .then(res => res.json())
        .then(res => res.data[0])
}

function transformDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate() + 1).padStart(2, '0')
    return `${day}-${month}-${year}`  
}