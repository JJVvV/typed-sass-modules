import chalk from 'chalk';
import cosmiconfig from 'cosmiconfig';
import sass from 'node-sass';

const sassConfig = (() => {
  const rc = cosmiconfig('sass').searchSync();
  return rc === null ? {} : rc.config;
})();

export const readSass = (pathName, relativeTo) => new Promise((resolve, reject) => {
  sass.render(Object.assign({}, sassConfig, {
    file: pathName
  }), (err, result) => {
    if (err && relativeTo && relativeTo !== '/') {
      return resolve([]);
    } else if (err && (!relativeTo || relativeTo === '/')) {
      return reject(err);
    }

    return resolve(result.css.toString());
  });
});
export const createTypings = (pathName, creator, cache, handleError, handleWarning, verbose) => readSass(pathName).then(content => creator.create(pathName, content, cache)).then(c => c.writeFile()).then(c => {
  if (verbose) {
    console.info(`Created ${chalk.green(c.outputFilePath)}`);
  }

  c.messageList.forEach(message => {
    const warningTitle = chalk.yellow(`WARNING: ${pathName}`);
    const warningInfo = message;
    handleWarning(`${warningTitle}\n${warningInfo}`);
  });
  return c;
}).catch(reason => {
  const errorTitle = chalk.red(`ERROR: ${pathName}`);
  const errorInfo = reason;
  handleError(`${errorTitle}\n${errorInfo}`);
});
export const createTypingsForFileOnWatch = (creator, cache, verbose) => pathName => {
  let warnings = 0;
  let errors = 0;

  const handleError = error => {
    console.error(error);
    errors += 1;
  };

  const handleWarning = warning => {
    console.warn(warning);
    warnings += 1;
  };

  const onComplete = ret => {
    if (warnings + errors > 0) {
      console.info(`${pathName}: ${warnings} warnings, ${errors} errors`);
    }

    warnings = 0;
    errors = 0;
    return ret;
  };

  return createTypings(pathName, creator, cache, handleError, handleWarning, verbose).then(onComplete);
};
export const createTypingsForFiles = (creator, cache, verbose) => pathNames => {
  let warnings = 0;
  let errors = 0;

  const handleError = error => {
    console.error(error);
    errors += 1;
  };

  const handleWarning = warning => {
    console.warn(warning);
    warnings += 1;
  };

  const onComplete = ret => {
    if (warnings + errors > 0) {
      console.info(`Completed with ${warnings} warnings and ${errors} errors.`);
    }

    errors = 0;
    warnings = 0;
    return ret;
  };

  return Promise.all(pathNames.map(pathName => createTypings(pathName, creator, cache, handleError, handleWarning, verbose))).then(onComplete);
};