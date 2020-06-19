module.exports = class Stats {
    constructor(stats) {
        this.statName =stats.statName;
        this.general = stats.general;
        this.specific = stats.specific;
        this.freebie = stats.freebie;
        this.bju = stats.bju;
        this.mm = stats.mm;
        this.osu = stats.osu;
        this.frv = stats.frv;

    }
    getGOS(tag){
        if (tag === BJU.tag) return this.bju;
        else if (tag === MM.tag) return this.mm;
        else if (tag === OSU.tag) return this.osu;
        else 
             return this.frv;

    }//getGOS  
    setGOS(tag){
        if (tag === BJU.tag) this.bju = true;
        else if (tag === MM.tag) this.mm = true;
        else if (tag === OSU.tag) this.osu = true;
        else 
             this.frv = true;

    }//getGOS    

} //athlete class




