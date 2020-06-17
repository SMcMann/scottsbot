module.exports = class Team {
    constructor(team) {
        this.zillions = parseInt(team.zillions);
        this.kudosBanked = parseInt(team.kudosBanked);
        this.acquiredKudos = parseInt(team.acquiredKudos);
        this.bankID = team.bankID;
        this.logID = team.logID;
        this.fName = team.fName;
        this.roleID = team.roleID;
        this.tag = team.tag;
        this.cashCoordinates = team.cashCoordinates;
        //this.startupCoordinates = team.startupCoordinates;
        /*
        */
    }
    outgoing(amount, resource) {
        if (resource === "zillions") {
            this.zillions = this.zillions - amount;
        } else if (resource === "kudos") {
            this.kudosBanked = this.kudosBanked - amount;
        }
    } //outgoing
    incoming(amount, resource) {
        if (resource === "zillions") {
            this.zillions = this.zillions + amount;
        } else if (resource === "kudos") {
            this.acquiredKudos = this.acquiredKudos + amount;
        } 
    } //incoming
    checkAmount(amount, resource){
        if (resource === "zillions" && amount <= this.zillions) {
            return true;
        } else if (resource === "kudos" && amount <= this.kudosBanked) {
            return true; 
        } 
        else
            return false;
    }

} //team class




