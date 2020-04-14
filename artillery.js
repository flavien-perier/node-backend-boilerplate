"use strict";

function generateRandomData(context, events, done) {
    context.vars.name = Math.random().toString(36).substring(2);
    context.vars.password = Math.random().toString(36).substring(2);

    context.vars.basic = Buffer.from(context.vars.name + ":" + context.vars.password).toString("base64");

    context.vars.value1 = Math.round(Math.random() * 1000);
    context.vars.value2 = Math.round(Math.random() * 1000);

    return done();
}

module.exports = {
    generateRandomData
};
