"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typedCssModules = _interopRequireDefault(require("typed-css-modules"));

var _glob = _interopRequireDefault(require("glob"));

var _path = _interopRequireDefault(require("path"));

var _chokidar = _interopRequireDefault(require("chokidar"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Creator =
/*#__PURE__*/
function () {
  function Creator(options) {
    _classCallCheck(this, Creator);

    if (!options) options = {};
    this.options = Object.assign({}, {
      pattern: '**/*.scss',
      verbose: false,
      searchDir: '.'
    }, options);
    this.creator = new _typedCssModules.default(this.options);
  }

  _createClass(Creator, [{
    key: "create",
    value: function create(pattern) {
      var _this = this;

      if (pattern !== undefined) {
        this.options.pattern = pattern;
      }

      return new Promise(function (resolve, reject) {
        (0, _glob.default)(_this.filesPattern, null, function (err, pathNames) {
          if (err) {
            reject(err);
            console.error(err);
            return;
          } else if (!pathNames || !pathNames.length) {
            console.info('Creating typings for 0 files');
            reject();
            return;
          }

          console.info("Creating typings for ".concat(pathNames.length, " files\n"));
          (0, _utils.createTypingsForFiles)(_this.creator, false, _this.options.verbose)(pathNames).then(function (ret) {
            resolve(ret);
          });
        });
      });
    }
  }, {
    key: "watch",
    value: function watch() {
      console.info("Watching ".concat(this.filesPattern, " ...\n"));
      var chokidarOptions = this.options.i ? {
        ignored: this.options.i
      } : null;

      var watcher = _chokidar.default.watch(this.filesPattern, chokidarOptions);

      watcher.on('add', (0, _utils.createTypingsForFileOnWatch)(this.creator, true, this.options.verbose));
      watcher.on('change', (0, _utils.createTypingsForFileOnWatch)(this.creator, true, this.options.verbose));
    }
  }, {
    key: "filesPattern",
    get: function get() {
      return _path.default.join(this.options.searchDir, this.options.pattern);
    }
  }]);

  return Creator;
}();

exports.default = Creator;