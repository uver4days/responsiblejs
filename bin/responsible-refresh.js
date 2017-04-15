//Common library
var responsibleCommon = require('./responsible-common');

//Update responsible.json json with placeholders for new items found in package.json
function populateComponents(package, justifications) {
    for (var i in package) {
        //top level package.json key (aka 'scripts')
        var key = i;
        if (justifications.justify.includes(key)) {
            //Add top level component ('scripts', etc) to responsible.json file
            if (!justifications[key]) {
                justifications[key] = {};
            }
            var val = package[key];
            for (var j in val) {
                //component inside key (aka 'react' inside dependencies object)
                var subKey = j;
                if (!justifications[key][subKey]) {
                    //add default empty justification
                    justifications[key][subKey] = '';
                }
            }
        }
    }
    return justifications;
}

//Cleans out old components listed in responsible.json that no longer exist inside package.json
function deprecateComponents(package, justifications) {
    for (var i in justifications) {
        //top level package.json key (aka 'scripts')
        var key = i;
        if (justifications.justify.includes(key)) {
            //Add top level component ('scripts', etc) to responsible.json file
            if (!package[key]) {
                justifications[key] = undefined;
            }
            else {
                var val = justifications[key];
                for (var j in val) {
                    //component inside key (aka 'react' inside dependencies object)
                    var subKey = j;
                    if (!package[key][subKey]) {
                        //remove component
                        justifications[key][subKey] = undefined;
                    }
                }
            }
        }
    }
    return justifications;
}

module.exports = {
    //updates responsible.json file, adding placeholders for any missing scripts & dependencies
    //and removes any dead script and dependency references
    //responsible.json file is created if it does not already exist
    refreshJustifiedComponents: function () {
        //Parse configuration files
        var packageJSON = responsibleCommon.readJSON(responsibleCommon.config);
        var responsibleJSON;
        try {
            responsibleJSON = responsibleCommon.readJSON(responsibleCommon.configResponsible);
        }
        catch (err) {
            //Ignore -> invalid json
        }

        //Populate any missing defaults
        responsibleJSON = responsibleCommon.setConfigDefaults(responsibleJSON);

        //Update responsible.json and save to disk
        responsibleJSON = populateComponents(packageJSON, responsibleJSON);
        responsibleJSON = deprecateComponents(packageJSON, responsibleJSON);
        responsibleCommon.writeJSON(responsibleJSON, responsibleCommon.configResponsible);

        //print success message to user
        console.log("'" + responsibleCommon.configResponsible + "' has been updated to match current '" + responsibleCommon.config + "' \n");
    }
}