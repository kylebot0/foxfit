const Utilities = {
    getDateDomain(obtainedDate) {
        let startDate = new Date(obtainedDate)
        let endDate = new Date(obtainedDate)

        startDate.setDate(startDate.getDate() - 7)
        endDate.setDate(endDate.getDate() + 42)
  
        function formatDate(date) {
            const day = date.getDate()
            const month = date.getMonth() + 1
            const year = date.getFullYear()
            return `${year}-${month}-${day}`
        }
        return [formatDate(startDate), formatDate(endDate)]
    }
}

module.exports = Utilities