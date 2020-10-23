class Studuent {
    constructor(name) {
        this.name = name;
    }    
}

Studuent.prototype.shout = function () {
    console.log(this.name)
}.bind(this) // 在這裡已經 Bind Studuent.prototype.

const xioamin = new Studuent('小明');
const xioaminShout = xioamin.shout; 
xioaminShout() // 實測出來會是 undefined
