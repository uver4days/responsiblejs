#! /usr/bin/env node
var responsibleAssert = require('./responsible-assert');
var responsibleRefresh = require('./responsible-refresh');

var isRefresh = process.argv.indexOf("-r") != -1 || process.argv.indexOf("-refresh") != -1;

if(isRefresh) {
    //refresh responsible.json config
    responsibleRefresh.refreshJustifiedComponents();
}
else {
    //assert responsible.json has valid justifications for package.json elements
    responsibleAssert.assertJustifications();
}