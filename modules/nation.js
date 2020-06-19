module.exports = class Nation {
    constructor(nation) {
        this.credits = parseInt(nation.credits);
        this.nukes = parseInt(nation.nukes);
        this.peacovite = parseInt(nation.peacovite);
        this.avenpite = parseInt(nation.avenpite);
        this.bankID = nation.bankID;
        this.logID = nation.logID;
        this.fName = nation.fName;
        this.roleID = nation.roleID;
        this.tag = nation.tag;
        /*
        */
    }
    updateNation(nation){
        this.credits = parseInt(nation.credits);
        this.nukes = parseInt(nation.nukes);
        this.peacovite = parseInt(nation.peacovite);
        this.avenpite = parseInt(nation.avenpite);
        this.bankID = nation.bankID;
        this.logID = nation.logID;
        this.fName = nation.fName;
        this.roleID = nation.roleID;
        this.tag = nation.tag;
    }
    outgoing(amount, resource) {
        if (resource === "nukes") {
            this.nukes = this.nukes - amount;
        } else if (resource === "credits") {
            this.credits = this.credits - amount;
        } else if (resource === "peacovite") {
            this.peacovite = this.peacovite - amount; 
        } else if (resource === "avenpite") {
            this.avenpite = this.avenpite - amount; 
        }
    } //outgoing
    incoming(amount, resource) {
        if (resource === "nukes") {
            this.nukes = this.nukes + amount;
        } else if (resource === "credits") {
            this.credits = this.credits + amount; 
        } else if (resource === "peacovite") {
            this.peacovite = this.peacovite + amount; 
        } else if (resource === "avenpite") {
            this.avenpite = this.avenpite + amount; 
        } 
    } //incoming
    checkAmount(amount, resource){
        if (resource === "nukes" && amount < this.nukes) {
            return true;
        } else if (resource === "credits" && amount <= this.credits) {
            return true; 
        } else if (resource === "peacovite" && amount <= this.peacovite) {
            return true; 
        } else if (resource === "avenpite" && amount <=  this.avenpite) {
            return true; 
        } 
        else
            return false;

    }


} //nation class




