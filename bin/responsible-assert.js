//Common library
var responsibleCommon = require('./responsible-common');

//Format string of all invalid dependencies and scripts
function getInvalidComponents(package, justifications) {
    var errorMessage = '';
    var badConfigs = justify(package, justifications);
    if (badConfigs) {
        var newline = '\n|';
        var indent = '    '; //4 spaces
        errorMessage = errorMessage + newline + " Irresponsible '" + responsibleCommon.config + "' found";
        for (var i in badConfigs) {
            var key = i;
            errorMessage = errorMessage + newline + indent + key;
            for (var j in badConfigs[i]) {
                var component = badConfigs[key][j];
                errorMessage = errorMessage + newline + indent + indent + component;
            }
        }
    }
    return errorMessage;
}

//Provides array of scripts and dependencies that haven't been justified
function justify(package, justifications) {
    //config components that haven't been justified
    var unjustified = null;
    for (var i in package) {
        //top level package.json key (aka 'scripts')
        var key = i;
        if (justifications.justify.includes(key)) {
            //this key needs to be justified
            var val = package[key];
            for (var j in val) {
                //component inside key (aka 'react' inside dependencies object)
                var subKey = j;
                if (!isJustified(justifications, key, subKey)) {
                    if (!unjustified) {
                        //first unjustified config component found
                        unjustified = {};
                    }
                    if (!unjustified[key]) {
                        //component level (scripts, devDepencies, etc) hasn't been initialized yet
                        unjustified[key] = [];
                    }
                    //add to list of unjustified package.json components
                    unjustified[key].push(subKey);
                }
            }
        }
    }
    return unjustified;
}

//Check package.json component appears in responsible.json with an appropriate justification
function isJustified(justifications, key, subKey) {
    var justification = justifications && justifications[key] && justifications[key][subKey] ? justifications[key][subKey] : null;
    if (!justification) {
        return false; //No justification provided at all
    }
    else if (justification.constructor === Array) {
        var validReasons = justification.filter(isValidReason);
        if (validReasons && validReasons.length) {
            return true; //Valid reason found inside the list of reasons
        }
        else {
            return false; //Array found, but no valid reason found inside the array
        }
    }
    else if (isValidReason(justification, justifications.minReasoning)) {
        return true; //Valid reason provided
    }
    else {
        return false; //Unexpected value type (numeric, etc)
    }
}

//crude check on whether the provided justification is valid
function isValidReason(justification, minReasoning) {
    return isString(justification) && justification.length >= minReasoning;
}

//verify provided value is a string (only accept string based reasons)
//Note: 42 may be the answer to the "Ultimate Question of Life, the Universe, and Everything", but that doesn't make it a valid reason for depending on left-pad
function isString(val) {
    return typeof val === 'string' || ((!!val && typeof val === 'object') && Object.prototype.toString.call(val) === '[object String]');
}

module.exports = {
    assertJustifications: function () {
        //Parse configuration files
        var packageJSON = responsibleCommon.readJSON(responsibleCommon.config);
        var responsibleJSON = responsibleCommon.readJSON(responsibleCommon.configResponsible);

        //Populate any missing defaults
        responsibleJSON = responsibleCommon.setConfigDefaults(responsibleJSON);

        //Check justification of configuration dependencies
        var errorMessage = getInvalidComponents(packageJSON, responsibleJSON);
        if (errorMessage) {
            //invalid justifications found
            throw errorMessage;
        }
        else {
            //print success message
            console.log("All '" + responsibleCommon.config + "' components have been justified\n");
        }
    }
}