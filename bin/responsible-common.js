//OS agnostic file system
var fs = require('fs');

module.exports = {
    //Root of where script was called from the terminal
    callRoot: './',

    //package.json file with scripts & dependencies to be justified
    config: 'package.json',

    //responsible.json file providing justifications for all dependencies & scripts
    configResponsible: 'responsible.json',

    //read and parse file to json object
    readJSON: function (file) {
        if (!fs.existsSync(this.callRoot + file)) {
            var error = "'" + file + "' doesn't exist, dependencies can't be justified";
            throw error;
        }
        try {
            //parse JSON from file
            var parsedJSON = JSON.parse(fs.readFileSync(this.callRoot + file));
            if (parsedJSON !== Object(parsedJSON) || parsedJSON.constructor === Array) {
                //Expect a {key: value} object, not primitive, array, etc
                throw 'invalid json';
            }
            else {
                return parsedJSON;
            }
        }
        catch (err) {
            console.log("failed as expected");
            var error = "'" + file + "' isn't properly formatted json, dependencies can't be justified";
            throw error;
        }
    },

    //serialize json to specified file (overwriting file contents)
    writeJSON: function (json, file) {
        //write json to filesystem, including indentation for readability
        fs.writeFileSync(this.callRoot + file, JSON.stringify(json, null, '\t'));
    },

    //set configuration default values as necessary
    setConfigDefaults: function (currentConfig) {
        var config = currentConfig;
        if (!config) {
            config = {
                "purpose": [
                    "Annotate all dependencies & scripts with justifications for their existence",
                    "If you can't justify it, DON'T depend on it"
                ]
            };
        }

        //set default checks if not specified
        if (!config.justify || config.justify.constructor !== Array) {
            config.justify = ['scripts', 'dependencies', 'devDependencies']; //defaults
        }

        //set default minimum reasoning message length
        if (!config.minReasoning || typeof config.minReasoning !== "number") {
            config.minReasoning = 8; //Ignore small 'bs' justifications like "because", "abc123", etc
        }
        return config;
    }
};