import DtsCreator from 'typed-css-modules';
import glob from 'glob';
import path from 'path';
import chokidar from 'chokidar';
import { createTypingsForFiles, createTypingsForFileOnWatch } from './utils';
export default class Creator {
  constructor(options) {
    if (!options) options = {};
    this.options = Object.assign({}, {
      pattern: '**/*.scss',
      verbose: false,
      searchDir: '.'
    }, options);
    this.creator = new DtsCreator(this.options);
  }

  get filesPattern() {
    return path.join(this.options.searchDir, this.options.pattern);
  }

  create(pattern) {
    if (pattern !== undefined) {
      this.options.pattern = pattern;
    }

    return new Promise((resolve, reject) => {
      glob(this.filesPattern, null, (err, pathNames) => {
        if (err) {
          reject(err);
          console.error(err);
          return;
        } else if (!pathNames || !pathNames.length) {
          console.info('Creating typings for 0 files');
          reject();
          return;
        }

        console.info(`Creating typings for ${pathNames.length} files\n`);
        createTypingsForFiles(this.creator, false, this.options.verbose)(pathNames).then(ret => {
          resolve(ret);
        });
      });
    });
  }

  watch() {
    console.info(`Watching ${this.filesPattern} ...\n`);
    const chokidarOptions = this.options.i ? {
      ignored: this.options.i
    } : null;
    const watcher = chokidar.watch(this.filesPattern, chokidarOptions);
    watcher.on('add', createTypingsForFileOnWatch(this.creator, true, this.options.verbose));
    watcher.on('change', createTypingsForFileOnWatch(this.creator, true, this.options.verbose));
  }

}