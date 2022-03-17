const helpers = {};

helpers.xif = (q, valor, options) => {
    if(q == valor)
    return options.fn(this);
    console.log("q: " + q);
    console.log("valor: " + valor);
    console.log()
};

module.exports = helpers;