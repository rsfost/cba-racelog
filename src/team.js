export default class Team {
    constructor(date, race, position, time, picks) {
        this.date = date;
        this.race = race;
        this.position = position;
        this.time = time;
        this.picks = picks || Array(5).fill(null);
    }

    static fromDto(dto) {
        return new Team(dto.date, dto.race, dto.position, dto.time,
            [dto.captain, dto.pick1, dto.pick2, dto.pick3, dto.pick4]);
    }

    get captain() {
        return this.picks[0];
    }

    get pick1() {
        return this.picks[1];
    }

    get pick2() {
        return this.picks[2];
    }

    get pick3() {
        return this.picks[3];
    }

    get pick4() {
        return this.picks[4];
    }
}
