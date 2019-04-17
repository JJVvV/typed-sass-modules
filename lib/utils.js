"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTypingsForFiles = exports.createTypingsForFileOnWatch = exports.createTypings = exports.readSass = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _cosmiconfig = _interopRequireDefault(require("cosmiconfig"));

var _nodeSass = _interopRequireDefault(require("node-sass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sassConfig = function () {
  var rc = (0, _cosmiconfig.default)('sass').searchSync();
  return rc === null ? {} : rc.config;
}();

var readSass = function readSass(pathName, relativeTo) {
  return new Promise(function (resolve, reject) {
    _nodeSass.default.render(Object.assign({}, sassConfig, {
      file: pathName
    }), function (err, result) {
      if (err && relativeTo && relativeTo !== '/') {
        return resolve([]);
      } else if (err && (!relativeTo || relativeTo === '/')) {
        return reject(err);
      }

      return resolve(result.css.toString());
    });
  });
};

exports.readSass = readSass;

var createTypings = function createTypings(pathName, creator, cache, handleError, handleWarning, verbose) {
  return readSass(pathName).then(function (content) {
    return creator.create(pathName, content, cache);
  }).then(function (c) {
    return c.writeFile();
  }).then(function (c) {
    if (verbose) {
      console.info("Created ".concat(_chalk.default.green(c.outputFilePath)));
    }

    c.messageList.forEach(function (message) {
      var warningTitle = _chalk.default.yellow("WARNING: ".concat(pathName));

      var warningInfo = message;
      handleWarning("".concat(warningTitle, "\n").concat(warningInfo));
    });
    return c;
  }).catch(function (reason) {
    var errorTitle = _chalk.default.red("ERROR: ".concat(pathName));

    var errorInfo = reason;
    handleError("".concat(errorTitle, "\n").concat(errorInfo));
  });
};

exports.createTypings = createTypings;

var createTypingsForFileOnWatch = function createTypingsForFileOnWatch(creator, cache, verbose) {
  return function (pathName) {
    var warnings = 0;
    var errors = 0;

    var handleError = function handleError(error) {
      console.error(error);
      errors += 1;
    };

    var handleWarning = function handleWarning(warning) {
      console.warn(warning);
      warnings += 1;
    };

    var onComplete = function onComplete(ret) {
      if (warnings + errors > 0) {
        console.info("".concat(pathName, ": ").concat(warnings, " warnings, ").concat(errors, " errors"));
      }

      warnings = 0;
      errors = 0;
      return ret;
    };

    return createTypings(pathName, creator, cache, handleError, handleWarning, verbose).then(onComplete);
  };
};

exports.createTypingsForFileOnWatch = createTypingsForFileOnWatch;

var createTypingsForFiles = function createTypingsForFiles(creator, cache, verbose) {
  return function (pathNames) {
    var warnings = 0;
    var errors = 0;

    var handleError = function handleError(error) {
      console.error(error);
      errors += 1;
    };

    var handleWarning = function handleWarning(warning) {
      console.warn(warning);
      warnings += 1;
    };

    var onComplete = function onComplete(ret) {
      if (warnings + errors > 0) {
        console.info("Completed with ".concat(warnings, " warnings and ").concat(errors, " errors."));
      }

      errors = 0;
      warnings = 0;
      return ret;
    };

    return Promise.all(pathNames.map(function (pathName) {
      return createTypings(pathName, creator, cache, handleError, handleWarning, verbose);
    })).then(onComplete);
  };
};

exports.createTypingsForFiles = createTypingsForFiles;