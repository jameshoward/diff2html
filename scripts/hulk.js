#!/usr/bin/env node

/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

// dependencies
var hogan = require('hogan.js');
var path = require('path');
var nopt = require('nopt');
var mkderp = require('mkdirp');
var fs = require('fs');

// locals
var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
var specialsRegExp = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
var options = {
  'namespace': String,
  'outputdir': path,
  'variable': String,
  'wrapper': String,
  'version': true,
  'help': true
};
var shortHand = {
  'n': ['--namespace'],
  'o': ['--outputdir'],
  'vn': ['--variable'],
  'w': ['--wrapper'],
  'h': ['--help'],
  'v': ['--version']
};
var templates;

// options
options = nopt(options, shortHand);

// escape special regexp characters
function esc(text) {
  return text.replace(specialsRegExp, '\\$1');
}

// cyan function for rob
function cyan(text) {
  return '\x1B[36m' + text + '\x1B[39m';
}

// check for dirs and correct ext (<3 for windows)
function extractFiles(args) {
  var usage = '\n' +
    cyan('USAGE:') + '   hulk [--wrapper wrapper] [--outputdir outputdir] ' +
    '[--namespace namespace] [--variable variable] FILES\n\n' +
    cyan('OPTIONS:') + ' [-w, --wrapper]   :: wraps the template (i.e. amd)\n' +
    '         [-o,  --outputdir] :: outputs the templates as individual files to a directory\n\n' +
    '         [-n,  --namespace] :: prepend string to template names\n\n' +
    '         [-vn, --variable]  :: variable name for non-amd wrapper\n\n' +
    cyan('EXAMPLE:') + ' hulk --wrapper amd ./templates/*.mustache\n\n' +
    cyan('NOTE:') + '    hulk supports the "*" wildcard and allows you to target specific extensions too\n';
  var files = [];

  if (options.version) {
    console.log(require('../package.json').version);
    process.exit(0);
  }

  if (!args.length || options.help) {
    console.log(usage);
    process.exit(0);
  }

  args.forEach(function(arg) {
    if (/\*/.test(arg)) {
      arg = arg.split('*');
      files = files.concat(
        fs.readdirSync(arg[0] || '.')
          .map(function(f) {
            var file = path.join(arg[0], f);
            return new RegExp(esc(arg[1]) + '$').test(f) && fs.statSync(file).isFile() && file;
          })
          .filter(function(f) {
            return f;
          })
      );
      return files;
    }

    if (fs.statSync(arg).isFile()) files.push(arg);
  });

  return files;
}

// remove utf-8 byte order mark, http://en.wikipedia.org/wiki/Byte_order_mark
function removeByteOrderMark(text) {
  if (text.charCodeAt(0) === 0xfeff) {
    return text.substring(1);
  }
  return text;
}

// wrap templates
function wrap(file, name, openedFile) {
  switch (options.wrapper) {
    case 'amd':
      return 'define(' + (!options.outputdir ? '"' + path.join(path.dirname(file), name) + '", ' : '') +
        '[ "hogan.js" ], function(Hogan){ return new Hogan.Template(' +
        hogan.compile(openedFile, {asString: 1}) +
        ');});';
    case 'node':
      var globalObj = 'global.' + (options.variable || 'templates') + '["' + name + '"]';
      var globalStmt = globalObj + ' = new Hogan.Template(' + hogan.compile(openedFile, {asString: 1}) + ');';
      var nodeOutput = globalStmt;

      // if we have a template per file the export will expose the template directly
      if (options.outputdir) {
        nodeOutput = nodeOutput + '\n' + 'module.exports = ' + globalObj + ';';
      }

      return nodeOutput;
    default:
      return (options.variable || 'templates') +
        '["' + name + '"] = new Hogan.Template(' +
        hogan.compile(openedFile, {asString: 1}) +
        ');';
  }
}

function prepareOutput(content) {
  var variableName = options.variable || 'templates';
  switch (options.wrapper) {
    case 'amd':
      return content;
    case 'node':
      var nodeExport = '';

      // if we have aggregated templates the export will expose the template map
      if (!options.outputdir) {
        nodeExport = 'module.exports = global.' + variableName + ';\n';
      }

      return '(function() {\n' +
        'if (!!!global.' + variableName + ') global.' + variableName + ' = {};\n' +
        'var Hogan = require("hogan.js");' +
        content + '\n' +
        nodeExport +
        '})();';
    default:
      return 'if (!!!' + variableName + ') var ' + variableName + ' = {};\n' + content;
  }
}

// write the directory
if (options.outputdir) {
  mkderp.sync(options.outputdir);
}

// Prepend namespace to template name
function namespace(name) {
  return (options.namespace || '') + name;
}

// write a template foreach file that matches template extension
templates = extractFiles(options.argv.remain)
  .map(function(file) {
    var openedFile = fs.readFileSync(file, 'utf-8');
    var name;
    if (!openedFile) return;
    name = namespace(path.basename(file).replace(/\..*$/, ''));
    openedFile = removeByteOrderMark(openedFile.trim());
    openedFile = wrap(file, name, openedFile);
    if (!options.outputdir) return openedFile;
    fs.writeFileSync(path.join(options.outputdir, name + '.js')
      , prepareOutput(openedFile));
  })
  .filter(function(t) {
    return t;
  });

// output templates
if (!templates.length || options.outputdir) process.exit(0);

console.log(prepareOutput(templates.join('\n')));
