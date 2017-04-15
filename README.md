# ResponsibleJS

## Background
ResponsibleJS is a simple project created out of the seeming chaos of the javascript ecosystem.  It's easy to come across tutorials and examples with seemingly vast amounts of dependencies without any clear guidance on their purpose of inclusion in the first place.  

It's easy to carelessly add items to your `package.json` before your project even starts, without having any real understanding of their purpose. 

Unfortunately, due to the limitations of the json format, it isn't as easy as adding `//` or `<!---->` commments to your `package.json` to give yourself and current or future team members feedback on why your `package.json` file is as seemingly bloated or cryptic as it has become.

For example, this is bad json:
```json
{
  "scripts": {
    "clean": "rimraf build",                //Cleans build directory
    "build": "npm run clean && webpack -p", //Builds (minified) app bundle
    "dev": "webpack-dev-server --open"      //Builds app bundle (in memory) and opens browser to app location
  },
  "devDependencies": {
    "@types/react": "^15.0.21",             //Intellisense support for React
    "@types/react-dom": "^0.14.23",         //Intellisense support for ReactDOM
    "awesome-typescript-loader": "^3.1.2",  //Compile TypeScript and Transpile ES2015 to ES5
    "html-webpack-plugin": "^2.28.0",       //Used for automatically attaching webpack bundles to html page during build
    "rimraf": "^2.6.1",                     //Used for cleaning build directory
    "typescript": "^2.2.2",                 //Static typing support, transpilation of ES2015 to ES5
    "webpack": "^2.3.3",                    //Used for building/bundling app
    "webpack-dev-server": "^2.4.2"          //Used for hot reloading of app during development
  },
  "dependencies": {
    "react": "^15.5.4",                     //Used for creating dynamic view layer component, JSX provides strong typing & intellisense support when combined with Typescript
    "react-dom": "^15.5.4"                  //Used for rendering React components in the browser DOM
  }
}
```

ResponsibleJS aims to help solve this problem.  ResponsibleJS creates a companion `responsible.json` configuration file to mirror the `package.json` configuration file, containing comments justifying all the dependencies associated with your project.  This configuration file can serve as documentation, as well as providing a real time constraint on getting careless with your project.  

ResponsibleJS can monitor this file, giving feedback in your terminal on what dependencies and scripts your project contains that haven't yet been vetted.  The idea is to "help you help yourself" (namely your future self), by urging you to ask the question:

"Do I need XYZ?  What does XYZ even do?"

## Usage

ResponsibleJS can be run by the terminal (or included in a script in your `package.json`), just by entering the following:
```sh
responsiblejs
```
By default ResponsibleJS will run in "assert" mode.  

In assert mode, ResponsibleJS reads the `package.json` and `responsible.json` files looking for undocumented elements.  When it finds any, it will throw an error, providing a user friendly outline of all the offending elements in your `package.json` file.
```sh
| Irresponsible 'package.json' found
|    scripts
|        clean
|        build
|        dev
|    devDependencies
|        @types/react
|        @types/react-dom
|        awesome-typescript-loader
|        html-webpack-plugin
|        rimraf
|        typescript
|        webpack
|        webpack-dev-server
|    dependencies
|        react
|        react-dom
```
By specifying an `-r` or `-refresh` flag, ResponsibleJS will run in "refresh" mode.

```sh
responsiblejs -r
responsiblejs -refresh
```
```sh
'responsible.json' has been updated to match current 'package.json'
```
In refresh mode:
- A new `responsible.json` file will be created (if it doesn't already exist)
- The `responsible.json` file will be initialized with any missing default values
- Any new elements in `package.json` will be added to the `responsible.json` file 
- Any removed/uninstalled dependencies will be wiped from the `responsible.json` file.
## Format
An example of a newly created `responsible.json` file:
```json
{
	"purpose": [
		"Annotate all dependencies & scripts with justifications for their existence",
		"If you can't justify it, DON'T depend on it"
	],
	"justify": [
		"scripts",
		"dependencies",
		"devDependencies"
	],
	"minReasoning": 8,
	"scripts": {
		"clean": "",
		"build": "",
		"dev": ""
	},
	"devDependencies": {
		"@types/react": "",
		"@types/react-dom": "",
		"awesome-typescript-loader": "",
		"html-webpack-plugin": "",
		"rimraf": "",
		"typescript": "",
		"webpack": "",
		"webpack-dev-server": ""
	},
	"dependencies": {
		"react": "",
		"react-dom": ""
	}
}
```
Looks kind of familiar doesn't it?  

The format mimics the `package.json` file, including a few additional configuration properties:
- The `purpose` property is purely syntactic sugar (reminding you why this file is in your project in the first place). 
- The `minReasoning` property specifies the minimum length of a valid justification comment (by default it is 8 to weed out small 'bs' answers like "because", "bcuz", "abc123", etc)
- The `verify` property accepts an array of strings specifying which parts of the `package.json` to monitor (by default it includes the `scripts`, `devDependencies`, and `dependencies` sections)

An example of a completed `responsible.json` file:

```json
{
	"purpose": [
		"Annotate all dependencies & scripts with justifications for their existence",
		"If you can't justify it, DON'T depend on it"
	],
	"justify": [
		"scripts",
		"dependencies",
		"devDependencies"
	],
	"minReasoning": 8,
	"scripts": {
		"clean": "npm run clean -> Cleans build directory",
		"build": "npm run build -> Builds (minified) app bundle",
		"dev": "npm run dev -> Builds app bundle (in memory) and opens browser to app location"
	},
	"devDependencies": {
		"@types/react": "Intellisense support for React",
		"@types/react-dom": "Intellisense support for ReactDOM",
		"awesome-typescript-loader": [
			"Webpack loader responsible for compiling typescript",
			"Uses TypeScript to transpile normal javascript from ES2015 to ES5 (for cross browser compatibility)"
		],
		"html-webpack-plugin": "Used for automatically attaching webpack bundles to html page during build",
		"rimraf": "Used for cleaning build directory",
		"typescript": [
			"Static typing support",
			"Transpiles ES2015 to ES5 (for cross browser compatibility)"
		],
		"webpack": "Used for building/bundling app",
		"webpack-dev-server": "Used for hot reloading of app during development"
	},
	"dependencies": {
		"react": [
			"Used for creating dynamic view layer components",
			"JSX provides strong typing & intellisense support when combined with Typescript"
		],
		"react-dom": "Used for rendering React components in the browser DOM"
	}
}
```
ResponsibleJS accepts both strings and arrays of strings (meant to mimic multiline comments) for element justifications.

Now if we run ResponsibleJS with our newly filled out `responsible.json` file, we shouldn't receive any errors:
```sh
responsiblejs
```
```sh
All 'package.json' components have been justified
```

## Advanced Usage
The real purpose of ResponsibleJS is to be run in tandem with your normal scripts to prevent you from continuing your normal routine without documenting your intent of your `package.json` configuration file.  

`responsiblejs` can easily be prefixed into your other scripts like so:
```json
"dev": "responsiblejs && webpack-dev-server --open"
```
Now when running the dev script, webpack-dev-server won't run without `package.json` first being properly documented:
```sh
PS G:\Programming\react\boilerplate-ts> npm run dev

> @ dev G:\Programming\react\boilerplate-ts
> responsiblejs && webpack-dev-server --open


G:\Programming\side-projects\responsiblejs\bin\responsible-assert.js:102
            throw errorMessage;
            ^

| Irresponsible 'package.json' found
|    scripts
|        clean
|        build
|        dev
|    devDependencies
|        @types/react
|        @types/react-dom
|        awesome-typescript-loader
|        html-webpack-plugin
|        rimraf
|        typescript
|        webpack
|        webpack-dev-server
|    dependencies
|        react
|        react-dom
```

After fixing the `responsible.json` file, the application will run normally.
```sh
PS G:\Programming\react\boilerplate-ts> npm run dev

> @ dev G:\Programming\react\boilerplate-ts
> responsiblejs && webpack-dev-server --open

All 'package.json' components have been justified
Project is running at http://localhost:8080/
webpack output is served from /
```
