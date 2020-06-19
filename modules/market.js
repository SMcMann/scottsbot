module.exports = class Market {
    constructor(M) {
        this.nukeAmount = parseInt(M.nukeAmount);
        this.nukePrice = parseInt(M.nukePrice);
        this.avenpiteAmount = parseInt(M.avenpiteAmount);
        this.avenpitePrice = parseInt(M.avenpitePrice);
        this.peacoviteAmount = parseInt(M.peacoviteAmount);
        this.peacovitePrice = parseInt(M.peacovitePrice);

        this.logID = M.logID;
        /*
       nukeAmount = 5;
       nukePrice = 20;
       avenpiteAmount = 20;
       avenpitePrice = 5;
       peacoviteAmount = 20;
       peacovitePrice = 5;
       logID = "704075535718023300";
        */

    }
    updateMarket(M){
        this.nukeAmount = parseInt(M.nukeAmount);
        this.nukePrice = parseInt(M.nukePrice);
        this.avenpiteAmount = parseInt(M.avenpiteAmount);
        this.avenpitePrice = parseInt(M.avenpitePrice);
        this.peacoviteAmount = parseInt(M.peacoviteAmount);
        this.peacovitePrice = parseInt(M.peacovitePrice);

        this.logID = M.logID;
    }
    getAmount(resource) {
        if (resource === "nukes" || resource === "nuke") {
            return this.nukeAmount;
        }
        else if (resource === "peacovite"){
            return this.peacoviteAmount
        }
        else if (resource === "avenpite"){
            return this.avenpiteAmount   
        }
        else 
            throw "Invalid resource "
    }
    getPrice(resource) {
        if (resource === "nukes" || resource === "nuke") {
            return this.nukePrice;
        }
        else if (resource === "peacovite"){
            return this.peacovitePrice
        }
        else if (resource === "avenpite"){
            return this.avenpitePrice   
        }
        else 
            throw "Invalid resource "
    }
    buy(amount, resource) {
        if (resource === "nukes") {
            this.nukeAmount = this.nukeAmount - amount;
            //this.nukePrice = this.nukePrice +200;
        } 
        else if (resource === "peacovite" || resource === "pea" ||resource === "p") {
            this.peacoviteAmount = this.peacoviteAmount - amount;
            //this.peacovitePrice = this.peacovitePrice +200;
        } 
        else if (resource === "avenpite"){
            this.avenpiteAmount = this.avenpiteAmount - amount;
            //this.avenpitePrice = this.avenpitePrice +300;  
        }else {
            throw "resource not found";
        }
    } //buy
    sell(amount, resource) {
        if (resource === "nukes") {
            this.nukeAmount = this.nukeAmount - amount;
            //this.nukePrice = this.nukePrice +200;
        } 
        else if (resource === "peacovite") {
            this.peacoviteAmount = this.peacoviteAmount - amount;
            //this.peacovitePrice = this.peacovitePrice +200;
        } 
        else if (resource === "avenpite"){
            this.avenpiteAmount = this.avenpiteAmount - amount;
            //this.avenpitePrice = this.avenpitePrice +300;  
        }else {
            throw "resource not found";
        }
    } //sell
    updatePrice(amount, resource, type){ //typoe is either true for increasing price or false for decreasing
        if (resource === "nukes") {
            var change = amount * 200
            if (type){
                this.nukePrice = this.nukePrice + change;
            }
            else {
                this.nukePrice = this.nukePrice - change;
            }
            return;
        } 
        else if (resource === "peacovite") {
            var change = amount * 200
            if (type){
                this.peacovitePrice = this.peacovitePrice + change;
            }
            else {
                this.peacovitePrice = this.peacovitePrice - change;
            }
            return;

        } 
        else if (resource === "avenpite"){
            var change = amount * 300
            if (type){
                this.avenpitePrice = this.avenpitePrice + change;
            }
            else {
                this.avenpitePrice = this.avenpitePrice - change;
            }
            return;

        }else {
            throw "resource not found";
        }
    }


} //nation class




