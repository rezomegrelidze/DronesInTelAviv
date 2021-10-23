'use strict';



export default class Random {
    static next(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
