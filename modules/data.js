const Api = require('../modules/api')
const Utilities = require('../modules/utilities')

const Data = {
    async getAll() {        
        const allData = await Api('SELECT * FROM pam_data')
        return allData
    },
    async getUserData(userID) {
        const userQuery = `SELECT * FROM simbapam.pa_users WHERE username = "${userID}";`
        const userData = await  Api(userQuery)
        return userData
    },
    async getPamDataForUser(userID) {
        const userData =  await Data.getUserData(userID)
        const pamId = userData[0].pamid
        const obtainedDate = new Date(userData[0].startdate)
        const dateDomain = Utilities.getDateDomain(obtainedDate)
        const pamDataQuery = `SELECT * FROM simbapam.pam_data WHERE pam_id = "${pamId}" AND date BETWEEN '${dateDomain[0]}' AND '${dateDomain[1]}';`
        const pamData = await Api(pamDataQuery)
        return pamData
    },
    async getTrophyDataForUser(userID) {
        const trophyDataQuery = `SELECT * FROM simbapam.trofee WHERE username = "${userID}";`
        const trophyData = await Api(trophyDataQuery)
        return trophyData
    },
    async getDailyDataForUser(userID) {
        const dailyDataQuery = `SELECT * FROM simbapam.userdagentries WHERE username = "${userID}";`
        const dailyData = await Api(dailyDataQuery)
        return dailyData
    },
    async getAllDataForUser(userID) {        
        const pamData = await Data.getPamDataForUser(userID)
        const trophyData = await Data.getTrophyDataForUser(userID)
        const dailyData = await Data.getDailyDataForUser(userID)
        const combinedData = {
            pamData: pamData,
            trophyData: trophyData[0],
            dailyData: dailyData
        }
        return combinedData
    },
}

module.exports = Data