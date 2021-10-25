'use strict';



export default function randomNext(min,max){
    
    return Math.floor(Math.random() * (max - min)) + min;
}
