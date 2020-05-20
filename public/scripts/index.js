var currentUrl = window.location.href
fetch(currentUrl + 'pamdata/PA043F3')
    .then(res => res.json())
    .then(res => {console.log(res)})