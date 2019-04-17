#!/usr/bin/env node
"use strict";

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _yargs = require("yargs");

var _yargs2 = _interopRequireDefault(_yargs);

var _Creator = require("./Creator");

var _Creator2 = _interopRequireDefault(_Creator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pkg = require('../package.json');

var main = function main() {
  var yarg = _yargs2.default.usage('$0 [inputDir] [options]', 'Create .scss.d.ts from CSS modules *.scss files.', function (commandYargs) {
    commandYargs.positional('inputDir', {
      describe: 'Directory to search for scss files.',
      type: 'string',
      default: '.'
    }).example('$0 src/styles').example('$0 src -o dist').example('$0 -p styles/**/*.scss -w');
  }).detectLocale(false).version(pkg.version).option('c', {
    alias: 'camelCase',
    default: true,
    type: 'boolean',
    describe: 'Convert CSS class tokens to camelCase'
  }).option('o', {
    alias: 'outDir',
    describe: 'Output directory'
  }).option('p', {
    alias: 'pattern',
    default: '**/*.scss',
    describe: 'Glob pattern with scss files'
  }).option('w', {
    alias: 'watch',
    default: false,
    type: 'boolean',
    describe: 'Watch input directory\'s scss files or pattern'
  }).option('d', {
    alias: 'dropExtension',
    default: false,
    type: 'boolean',
    describe: 'Drop the input files extension'
  }).option('v', {
    alias: 'verbose',
    default: true,
    type: 'boolean',
    describe: 'Show verbose message'
  }).option('i', {
    alias: 'ignore',
    describe: 'Glob pattern for files that should be ignored'
  }).alias('h', 'help').help('h');

  var argv = yarg.argv; // Show help

  if (argv.h) {
    yarg.showHelp();
    return;
  }

  var searchDir = argv.inputDir; // Show help if no search diretory present

  if (searchDir === undefined) {
    yarg.showHelp();
    return;
  } // If search directory doesn't exits, exit


  if (!_fs2.default.existsSync(searchDir)) {
    console.error(_chalk2.default.red("Error: Input directory ".concat(searchDir, " doesn't exist.")));
    return;
  }

  var rootDir = process.cwd();
  var creatorIns = new _Creator2.default({
    rootDir: rootDir,
    searchDir: searchDir,
    outDir: argv.o,
    camelCase: argv.c,
    dropExtension: argv.d,
    verbose: argv.v
  });
  creatorIns.create(argv.p);

  if (!argv.w) {
    creatorIns.watch(argv.p);
  }
};

main();