module.exports = class Coach {
    constructor(coach) {
        this.coachID = coach.coachID;
        this.FRANCHISE = coach.FRANCHISE;
        this.Name = coach.Name;
        this.Last_Name = coach.Last_Name;
        this.Known_for = coach.Known_for;
        this.Bonus_Strategy = coach.Bonus_Strategy;
        this.Reputation = coach.Reputation;
        this.Salary = parseInt(coach.Salary);
        this.Performance_Range = coach.Performance_Range;
        this.Min_Performance = parseInt(coach.Min_Performance);
        this.Max_Performance = parseInt(coach.Max_Performance);
        this.Actual_Performance = parseInt(coach.Actual_Performance);
        this.changedFranchise = coach.changedFranchise;
        this.bids = coach.bids;
    }

} // class