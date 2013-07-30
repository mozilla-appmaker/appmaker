#!/usr/bin/env node
/**
 * @license Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

/**
 * This file converts jQuery UI files to use define() syntax.
 *
 * It should be run in node (only 0.6+).
 */

/*jslint node: true, regexp: true */
/*global */
'use strict';

var fs = require('fs'),
    path = require('path'),
    inDir = process.argv[2],
    jsFileRegExp = /\.js$/,
    dependStartRegExp =  /\*\s+Depends\:([^\/]+)\*\//,
    dotRegExp = /\./g,
    filesRegExp = /([\w\.]+)\.js/g,
    exists = fs.existsSync || path.existsSync,
    jqUiSrcDir,
    jqPaths;

function mkDir(dir) {
    if (!exists(dir)) {
        //511 is decimal for 0777 octal
        fs.mkdirSync(dir, 511);
    }
}

/**
 * Converts the contents of a file to an AMD module.
 * @param {String} contents the file contents.
 */
function convert(fileName, contents) {
    //Find dependencies.
    var moduleName, outFileName, i, segment,
        match = dependStartRegExp.exec(contents),
        files = ["'jquery'"],
        fileParts = fileName.split('.'),
        tempDir = inDir;

    //Strip off .js extension and convert jquery-ui to jqueryui,
    //generate module name.
    fileParts.pop();
    if (fileParts[0].indexOf('jquery-ui') !== -1) {
        moduleName = 'jqueryui';
        outFileName = inDir + moduleName + '.js';
    } else {
        //convert preceding 'jquery' to 'jqueryui'
        fileParts[0] = 'jqueryui';
        //remove .ui from path since it is implied already from
        //top level 'jqueryui' name.
        if (fileParts[1] === 'ui') {
            fileParts.splice(1, 1);
        }
        moduleName = fileParts.join('/');
        outFileName = inDir + moduleName + '.js';
    }

    //If fileParts' last piece is a datepicker i18n bundle, make datepicker
    //an explicit dependency for it.
    if (fileParts[fileParts.length - 1].indexOf('datepicker-') === 0) {
        files.push("'jqueryui/datepicker'");
    }

    //Make sure directories exist in the jqueryui section.
    if (moduleName !== 'jqueryui' && fileParts.length > 1) {
        for (i = 0; i < fileParts.length - 1; i += 1) {
            segment = fileParts[i];
            tempDir += segment + '/';
            mkDir(tempDir);
        }
    }

    if (match) {
        match[1].replace(filesRegExp, function (match, depName) {
            files.push("'./" + depName
                             //Remove .ui from the name if it is there,
                             //since it is already implied by the jqueryui
                             //name
                             .replace(/\.ui\./, '.')
                             .replace(/^jquery\./, '')
                             //Convert to module name.
                             .replace(dotRegExp, '/') +
                       "'");
        });
    }

    contents = 'define(' +
           '[' + files.join(',') + '], function (jQuery) {\n' +
           contents +
           '\n});';

    fs.writeFileSync(outFileName, contents);
}

//Make sure required fields are present.
if (!inDir) {
    console.log('Usage: jqueryui-amd inputDir');
    process.exit(1);
}

//Normalize directory
inDir = path.normalize(inDir);
if (inDir.lastIndexOf('/') !== inDir.length - 1) {
    inDir += '/';
}

//Make sure there is a ui directory in there, otherwise cannot
//convert correctly.
jqUiSrcDir = path.join(inDir, 'ui/');

if (!exists(jqUiSrcDir) || !fs.statSync(jqUiSrcDir).isDirectory()) {
    console.log('The directory does not appear to contain jQuery UI, ' +
                'not converting any files. Looking for "ui" directory ' +
                'in the source directory failed.');
    process.exit(1);
}

//For each file that is a sibling to jquery-ui, transform to define.
jqPaths = fs.readdirSync(jqUiSrcDir);
jqPaths.forEach(function (fileName) {
    var srcPath = jqUiSrcDir + fileName;
    if (fs.statSync(srcPath).isFile() && jsFileRegExp.test(srcPath)) {
        //console.log("Converting file: " + convertPath);
        convert(fileName, fs.readFileSync(srcPath, 'utf8'));
    }
});

//Transform the i18n files.
jqPaths = fs.readdirSync(jqUiSrcDir + 'i18n');
jqPaths.forEach(function (fileName) {
    var srcPath = jqUiSrcDir + 'i18n/' + fileName;
    if (fs.statSync(srcPath).isFile() && jsFileRegExp.test(srcPath)) {
        //console.log("Converting file: " + convertPath);
        convert(fileName, fs.readFileSync(srcPath, 'utf8'));
    }
});

console.log("Done. See " + path.join(inDir, 'jqueryui') + ' for the AMD modules.');
