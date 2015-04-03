var mine = 0;

function MyObject (i_var, i_buttonID){

    this.myVar		= i_var;
    this._init(i_buttonID);
    this.id = Math.random();
};

MyObject.prototype = {
    constructor: MyObject,

    _init: function(i_buttonID){
        var z = Math.random();
        var self = this;

        $(i_buttonID).on('click',function(){
            alert(self.id + ' ' + z)
            console.log(self.myVar);
        });


    },

    showVar: function(){
        var self = this;
        console.log(self.myVar);
    }
}


$(document).ready(function () {
    var o1 = new MyObject(1,'#myButton1');
    var o2 = new MyObject(2,'#myButton2');

});
