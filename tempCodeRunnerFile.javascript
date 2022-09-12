function test () {
    let a = "sfsd"
}
let newFunction = new Function("return " + test.toString()).call(this)

console.log(newFunction.toString());
