module.exports = class Team {
    constructor(team) {
        this.zillions = parseInt(team.zillions);
        this.kudos = parseInt(team.kudos);
        this.bankID = team.bankID;
        this.logID = team.logID;
        this.fName = team.fName;
        this.roleID = team.roleID;
        this.tag = team.tag;
        this.cashCoordinates = team.cashCoordinates;
        /*
        */
    }
    updateteam(team){
        this.zillions = parseInt(team.zillions);
        this.kudos = parseInt(team.kudos);
        this.bankID = team.bankID;
        this.logID = team.logID;
        this.fName = team.fName;
        this.roleID = team.roleID;
        this.tag = team.tag;
    }
    outgoing(amount, resource) {
        if (resource === "zillions") {
            this.zillions = this.zillions - amount;
        } else if (resource === "kudos") {
            this.kudos = this.kudos - amount;
        }
    } //outgoing
    incoming(amount, resource) {
        if (resource === "zillions") {
            this.zillions = this.zillions + amount;
        } else if (resource === "kudos") {
            this.kudos = this.kudos + amount;
        } 
    } //incoming
    checkAmount(amount, resource){
        if (resource === "zillions" && amount < this.zillions) {
            return true;
        } else if (resource === "kudos" && amount <= this.kudos) {
            return true; 
        } 
        else
            return false;
    }

} //team class




