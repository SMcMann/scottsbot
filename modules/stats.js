module.exports = class Stats {
    constructor(stats) {
        this.statName =stats.statName;
        this.nameArray =stats.nameArray;
        this.general = stats.general;
        this.specific = stats.specific;
        this.freebie = stats.freebie;
        this.bju = stats.bju;
        this.jtm = stats.jtm;
        this.mm = stats.mm;
        this.osu = stats.osu;
        this.frv = stats.frv;
        this.hkr = stats.hkr;
        this.lel = stats.lel;
        this.mcv = stats.mcv;
        this.avc = stats.avc;
        this.cmc = stats.cmc;
        this.mxc = stats.mxc;
        this.tu = stats.tu;
        this.jgl = stats.jgl;
        this.rye = stats.rye;
        this.spi = stats.spi;

    }
    getGOS(tag){ //update this with all teams AND make it a switch statement you neanderthal
      //  if (tag === BJU.tag) return this.bju;
      switch (tag){
        case BJU.tag:
            return this.bju;
        case JTM.tag:
            return this.jtm;
        case MM.tag:
            return this.mm;
        case OSU.tag:
            return this.osu;
        case FRV.tag:
            return this.frv;  
        case HKR.tag:
            return this.hkr;  
        case LEL.tag:
            return this.lel;  
        case MCV.tag:
            return this.mcv;  
        case AVC.tag:
            return this.avc;  
        case CMC.tag:
            return this.cmc;
        case MXC.tag:
            return this.mxc;   
        case tu.tag:
            return this.tu;
        case JGL.tag:
            return this.jgl;
        case RYE.tag:
            return this.rye;
        case SPI.tag:
            return this.spi;   
      }
    }//getGOS  
    setGOS(tag){
        switch (tag){
            case BJU.tag:
                this.bju = true;
                break;
            case JTM.tag:
                this.jtm = true;
                break;
            case MM.tag:
                this.mm = true;
                break;
            case OSU.tag:
                this.osu = true;
                break;
            case FRV.tag:
                this.frv = true;  
                break;
            case HKR.tag:
                this.hkr = true;  
                break;
            case LEL.tag:
                this.lel = true;  
                break;
            case MCV.tag:
                this.mcv = true;  
                break;
            case AVC.tag:
                this.avc = true;  
                break;
            case CMC.tag:
                this.cmc = true;
                break;
            case MXC.tag:
                this.mxc = true;   
                break;
            case tu.tag:
                this.tu = true;
                break;
            case JGL.tag:
                this.jgl = true;
                break;
            case RYE.tag:
                this.rye = true;
                break;
            case SPI.tag:
                this.spi = true;   
                break;
          }
    }//setGOS    

} //athlete class




