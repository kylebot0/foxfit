var currentUrl = window.location.href
fetch(currentUrl + 'data')
.then(res => res.json())
.then(res => {console.log(res)})