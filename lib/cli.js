#!/usr/bin/env node
import chalk from 'chalk';
import fs from 'fs';
import yargs from 'yargs';
import Creator from './Creator';

const pkg = require('../package.json');

const main = () => {
  const yarg = yargs.usage('$0 [inputDir] [options]', 'Create .scss.d.ts from CSS modules *.scss files.', commandYargs => {
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
  const {
    argv
  } = yarg; // Show help

  if (argv.h) {
    yarg.showHelp();
    return;
  }

  const searchDir = argv.inputDir; // Show help if no search diretory present

  if (searchDir === undefined) {
    yarg.showHelp();
    return;
  } // If search directory doesn't exits, exit


  if (!fs.existsSync(searchDir)) {
    console.error(chalk.red(`Error: Input directory ${searchDir} doesn't exist.`));
    return;
  }

  const rootDir = process.cwd();
  const creatorIns = new Creator({
    rootDir,
    searchDir,
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