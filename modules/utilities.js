const Api = require('../modules/api')

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
    },
    async getAllDataForUser(userID) {        
        // obtain userdata        
        const userQuery = `SELECT * FROM simbapam.pa_users WHERE username = "${userID}";`
        const userData = await  Api(userQuery)
    
        // then obtain pamdata
        const pamId = userData[0].pamid
        const obtainedDate = new Date(userData[0].startdate)
        const dateDomain = Utilities.getDateDomain(obtainedDate)
        const pamDataQuery = `SELECT * FROM simbapam.pam_data WHERE pam_id = "${pamId}" AND date BETWEEN '${dateDomain[0]}' AND '${dateDomain[1]}';`
        const pamData = await Api(pamDataQuery)
    
        // then obtain goal data (we might not need this)
        // const goalDataQuery = `SELECT * FROM simbapam.doelen WHERE username = "${userID}";`
        // const goalData = await Api(goalDataQuery)
    
        // then obtain trophy data
        const trophyDataQuery = `SELECT * FROM simbapam.trofee WHERE username = "${userID}";`
        const trophyData = await Api(trophyDataQuery)

        // then obtain day entries
        const dailyDataQuery = `SELECT * FROM simbapam.userdagentries WHERE username = "${userID}";`
        const dailyData = await Api(dailyDataQuery)

        const combinedData = {
            pamData: pamData,
            trophyData: trophyData[0],
            dailyData: dailyData
        }
        return combinedData
    }
}

module.exports = Utilities