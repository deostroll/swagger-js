module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 45);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/keys");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/assign");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = __webpack_require__(10);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = __webpack_require__(0);

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = __webpack_require__(5);

var _typeof3 = _interopRequireDefault(_typeof2);

exports.opId = opId;
exports.idFromPathMethod = idFromPathMethod;
exports.legacyIdFromPathMethod = legacyIdFromPathMethod;
exports.getOperationRaw = getOperationRaw;
exports.findOperation = findOperation;
exports.eachOperation = eachOperation;
exports.normalizeSwagger = normalizeSwagger;

var _isObject = __webpack_require__(40);

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toLower = function toLower(str) {
  return String.prototype.toLowerCase.call(str);
};
var escapeString = function escapeString(str) {
  return str.replace(/[^\w]/gi, '_');
};

// Strategy for determining operationId
function opId(operation, pathName) {
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  var idWithoutWhitespace = (operation.operationId || '').replace(/\s/g, '');
  if (idWithoutWhitespace.length) {
    return escapeString(operation.operationId);
  } else {
    return idFromPathMethod(pathName, method);
  }
}

// Create a generated operationId from pathName + method
function idFromPathMethod(pathName, method) {
  return '' + toLower(method) + escapeString(pathName);
}

function legacyIdFromPathMethod(pathName, method) {
  return toLower(method) + '-' + pathName;
}

// Get the operation, based on operationId ( just return the object, no inheritence )
function getOperationRaw(spec, id) {
  if (!spec || !spec.paths) {
    return null;
  }

  return findOperation(spec, function (_ref) {
    var pathName = _ref.pathName,
        method = _ref.method,
        operation = _ref.operation;

    if (!operation || (typeof operation === 'undefined' ? 'undefined' : (0, _typeof3.default)(operation)) !== 'object') {
      return false;
    }

    var rawOperationId = operation.operationId; // straight from the source
    var operationId = opId(operation, pathName, method);
    var legacyOperationId = legacyIdFromPathMethod(pathName, method);

    return [operationId, legacyOperationId, rawOperationId].some(function (val) {
      return val && val === id;
    });
  });
}

// Will stop iterating over the operations and return the operationObj
// as soon as predicate returns true
function findOperation(spec, predicate) {
  return eachOperation(spec, predicate, true) || null;
}

// iterate over each operation, and fire a callback with details
// `find=true` will stop iterating, when the cb returns truthy
function eachOperation(spec, cb, find) {
  if (!spec || (typeof spec === 'undefined' ? 'undefined' : (0, _typeof3.default)(spec)) !== 'object' || !spec.paths || (0, _typeof3.default)(spec.paths) !== 'object') {
    return null;
  }

  var paths = spec.paths;

  // Iterate over the spec, collecting operations

  for (var pathName in paths) {
    for (var method in paths[pathName]) {
      if (method.toUpperCase() === 'PARAMETERS') {
        continue;
      }
      var operation = paths[pathName][method];
      if (!operation || (typeof operation === 'undefined' ? 'undefined' : (0, _typeof3.default)(operation)) !== 'object') {
        continue;
      }

      var operationObj = {
        spec: spec,
        pathName: pathName,
        method: method.toUpperCase(),
        operation: operation
      };
      var cbValue = cb(operationObj);

      if (find && cbValue) {
        return operationObj;
      }
    }
  }
}

function normalizeSwagger(parsedSpec) {
  var spec = parsedSpec.spec;
  var paths = spec.paths;

  var map = {};

  if (!paths) {
    return parsedSpec;
  }

  for (var pathName in paths) {
    var path = paths[pathName];

    if (!(0, _isObject2.default)(path)) {
      continue;
    }

    var pathParameters = path.parameters;

    var _loop = function _loop(method) {
      var operation = path[method];
      if (!(0, _isObject2.default)(operation)) {
        return 'continue';
      }

      var oid = opId(operation, pathName, method);

      if (oid) {
        if (map[oid]) {
          map[oid].push(operation);
        } else {
          map[oid] = [operation];
        }

        (0, _keys2.default)(map).forEach(function (op) {
          if (map[op].length > 1) {
            map[op].forEach(function (o, i) {
              o.operationId = '' + op + (i + 1);
            });
          } else {
            // Ensure we always add the normalized operation ID if one already exists ( potentially different, given that we normalize our IDs)
            // ... _back_ to the spec. Otherwise, they might not line up
            if (typeof operation.operationId !== 'undefined') {
              operation.__originalOperationId = operation.operationId;
              operation.operationId = op;
            }
          }
        });
      }

      if (method !== 'parameters') {
        // Add inherited consumes, produces, parameters, securities
        var inheritsList = [];
        var toBeInherit = {};

        // Global-levels
        for (var key in spec) {
          if (key === 'produces' || key === 'consumes' || key === 'security') {
            toBeInherit[key] = spec[key];
            inheritsList.push(toBeInherit);
          }
        }

        // Path-levels
        if (pathParameters) {
          toBeInherit.parameters = pathParameters;
          inheritsList.push(toBeInherit);
        }

        if (inheritsList.length) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = (0, _getIterator3.default)(inheritsList), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var inherits = _step.value;

              for (var inheritName in inherits) {
                if (!operation[inheritName]) {
                  operation[inheritName] = inherits[inheritName];
                } else if (inheritName === 'parameters') {
                  var _iteratorNormalCompletion2 = true;
                  var _didIteratorError2 = false;
                  var _iteratorError2 = undefined;

                  try {
                    var _loop2 = function _loop2() {
                      var param = _step2.value;

                      var exists = operation[inheritName].some(function (opParam) {
                        return opParam.name === param.name;
                      });

                      if (!exists) {
                        operation[inheritName].push(param);
                      }
                    };

                    for (var _iterator2 = (0, _getIterator3.default)(inherits[inheritName]), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      _loop2();
                    }
                  } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                      }
                    } finally {
                      if (_didIteratorError2) {
                        throw _iteratorError2;
                      }
                    }
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }
    };

    for (var method in path) {
      var _ret = _loop(method);

      if (_ret === 'continue') continue;
    }
  }

  return parsedSpec;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = __webpack_require__(5);

var _typeof3 = _interopRequireDefault(_typeof2);

var _toConsumableArray2 = __webpack_require__(31);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = __webpack_require__(0);

var _keys2 = _interopRequireDefault(_keys);

var _assign = __webpack_require__(1);

var _assign2 = _interopRequireDefault(_assign);

var _fastJsonPatch = __webpack_require__(34);

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _regenerator = __webpack_require__(14);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _deepExtend = __webpack_require__(33);

var _deepExtend2 = _interopRequireDefault(_deepExtend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  add: add,
  replace: replace,
  remove: remove,
  merge: merge,
  mergeDeep: mergeDeep,
  context: context,
  getIn: getIn,
  applyPatch: applyPatch,
  parentPathMatch: parentPathMatch,
  flatten: flatten,
  fullyNormalizeArray: fullyNormalizeArray,
  normalizeArray: normalizeArray,
  isPromise: isPromise,
  forEachNew: forEachNew,
  forEachNewPrimitive: forEachNewPrimitive,
  isJsonPatch: isJsonPatch,
  isContextPatch: isContextPatch,
  isPatch: isPatch,
  isMutation: isMutation,
  isAdditiveMutation: isAdditiveMutation,
  isGenerator: isGenerator,
  isFunction: isFunction,
  isObject: isObject,
  isError: isError
};


function applyPatch(obj, patch, opts) {
  opts = opts || {};

  patch = (0, _assign2.default)({}, patch, {
    path: patch.path && normalizeJSONPath(patch.path)
  });

  if (patch.op === 'merge') {
    var valPatch = _get(patch.path);
    _fastJsonPatch2.default.apply(obj, [valPatch]);
    (0, _assign2.default)(valPatch.value, patch.value);
  } else if (patch.op === 'mergeDeep') {
    var _valPatch = _get(patch.path);
    _fastJsonPatch2.default.apply(obj, [_valPatch]);
    (0, _deepExtend2.default)(_valPatch.value, patch.value);
  } else {
    _fastJsonPatch2.default.apply(obj, [patch]);

    // Attach metadata to the resulting value.
    if (opts.allowMetaPatches && patch.meta && isAdditiveMutation(patch) && (Array.isArray(patch.value) || isObject(patch.value))) {
      var _valPatch2 = _get(patch.path);
      _fastJsonPatch2.default.apply(obj, [_valPatch2]);
      (0, _assign2.default)(_valPatch2.value, patch.meta);
    }
  }

  return obj;
}

function normalizeJSONPath(path) {
  if (Array.isArray(path)) {
    if (path.length < 1) {
      return '';
    }

    return '/' + path.map(function (item) {
      // eslint-disable-line prefer-template
      return (item + '').replace(/~/g, '~0').replace(/\//g, '~1'); // eslint-disable-line prefer-template
    }).join('/');
  }

  return path;
}

// =========================
// JSON-Patch Wrappers
// =========================

function add(path, value) {
  return { op: 'add', path: path, value: value };
}

function _get(path) {
  return { op: '_get', path: path };
}

function replace(path, value, meta) {
  return { op: 'replace', path: path, value: value, meta: meta };
}

function remove(path, value) {
  return { op: 'remove', path: path };
}

// Custom wrappers
function merge(path, value) {
  return { type: 'mutation', op: 'merge', path: path, value: value };
}

// Custom wrappers
function mergeDeep(path, value) {
  return { type: 'mutation', op: 'mergeDeep', path: path, value: value };
}

function context(path, value) {
  return { type: 'context', path: path, value: value };
}

// =========================
// Iterators
// =========================

function forEachNew(mutations, fn) {
  try {
    return forEachNewPatch(mutations, forEach, fn);
  } catch (e) {
    return e;
  }
}

function forEachNewPrimitive(mutations, fn) {
  try {
    return forEachNewPatch(mutations, forEachPrimitive, fn);
  } catch (e) {
    return e;
  }
}

function forEachNewPatch(mutations, fn, callback) {
  var res = mutations.filter(isAdditiveMutation).map(function (mutation) {
    return fn(mutation.value, callback, mutation.path);
  }) || [];
  var flat = flatten(res);
  var clean = cleanArray(flat);
  return clean;
}

function forEachPrimitive(obj, fn, basePath) {
  basePath = basePath || [];

  if (Array.isArray(obj)) {
    return obj.map(function (val, key) {
      return forEachPrimitive(val, fn, basePath.concat(key));
    });
  }

  if (isObject(obj)) {
    return (0, _keys2.default)(obj).map(function (key) {
      return forEachPrimitive(obj[key], fn, basePath.concat(key));
    });
  }

  return fn(obj, basePath[basePath.length - 1], basePath);
}

function forEach(obj, fn, basePath) {
  basePath = basePath || [];

  var results = [];
  if (basePath.length > 0) {
    var newResults = fn(obj, basePath[basePath.length - 1], basePath);
    if (newResults) {
      results = results.concat(newResults);
    }
  }

  if (Array.isArray(obj)) {
    var arrayResults = obj.map(function (val, key) {
      return forEach(val, fn, basePath.concat(key));
    });
    if (arrayResults) {
      results = results.concat(arrayResults);
    }
  } else if (isObject(obj)) {
    var moreResults = (0, _keys2.default)(obj).map(function (key) {
      return forEach(obj[key], fn, basePath.concat(key));
    });
    if (moreResults) {
      results = results.concat(moreResults);
    }
  }

  results = flatten(results);
  return results;
}

// =========================
// Paths
// =========================

function parentPathMatch(path, arr) {
  if (!Array.isArray(arr)) {
    return false;
  }

  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[i] !== path[i]) {
      return false;
    }
  }

  return true;
}

function getIn(obj, path) {
  return path.reduce(function (val, token) {
    if (typeof token !== 'undefined' && val) {
      return val[token];
    }
    return val;
  }, obj);
}

// =========================
// Array
// =========================

function fullyNormalizeArray(arr) {
  return cleanArray(flatten(normalizeArray(arr)));
}

function normalizeArray(arr) {
  return Array.isArray(arr) ? arr : [arr];
}

function flatten(arr) {
  var _ref;

  return (_ref = []).concat.apply(_ref, (0, _toConsumableArray3.default)(arr.map(function (val) {
    return Array.isArray(val) ? flatten(val) : val;
  })));
}

function cleanArray(arr) {
  return arr.filter(function (elm) {
    return typeof elm !== 'undefined';
  });
}

// =========================
// Is-Thing.
// =========================

function isObject(val) {
  return val && (typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val)) === 'object';
}

function isPromise(val) {
  return isObject(val) && isFunction(val.then);
}

function isFunction(val) {
  return val && typeof val === 'function';
}

function isError(patch) {
  return patch instanceof Error;
}

function isJsonPatch(patch) {
  if (isPatch(patch)) {
    var op = patch.op;
    return op === 'add' || op === 'remove' || op === 'replace';
  }
  return false;
}

function isGenerator(thing) {
  return _regenerator2.default.isGeneratorFunction(thing);
}

function isMutation(patch) {
  return isJsonPatch(patch) || isPatch(patch) && patch.type === 'mutation';
}

function isAdditiveMutation(patch) {
  return isMutation(patch) && (patch.op === 'add' || patch.op === 'replace' || patch.op === 'merge' || patch.op === 'mergeDeep');
}

function isContextPatch(patch) {
  return isPatch(patch) && patch.type === 'context';
}

function isPatch(patch) {
  return patch && (typeof patch === 'undefined' ? 'undefined' : (0, _typeof3.default)(patch)) === 'object';
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/extends");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/typeof");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.self = undefined;

var _slicedToArray2 = __webpack_require__(30);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = __webpack_require__(0);

var _keys2 = _interopRequireDefault(_keys);

var _stringify = __webpack_require__(7);

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = __webpack_require__(5);

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = http;
exports.serializeRes = serializeRes;
exports.serializeHeaders = serializeHeaders;
exports.encodeFormOrQuery = encodeFormOrQuery;
exports.mergeInQueryOrForm = mergeInQueryOrForm;
exports.makeHttp = makeHttp;

__webpack_require__(15);

var _qs = __webpack_require__(44);

var _qs2 = _interopRequireDefault(_qs);

var _jsYaml = __webpack_require__(36);

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _assign = __webpack_require__(8);

var _assign2 = _interopRequireDefault(_assign);

var _isString = __webpack_require__(42);

var _isString2 = _interopRequireDefault(_isString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// For testing
var self = exports.self = {
  serializeRes: serializeRes,
  mergeInQueryOrForm: mergeInQueryOrForm
};

// Handles fetch-like syntax and the case where there is only one object passed-in
// (which will have the URL as a property). Also serilizes the response.
function http(url) {
  var request = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if ((typeof url === 'undefined' ? 'undefined' : (0, _typeof3.default)(url)) === 'object') {
    request = url;
    url = request.url;
  }

  request.headers = request.headers || {};

  // Serializes query, for convenience
  // Should be the last thing we do, as its hard to mutate the URL with
  // the search string, but much easier to manipulate the req.query object
  self.mergeInQueryOrForm(request);

  if (request.requestInterceptor) {
    request = request.requestInterceptor(request) || request;
  }

  // for content-type=multipart\/form-data remove content-type from request before fetch
  // so that correct one with `boundary` is set
  var contentType = request.headers['content-type'] || request.headers['Content-Type'];
  if (/multipart\/form-data/i.test(contentType)) {
    delete request.headers['content-type'];
    delete request.headers['Content-Type'];
  }

  return fetch(request.url, request).then(function (res) {
    var serialized = self.serializeRes(res, url, request).then(function (_res) {
      if (request.responseInterceptor) {
        _res = request.responseInterceptor(_res) || _res;
      }
      return _res;
    });

    if (!res.ok) {
      var error = new Error(res.statusText);
      error.statusCode = error.status = res.status;
      return serialized.then(function (_res) {
        error.response = _res;
        throw error;
      }, function (resError) {
        error.responseError = resError;
        throw error;
      });
    }

    return serialized;
  });
}

function shouldDownloadAsText(contentType) {
  return (/json/.test(contentType) || /xml/.test(contentType) || /yaml/.test(contentType) || /text/.test(contentType)
  );
}

// Serialize the response, returns a promise with headers and the body part of the hash
function serializeRes(oriRes, url) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$loadSpec = _ref.loadSpec,
      loadSpec = _ref$loadSpec === undefined ? false : _ref$loadSpec;

  var res = {
    ok: oriRes.ok,
    url: oriRes.url || url,
    status: oriRes.status,
    statusText: oriRes.statusText,
    headers: serializeHeaders(oriRes.headers)
  };

  var useText = loadSpec || shouldDownloadAsText(res.headers['content-type']);

  // Note: Response.blob not implemented in node-fetch 1.  Use buffer instead.
  var getBody = useText ? oriRes.text : oriRes.blob || oriRes.buffer;

  return getBody.call(oriRes).then(function (body) {
    res.text = body;
    res.data = body;

    if (useText) {
      try {
        // Optimistically try to convert all bodies
        var obj = _jsYaml2.default.safeLoad(body);
        res.body = obj;
        res.obj = obj;
      } catch (e) {
        res.parseError = e;
      }
    }
    return res;
  });
}

// Serialize headers into a hash, where mutliple-headers result in an array.
//
// eg: Cookie: one
//     Cookie: two
//  =  { Cookie: [ "one", "two" ]
function serializeHeaders() {
  var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var obj = {};

  // Iterate over headers, making multiple-headers into an array
  if (typeof headers.forEach === 'function') {
    headers.forEach(function (headerValue, header) {
      if (obj[header] !== undefined) {
        obj[header] = Array.isArray(obj[header]) ? obj[header] : [obj[header]];
        obj[header].push(headerValue);
      } else {
        obj[header] = headerValue;
      }
    });
    return obj;
  }

  return obj;
}

function isFile(obj) {
  if (typeof File !== 'undefined') {
    return obj instanceof File;
  }
  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) === 'object' && typeof obj.pipe === 'function';
}

function formatValue(_ref2, skipEncoding) {
  var value = _ref2.value,
      collectionFormat = _ref2.collectionFormat,
      allowEmptyValue = _ref2.allowEmptyValue;

  var SEPARATORS = {
    csv: ',',
    ssv: '%20',
    tsv: '%09',
    pipes: '|'
  };

  if (typeof value === 'undefined' && allowEmptyValue) {
    return '';
  }
  if (isFile(value)) {
    return value;
  }

  var encodeFn = encodeURIComponent;
  if (skipEncoding) {
    if ((0, _isString2.default)(value)) encodeFn = function encodeFn(str) {
      return str;
    };else encodeFn = function encodeFn(obj) {
      return (0, _stringify2.default)(obj);
    };
  }

  if (value && !Array.isArray(value)) {
    return encodeFn(value);
  }
  if (Array.isArray(value) && !collectionFormat) {
    return value.map(encodeFn).join(',');
  }
  if (collectionFormat === 'multi') {
    return value.map(encodeFn);
  }
  return value.map(encodeFn).join(SEPARATORS[collectionFormat]);
}

// Encodes an object using appropriate serializer.
function encodeFormOrQuery(data) {
  /**
   * Encode parameter names and values
   * @param {Object} result - parameter names and values
   * @param {string} parameterName - Parameter name
   * @return {object} encoded parameter names and values
   */
  var encodedQuery = (0, _keys2.default)(data).reduce(function (result, parameterName) {
    var isObject = function isObject(a) {
      return a && (typeof a === 'undefined' ? 'undefined' : (0, _typeof3.default)(a)) === 'object';
    };
    var paramValue = data[parameterName];
    var encodedParameterName = encodeURIComponent(parameterName);
    var notArray = isObject(paramValue) && !Array.isArray(paramValue);
    result[encodedParameterName] = formatValue(notArray ? paramValue : { value: paramValue });
    return result;
  }, {});
  return _qs2.default.stringify(encodedQuery, { encode: false, indices: false }) || '';
}

// If the request has a `query` object, merge it into the request.url, and delete the object
function mergeInQueryOrForm() {
  var req = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _req$url = req.url,
      url = _req$url === undefined ? '' : _req$url,
      query = req.query,
      form = req.form;


  var joinSearch = function joinSearch() {
    for (var _len = arguments.length, strs = Array(_len), _key = 0; _key < _len; _key++) {
      strs[_key] = arguments[_key];
    }

    var search = strs.filter(function (a) {
      return a;
    }).join('&'); // Only truthy value
    return search ? '?' + search : ''; // Only add '?' if there is a str
  };

  if (form) {
    var hasFile = (0, _keys2.default)(form).some(function (key) {
      return isFile(form[key].value);
    });

    var contentType = req.headers['content-type'] || req.headers['Content-Type'];

    if (hasFile || /multipart\/form-data/i.test(contentType)) {
      var FormData = __webpack_require__(35); // eslint-disable-line global-require
      req.body = new FormData();
      (0, _keys2.default)(form).forEach(function (key) {
        req.body.append(key, formatValue(form[key], true));
      });
    } else {
      req.body = encodeFormOrQuery(form);
    }

    delete req.form;
  }

  if (query) {
    var _url$split = url.split('?'),
        _url$split2 = (0, _slicedToArray3.default)(_url$split, 2),
        baseUrl = _url$split2[0],
        oriSearch = _url$split2[1];

    var newStr = '';

    if (oriSearch) {
      var oriQuery = _qs2.default.parse(oriSearch);
      var keysToRemove = (0, _keys2.default)(query);
      keysToRemove.forEach(function (key) {
        return delete oriQuery[key];
      });
      newStr = _qs2.default.stringify(oriQuery, { encode: true });
    }

    var finalStr = joinSearch(newStr, encodeFormOrQuery(query));
    req.url = baseUrl + finalStr;
    delete req.query;
  }
  return req;
}

// Wrap a http function ( there are otherways to do this, conisder this deprecated )
function makeHttp(httpFn, preFetch, postFetch) {
  postFetch = postFetch || function (a) {
    return a;
  };
  preFetch = preFetch || function (a) {
    return a;
  };

  return function (req) {
    if (typeof req === 'string') {
      req = { url: req };
    }
    self.mergeInQueryOrForm(req);
    req = preFetch(req);
    return postFetch(httpFn(req));
  };
}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("lodash/assign");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/get-iterator");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/promise");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/classCallCheck");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/createClass");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends2 = __webpack_require__(4);

var _extends3 = _interopRequireDefault(_extends2);

var _cloneDeep = __webpack_require__(37);

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _assign = __webpack_require__(8);

var _assign2 = _interopRequireDefault(_assign);

var _http = __webpack_require__(6);

var _http2 = _interopRequireDefault(_http);

var _resolver = __webpack_require__(19);

var _resolver2 = _interopRequireDefault(_resolver);

var _url = __webpack_require__(9);

var _url2 = _interopRequireDefault(_url);

var _interfaces = __webpack_require__(18);

var _execute = __webpack_require__(17);

var _helpers = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Swagger.http = _http2.default;
Swagger.makeHttp = _http.makeHttp.bind(null, Swagger.http);
Swagger.resolve = _resolver2.default;
Swagger.execute = _execute.execute;
Swagger.serializeRes = _http.serializeRes;
Swagger.serializeHeaders = _http.serializeHeaders;
Swagger.clearCache = _resolver.clearCache;
Swagger.parameterBuilders = _execute.PARAMETER_BUILDERS; // Add this to the execute call
Swagger.makeApisTagOperation = _interfaces.makeApisTagOperation;
Swagger.buildRequest = _execute.buildRequest;
Swagger.helpers = { opId: _helpers.opId };

function Swagger(url) {
  var _this = this;

  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Allow url as a separate argument
  if (typeof url === 'string') {
    opts.url = url;
  } else {
    opts = url;
  }

  if (!(this instanceof Swagger)) {
    return new Swagger(opts);
  }

  (0, _assign2.default)(this, opts);

  var prom = this.resolve().then(function () {
    if (!_this.disableInterfaces) {
      (0, _assign2.default)(_this, Swagger.makeApisTagOperation(_this));
    }
    return _this;
  });

  // Expose this instance on the promise that gets returned
  prom.client = this;
  return prom;
}

module.exports = Swagger;

Swagger.prototype = {

  http: _http2.default,

  execute: function execute(argHash) {
    this.applyDefaults();

    return Swagger.execute((0, _extends3.default)({
      spec: this.spec,
      http: this.http.bind(this),
      securities: { authorized: this.authorizations }
    }, argHash));
  },
  resolve: function resolve() {
    var _this2 = this;

    return Swagger.resolve({
      spec: this.spec,
      url: this.url,
      allowMetaPatches: this.allowMetaPatches
    }).then(function (obj) {
      _this2.originalSpec = _this2.spec;
      _this2.spec = obj.spec;
      _this2.errors = obj.errors;
      return _this2;
    });
  }
};

Swagger.prototype.applyDefaults = function () {
  var spec = this.spec;
  var specUrl = this.url;
  if (specUrl && specUrl.startsWith('http')) {
    var parsed = _url2.default.parse(specUrl);
    if (!spec.host) {
      spec.host = parsed.host;
    }
    if (!spec.schemes) {
      spec.schemes = [parsed.protocol.replace(':', '')];
    }
    if (!spec.basePath) {
      spec.basePath = '/';
    }
  }
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PARAMETER_BUILDERS = exports.self = undefined;

var _keys = __webpack_require__(0);

var _keys2 = _interopRequireDefault(_keys);

var _stringify = __webpack_require__(7);

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = __webpack_require__(4);

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = __webpack_require__(29);

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.execute = execute;
exports.buildRequest = buildRequest;
exports.bodyBuilder = bodyBuilder;
exports.formDataBuilder = formDataBuilder;
exports.headerBuilder = headerBuilder;
exports.pathBuilder = pathBuilder;
exports.queryBuilder = queryBuilder;
exports.baseUrl = baseUrl;
exports.applySecurities = applySecurities;

var _assign = __webpack_require__(8);

var _assign2 = _interopRequireDefault(_assign);

var _get = __webpack_require__(38);

var _get2 = _interopRequireDefault(_get);

var _isPlainObject = __webpack_require__(41);

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _isArray = __webpack_require__(39);

var _isArray2 = _interopRequireDefault(_isArray);

var _btoa = __webpack_require__(32);

var _btoa2 = _interopRequireDefault(_btoa);

var _url = __webpack_require__(9);

var _url2 = _interopRequireDefault(_url);

var _http = __webpack_require__(6);

var _http2 = _interopRequireDefault(_http);

var _helpers = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var arrayOrEmpty = function arrayOrEmpty(ar) {
  return Array.isArray(ar) ? ar : [];
};

// For stubbing in tests
var self = exports.self = {
  buildRequest: buildRequest
};

// These functions will update the request.
// They'll be given {req, value, paramter, spec, operation}.
var PARAMETER_BUILDERS = exports.PARAMETER_BUILDERS = {
  body: bodyBuilder,
  header: headerBuilder,
  query: queryBuilder,
  path: pathBuilder,
  formData: formDataBuilder
};

// Execute request, with the given operationId and parameters
// pathName/method or operationId is optional
function execute(_ref) {
  var userHttp = _ref.http,
      fetch = _ref.fetch,
      spec = _ref.spec,
      operationId = _ref.operationId,
      pathName = _ref.pathName,
      method = _ref.method,
      parameters = _ref.parameters,
      securities = _ref.securities,
      extras = (0, _objectWithoutProperties3.default)(_ref, ['http', 'fetch', 'spec', 'operationId', 'pathName', 'method', 'parameters', 'securities']);

  // Provide default fetch implementation
  userHttp = userHttp || fetch || _http2.default; // Default to _our_ http

  if (pathName && method && !operationId) {
    operationId = (0, _helpers.legacyIdFromPathMethod)(pathName, method);
  }

  var request = self.buildRequest((0, _extends3.default)({ spec: spec, operationId: operationId, parameters: parameters, securities: securities }, extras));

  if (request.body && ((0, _isPlainObject2.default)(request.body) || (0, _isArray2.default)(request.body))) {
    request.body = (0, _stringify2.default)(request.body);
  }

  // Build request and execute it
  return userHttp(request);
}

// Build a request, which can be handled by the `http.js` implementation.
function buildRequest(_ref2) {
  var spec = _ref2.spec,
      operationId = _ref2.operationId,
      parameters = _ref2.parameters,
      securities = _ref2.securities,
      requestContentType = _ref2.requestContentType,
      responseContentType = _ref2.responseContentType,
      parameterBuilders = _ref2.parameterBuilders,
      scheme = _ref2.scheme,
      requestInterceptor = _ref2.requestInterceptor,
      responseInterceptor = _ref2.responseInterceptor,
      contextUrl = _ref2.contextUrl;

  parameterBuilders = parameterBuilders || PARAMETER_BUILDERS;

  // Base Template
  var req = {
    url: baseUrl({ spec: spec, scheme: scheme, contextUrl: contextUrl }),
    credentials: 'same-origin',
    headers: {
      // This breaks CORSs... removing this line... probably breaks oAuth. Need to address that
      // This also breaks tests
      // 'access-control-allow-origin': '*'
    }
  };

  if (requestInterceptor) {
    req.requestInterceptor = requestInterceptor;
  }
  if (responseInterceptor) {
    req.responseInterceptor = responseInterceptor;
  }

  // Mostly for testing
  if (!operationId) {
    return req;
  }

  var _getOperationRaw = (0, _helpers.getOperationRaw)(spec, operationId),
      _getOperationRaw$oper = _getOperationRaw.operation,
      operation = _getOperationRaw$oper === undefined ? {} : _getOperationRaw$oper,
      method = _getOperationRaw.method,
      pathName = _getOperationRaw.pathName;

  req.url += pathName; // Have not yet replaced the path parameters
  req.method = ('' + method).toUpperCase();

  parameters = parameters || {};

  if (responseContentType) {
    req.headers.accept = responseContentType;
  }

  // Add values to request
  arrayOrEmpty(operation.parameters) // operation parameters
  .concat(arrayOrEmpty(spec.paths[pathName].parameters)) // path parameters
  .forEach(function (parameter) {
    var builder = parameterBuilders[parameter.in];
    var value = void 0;

    if (parameter.in === 'body' && parameter.schema && parameter.schema.properties) {
      value = parameters;
    }

    value = parameter && parameter.name && parameters[parameter.name];

    if (typeof parameter.default !== 'undefined' && typeof value === 'undefined') {
      value = parameter.default;
    }

    if (typeof value === 'undefined' && parameter.required && !parameter.allowEmptyValue) {
      throw new Error('Required parameter ' + parameter.name + ' is not provided');
    }

    if (builder) {
      builder({ req: req, parameter: parameter, value: value, operation: operation, spec: spec });
    }
  });

  // Add securities, which are applicable
  req = applySecurities({ request: req, securities: securities, operation: operation, spec: spec });

  if (req.body || req.form) {
    if (requestContentType) {
      req.headers['content-type'] = requestContentType;
    } else if (Array.isArray(operation.consumes)) {
      req.headers['content-type'] = operation.consumes[0];
    } else if (Array.isArray(spec.consumes)) {
      req.headers['content-type'] = spec.consumes[0];
    } else if (operation.parameters.filter(function (p) {
      return p.type === "file";
    }).length) {
      req.headers['content-type'] = "multipart/form-data";
    } else if (operation.parameters.filter(function (p) {
      return p.in === "formData";
    }).length) {
      req.headers['content-type'] = "application/x-www-form-urlencoded";
    }
  }

  // Will add the query object into the URL, if it exists
  // ... will also create a FormData instance, if multipart/form-data (eg: a file)
  (0, _http.mergeInQueryOrForm)(req);

  return req;
}

// Add the body to the request
function bodyBuilder(_ref3) {
  var req = _ref3.req,
      value = _ref3.value;

  req.body = value;
}

// Add a form data object.
function formDataBuilder(_ref4) {
  var req = _ref4.req,
      value = _ref4.value,
      parameter = _ref4.parameter;

  req.form = req.form || {};
  if (value || parameter.allowEmptyValue) {
    req.form[parameter.name] = {
      value: value,
      allowEmptyValue: parameter.allowEmptyValue,
      collectionFormat: parameter.collectionFormat
    };
  }
}

// Add a header to the request
function headerBuilder(_ref5) {
  var req = _ref5.req,
      parameter = _ref5.parameter,
      value = _ref5.value;

  req.headers = req.headers || {};
  if (typeof value !== 'undefined') {
    req.headers[parameter.name] = value;
  }
}

// Replace path paramters, with values ( ie: the URL )
function pathBuilder(_ref6) {
  var req = _ref6.req,
      value = _ref6.value,
      parameter = _ref6.parameter;

  req.url = req.url.replace('{' + parameter.name + '}', encodeURIComponent(value));
}

// Add a query to the `query` object, which will later be stringified into the URL's search
function queryBuilder(_ref7) {
  var req = _ref7.req,
      value = _ref7.value,
      parameter = _ref7.parameter;

  req.query = req.query || {};
  if (value) {
    req.query[parameter.name] = {
      collectionFormat: parameter.collectionFormat,
      value: value
    };
  } else if (parameter.allowEmptyValue) {
    var paramName = parameter.name;
    req.query[paramName] = req.query[paramName] || {};
    req.query[paramName].allowEmptyValue = true;
  }
}

var stripNonAlpha = function stripNonAlpha(str) {
  return str ? str.replace(/\W/g, '') : null;
};

// Compose the baseUrl ( scheme + host + basePath )
function baseUrl(_ref8) {
  var spec = _ref8.spec,
      scheme = _ref8.scheme,
      _ref8$contextUrl = _ref8.contextUrl,
      contextUrl = _ref8$contextUrl === undefined ? '' : _ref8$contextUrl;

  var parsedContextUrl = _url2.default.parse(contextUrl);
  var firstSchemeInSpec = Array.isArray(spec.schemes) ? spec.schemes[0] : null;

  var computedScheme = scheme || firstSchemeInSpec || stripNonAlpha(parsedContextUrl.protocol) || 'http';
  var computedHost = spec.host || parsedContextUrl.host || '';
  var computedPath = spec.basePath || '';

  if (computedScheme && computedHost) {
    var res = computedScheme + '://' + (computedHost + computedPath);

    // If last character is '/', trim it off
    return res[res.length - 1] === '/' ? res.slice(0, -1) : res;
  }

  return '';
}

// Add security values, to operations - that declare their need on them
function applySecurities(_ref9) {
  var request = _ref9.request,
      _ref9$securities = _ref9.securities,
      securities = _ref9$securities === undefined ? {} : _ref9$securities,
      _ref9$operation = _ref9.operation,
      operation = _ref9$operation === undefined ? {} : _ref9$operation,
      spec = _ref9.spec;

  var result = (0, _assign2.default)({}, request);
  var _securities$authorize = securities.authorized,
      authorized = _securities$authorize === undefined ? {} : _securities$authorize,
      _securities$specSecur = securities.specSecurity,
      specSecurity = _securities$specSecur === undefined ? {} : _securities$specSecur;

  var security = operation.security || specSecurity;
  var isAuthorized = authorized && !!(0, _keys2.default)(authorized).length;
  var securityDef = spec.securityDefinitions;

  result.headers = result.headers || {};
  result.query = result.query || {};

  if (!(0, _keys2.default)(securities).length || !isAuthorized || !security || Array.isArray(operation.security) && !operation.security.length) {
    return request;
  }

  security.forEach(function (securityObj, index) {
    for (var key in securityObj) {
      var auth = authorized[key];
      if (!auth) {
        continue;
      }

      var token = auth.token;
      var value = auth.value || auth;
      var schema = securityDef[key];
      var type = schema.type;

      var accessToken = token && token.access_token;
      var tokenType = token && token.token_type;

      if (auth) {
        if (type === 'apiKey') {
          var inType = schema.in === 'query' ? 'query' : 'headers';
          result[inType] = result[inType] || {};
          result[inType][schema.name] = value;
        } else if (type === 'basic') {
          if (value.header) {
            result.headers.authorization = value.header;
          } else {
            value.base64 = (0, _btoa2.default)(value.username + ':' + value.password);
            result.headers.authorization = 'Basic ' + value.base64;
          }
        } else if (type === 'oauth2') {
          result.headers.authorization = (tokenType || 'Bearer') + ' ' + accessToken;
        }
      }
    }
  });

  return result;
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.self = undefined;

var _extends2 = __webpack_require__(4);

var _extends3 = _interopRequireDefault(_extends2);

exports.makeExecute = makeExecute;
exports.makeApisTagOperationsOperationExecute = makeApisTagOperationsOperationExecute;
exports.makeApisTagOperation = makeApisTagOperation;
exports.mapTagOperations = mapTagOperations;

var _pick = __webpack_require__(43);

var _pick2 = _interopRequireDefault(_pick);

var _helpers = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nullFn = function nullFn() {
  return null;
};

var normalizeArray = function normalizeArray(arg) {
  return Array.isArray(arg) ? arg : [arg];
};

// To allow stubbing of functions
var self = exports.self = {
  mapTagOperations: mapTagOperations,
  makeExecute: makeExecute
};

// Make an execute, bound to arguments defined in mapTagOperation's callback (cb)
function makeExecute() {
  var swaggerJs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (_ref) {
    var pathName = _ref.pathName,
        method = _ref.method,
        operationId = _ref.operationId;
    return function (parameters) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return swaggerJs.execute((0, _extends3.default)({
        spec: swaggerJs.spec
      }, (0, _pick2.default)(swaggerJs, 'requestInterceptor', 'responseInterceptor'), {
        pathName: pathName,
        method: method,
        parameters: parameters,
        operationId: operationId
      }, opts));
    };
  };
}

// Creates an interface with tags+operations = execute
// The shape
// { apis: { [tag]: { operations: [operation]: { execute }}}}
// NOTE: this is mostly for compatibility
function makeApisTagOperationsOperationExecute() {
  var swaggerJs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // { apis: tag: operations: execute }
  var cb = self.makeExecute(swaggerJs);
  var tagOperations = self.mapTagOperations({ spec: swaggerJs.spec, cb: cb });

  var apis = {};
  for (var tag in tagOperations) {
    apis[tag] = {
      operations: {}
    };
    for (var op in tagOperations[tag]) {
      apis[tag].operations[op] = { execute: tagOperations[tag][op] };
    }
  }

  return { apis: apis };
}

// .apis[tag][operationId]:ExecuteFunction interface
function makeApisTagOperation() {
  var swaggerJs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var cb = self.makeExecute(swaggerJs);
  return {
    apis: self.mapTagOperations({ spec: swaggerJs.spec, cb: cb })
  };
}

/**
 * Iterates over a spec, creating a hash of {[tag]: { [operationId], ... }, ...}
 * with the value of calling `cb`.
 *
 * `spec` is a OAI v2.0 compliant specification object
 * `cb` is called with ({ spec, operation, path, method })
 * `defaultTag` will house all non-tagged operations
 *
 */
function mapTagOperations(_ref2) {
  var spec = _ref2.spec,
      _ref2$cb = _ref2.cb,
      cb = _ref2$cb === undefined ? nullFn : _ref2$cb,
      _ref2$defaultTag = _ref2.defaultTag,
      defaultTag = _ref2$defaultTag === undefined ? 'default' : _ref2$defaultTag;

  var operationIdCounter = {};
  var tagOperations = {}; // Will house all tags + operations
  (0, _helpers.eachOperation)(spec, function (_ref3) {
    var pathName = _ref3.pathName,
        method = _ref3.method,
        operation = _ref3.operation;

    var tags = operation.tags ? normalizeArray(operation.tags) : [defaultTag];

    tags.forEach(function (tag) {
      if (typeof tag !== 'string') {
        return;
      }
      var tagObj = tagOperations[tag] = tagOperations[tag] || {};
      var id = (0, _helpers.opId)(operation, pathName, method);
      var cbResult = cb({ spec: spec, pathName: pathName, method: method, operation: operation, operationId: id });

      if (operationIdCounter[id]) {
        operationIdCounter[id] = operationIdCounter[id] + 1;
        tagObj['' + id + operationIdCounter[id]] = cbResult;
      } else if (typeof tagObj[id] !== 'undefined') {
        // Bump counter ( for this operationId )
        var originalCounterValue = operationIdCounter[id] || 1;
        operationIdCounter[id] = originalCounterValue + 1;
        // Append _x to the operationId
        tagObj['' + id + operationIdCounter[id]] = cbResult;

        // Rename the first operationId
        var temp = tagObj[id];
        delete tagObj[id];
        tagObj['' + id + originalCounterValue] = temp;
      } else {
        // Assign callback result ( usually a bound function )
        tagObj[id] = cbResult;
      }
    });
  });

  return tagOperations;
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeFetchJSON = makeFetchJSON;
exports.clearCache = clearCache;
exports.default = resolve;

var _http = __webpack_require__(6);

var _http2 = _interopRequireDefault(_http);

var _specmap = __webpack_require__(20);

var _specmap2 = _interopRequireDefault(_specmap);

var _helpers = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeFetchJSON(http) {
  return function (docPath) {
    return http({
      url: docPath,
      loadSpec: true,
      headers: {
        Accept: 'application/json'
      }
    }).then(function (res) {
      return res.body;
    });
  };
}

// Wipe out the http cache
function clearCache() {
  _specmap.plugins.refs.clearCache();
}

function resolve(_ref) {
  var http = _ref.http,
      fetch = _ref.fetch,
      spec = _ref.spec,
      url = _ref.url,
      baseDoc = _ref.baseDoc,
      mode = _ref.mode,
      _ref$allowMetaPatches = _ref.allowMetaPatches,
      allowMetaPatches = _ref$allowMetaPatches === undefined ? true : _ref$allowMetaPatches,
      modelPropertyMacro = _ref.modelPropertyMacro,
      parameterMacro = _ref.parameterMacro;

  // @TODO Swagger-UI uses baseDoc instead of url, this is to allow both
  // need to fix and pick one.
  baseDoc = baseDoc || url;

  // Provide a default fetch implementation
  // TODO fetch should be removed, and http used instead
  http = fetch || http || _http2.default;

  if (!spec) {
    return makeFetchJSON(http)(baseDoc).then(doResolve);
  }

  return doResolve(spec);

  function doResolve(_spec) {
    if (baseDoc) {
      _specmap.plugins.refs.docCache[baseDoc] = _spec;
    }

    // Build a json-fetcher ( ie: give it a URL and get json out )
    _specmap.plugins.refs.fetchJSON = makeFetchJSON(http);

    var plugs = [_specmap.plugins.refs];

    if (typeof parameterMacro === 'function') {
      plugs.push(_specmap.plugins.parameters);
    }

    if (typeof modelPropertyMacro === 'function') {
      plugs.push(_specmap.plugins.properties);
    }

    if (mode !== 'strict') {
      plugs.push(_specmap.plugins.allOf);
    }

    // mapSpec is where the hard work happens, see https://github.com/swagger-api/specmap for more details
    return (0, _specmap2.default)({
      spec: _spec,
      context: { baseDoc: baseDoc },
      plugins: plugs,
      allowMetaPatches: allowMetaPatches, // allows adding .meta patches, which include adding `$$ref`s to the spec
      parameterMacro: parameterMacro,
      modelPropertyMacro: modelPropertyMacro
    }).then(_helpers.normalizeSwagger);
  }
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugins = exports.SpecMap = undefined;

var _stringify = __webpack_require__(7);

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = __webpack_require__(11);

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = __webpack_require__(14);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = __webpack_require__(0);

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = __webpack_require__(10);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _create = __webpack_require__(27);

var _create2 = _interopRequireDefault(_create);

var _assign = __webpack_require__(1);

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = __webpack_require__(12);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(13);

var _createClass3 = _interopRequireDefault(_createClass2);

exports.default = mapSpec;

var _lib = __webpack_require__(3);

var _lib2 = _interopRequireDefault(_lib);

var _refs = __webpack_require__(26);

var _refs2 = _interopRequireDefault(_refs);

var _allOf = __webpack_require__(21);

var _allOf2 = _interopRequireDefault(_allOf);

var _parameters = __webpack_require__(24);

var _parameters2 = _interopRequireDefault(_parameters);

var _properties = __webpack_require__(25);

var _properties2 = _interopRequireDefault(_properties);

var _contextTree = __webpack_require__(22);

var _contextTree2 = _interopRequireDefault(_contextTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HARD_LIMIT = 100;

var SpecMap = function () {
  function SpecMap(opts) {
    (0, _classCallCheck3.default)(this, SpecMap);

    (0, _assign2.default)(this, {
      spec: '',
      debugLevel: 'info',
      plugins: [],
      pluginHistory: {},
      errors: [],
      mutations: [],
      promisedPatches: [],
      state: {},
      patches: [],
      context: {},
      contextTree: new _contextTree2.default(),
      showDebug: false,
      allPatches: [], // only populated if showDebug is true
      pluginProp: 'specMap',
      libMethods: (0, _assign2.default)((0, _create2.default)(this), _lib2.default),
      allowMetaPatches: false
    }, opts);

    // Lib methods bound
    this.get = this._get.bind(this);
    this.getContext = this._getContext.bind(this);
    this.hasRun = this._hasRun.bind(this);

    this.wrappedPlugins = this.plugins.map(this.wrapPlugin.bind(this)).filter(_lib2.default.isFunction);

    // Initial patch(s)
    this.patches.push(_lib2.default.add([], this.spec));
    this.patches.push(_lib2.default.context([], this.context));
    this.updatePatches(this.patches);
  }

  (0, _createClass3.default)(SpecMap, [{
    key: 'debug',
    value: function debug(level) {
      if (this.debugLevel === level) {
        var _console;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        (_console = console).log.apply(_console, args); // eslint-disable-line no-console
      }
    }
  }, {
    key: 'verbose',
    value: function verbose(header) {
      if (this.debugLevel === 'verbose') {
        var _console2;

        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        (_console2 = console).log.apply(_console2, ['[' + header + ']   '].concat(args)); // eslint-disable-line no-console
      }
    }
  }, {
    key: 'wrapPlugin',
    value: function wrapPlugin(plugin, name) {
      var ctx = null;
      var fn = void 0;

      if (plugin[this.pluginProp]) {
        ctx = plugin;
        fn = plugin[this.pluginProp];
      } else if (_lib2.default.isFunction(plugin)) {
        fn = plugin;
      } else if (_lib2.default.isObject(plugin)) {
        fn = createKeyBasedPlugin(plugin);
      }

      return (0, _assign2.default)(fn.bind(ctx), {
        pluginName: plugin.name || name,
        isGenerator: _lib2.default.isGenerator(fn)
      });

      // Expected plugin interface: {key: string, plugin: fn*}
      // This traverses depth-first and immediately applies yielded patches.
      // This strategy should work well for most plugins (including the built-ins).
      // We might consider making this (traversing & application) configurable later.
      function createKeyBasedPlugin(pluginObj) {
        return _regenerator2.default.mark(function _callee(patches, specmap) {
          var _marked, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, patch, traverse;

          return _regenerator2.default.wrap(function _callee$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  traverse = function traverse(obj, path, patch) {
                    var parent, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, key, val, updatedPath;

                    return _regenerator2.default.wrap(function traverse$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (_lib2.default.isObject(obj)) {
                              _context.next = 6;
                              break;
                            }

                            if (!(pluginObj.key === path[path.length - 1])) {
                              _context.next = 4;
                              break;
                            }

                            _context.next = 4;
                            return pluginObj.plugin(obj, pluginObj.key, path, specmap);

                          case 4:
                            _context.next = 38;
                            break;

                          case 6:
                            parent = path[path.length - 1];
                            _iteratorNormalCompletion2 = true;
                            _didIteratorError2 = false;
                            _iteratorError2 = undefined;
                            _context.prev = 10;
                            _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(obj));

                          case 12:
                            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                              _context.next = 24;
                              break;
                            }

                            key = _step2.value;
                            val = obj[key];
                            updatedPath = path.concat(key);

                            if (!_lib2.default.isObject(val)) {
                              _context.next = 18;
                              break;
                            }

                            return _context.delegateYield(traverse(val, updatedPath, patch), 't0', 18);

                          case 18:
                            if (!(parent !== 'properties' && key === pluginObj.key)) {
                              _context.next = 21;
                              break;
                            }

                            _context.next = 21;
                            return pluginObj.plugin(val, key, updatedPath, specmap, patch);

                          case 21:
                            _iteratorNormalCompletion2 = true;
                            _context.next = 12;
                            break;

                          case 24:
                            _context.next = 30;
                            break;

                          case 26:
                            _context.prev = 26;
                            _context.t1 = _context['catch'](10);
                            _didIteratorError2 = true;
                            _iteratorError2 = _context.t1;

                          case 30:
                            _context.prev = 30;
                            _context.prev = 31;

                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                              _iterator2.return();
                            }

                          case 33:
                            _context.prev = 33;

                            if (!_didIteratorError2) {
                              _context.next = 36;
                              break;
                            }

                            throw _iteratorError2;

                          case 36:
                            return _context.finish(33);

                          case 37:
                            return _context.finish(30);

                          case 38:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _marked[0], this, [[10, 26, 30, 38], [31,, 33, 37]]);
                  };

                  _marked = [traverse].map(_regenerator2.default.mark);
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context2.prev = 5;
                  _iterator = (0, _getIterator3.default)(patches.filter(_lib2.default.isAdditiveMutation));

                case 7:
                  if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _context2.next = 13;
                    break;
                  }

                  patch = _step.value;
                  return _context2.delegateYield(traverse(patch.value, patch.path, patch), 't0', 10);

                case 10:
                  _iteratorNormalCompletion = true;
                  _context2.next = 7;
                  break;

                case 13:
                  _context2.next = 19;
                  break;

                case 15:
                  _context2.prev = 15;
                  _context2.t1 = _context2['catch'](5);
                  _didIteratorError = true;
                  _iteratorError = _context2.t1;

                case 19:
                  _context2.prev = 19;
                  _context2.prev = 20;

                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }

                case 22:
                  _context2.prev = 22;

                  if (!_didIteratorError) {
                    _context2.next = 25;
                    break;
                  }

                  throw _iteratorError;

                case 25:
                  return _context2.finish(22);

                case 26:
                  return _context2.finish(19);

                case 27:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee, this, [[5, 15, 19, 27], [20,, 22, 26]]);
        });
      }
    }
  }, {
    key: 'nextPlugin',
    value: function nextPlugin() {
      var _this = this;

      return this.wrappedPlugins.find(function (plugin) {
        var mutations = _this.getMutationsForPlugin(plugin);
        return mutations.length > 0;
      });
    }
  }, {
    key: 'nextPromisedPatch',
    value: function nextPromisedPatch() {
      if (this.promisedPatches.length > 0) {
        return _promise2.default.race(this.promisedPatches.map(function (patch) {
          return patch.value;
        }));
      }
    }
  }, {
    key: 'getPluginHistory',
    value: function getPluginHistory(plugin) {
      var name = this.getPluginName(plugin);
      return this.pluginHistory[name] || [];
    }
  }, {
    key: 'getPluginRunCount',
    value: function getPluginRunCount(plugin) {
      return this.getPluginHistory(plugin).length;
    }
  }, {
    key: 'getPluginHistoryTip',
    value: function getPluginHistoryTip(plugin) {
      var history = this.getPluginHistory(plugin);
      var val = history && history[history.length - 1];
      return val || {};
    }
  }, {
    key: 'getPluginMutationIndex',
    value: function getPluginMutationIndex(plugin) {
      var mi = this.getPluginHistoryTip(plugin).mutationIndex;
      return typeof mi !== 'number' ? -1 : mi;
    }
  }, {
    key: 'getPluginName',
    value: function getPluginName(plugin) {
      return plugin.pluginName;
    }
  }, {
    key: 'updatePluginHistory',
    value: function updatePluginHistory(plugin, val) {
      var name = this.getPluginName(plugin);
      var history = this.pluginHistory[name] = this.pluginHistory[name] || [];
      history.push(val);
    }
  }, {
    key: 'updatePatches',
    value: function updatePatches(patches, plugin) {
      var _this2 = this;

      _lib2.default.normalizeArray(patches).forEach(function (patch) {
        if (patch instanceof Error) {
          _this2.errors.push(patch);
          return;
        }

        try {
          if (!_lib2.default.isObject(patch)) {
            _this2.debug('updatePatches', 'Got a non-object patch', patch);
            return;
          }

          if (_this2.showDebug) {
            _this2.allPatches.push(patch);
          }

          if (_lib2.default.isPromise(patch.value)) {
            _this2.promisedPatches.push(patch);
            _this2.promisedPatchThen(patch);
            return;
          }

          if (_lib2.default.isContextPatch(patch)) {
            _this2.setContext(patch.path, patch.value);
            return;
          }

          if (_lib2.default.isMutation(patch)) {
            _this2.updateMutations(patch);
            return;
          }
        } catch (e) {
          _this2.errors.push(e);
        }
      });
    }
  }, {
    key: 'updateMutations',
    value: function updateMutations(patch) {
      if (_lib2.default.applyPatch(this.state, patch, { allowMetaPatches: this.allowMetaPatches })) {
        this.mutations.push(patch);
      }
    }
  }, {
    key: 'removePromisedPatch',
    value: function removePromisedPatch(patch) {
      var index = this.promisedPatches.indexOf(patch);
      if (index < 0) {
        this.debug('Tried to remove a promisedPatch that isn\'t there!');
        return;
      }
      this.promisedPatches.splice(index, 1);
    }
  }, {
    key: 'promisedPatchThen',
    value: function promisedPatchThen(patch) {
      var _this3 = this;

      var value = patch.value = patch.value.then(function (val) {
        var promisedPatch = (0, _assign2.default)({}, patch, { value: val });
        _this3.removePromisedPatch(patch);
        _this3.updatePatches(promisedPatch);
      }).catch(function (e) {
        _this3.removePromisedPatch(patch);
        _this3.updatePatches(e);
      });
      return value;
    }
  }, {
    key: 'getMutations',
    value: function getMutations(from, to) {
      from = from || 0;
      if (typeof to !== 'number') {
        to = this.mutations.length;
      }
      return this.mutations.slice(from, to);
    }
  }, {
    key: 'getCurrentMutations',
    value: function getCurrentMutations() {
      return this.getMutationsForPlugin(this.getCurrentPlugin());
    }
  }, {
    key: 'getMutationsForPlugin',
    value: function getMutationsForPlugin(plugin) {
      var tip = this.getPluginMutationIndex(plugin);
      return this.getMutations(tip + 1);
    }
  }, {
    key: 'getCurrentPlugin',
    value: function getCurrentPlugin() {
      return this.currentPlugin;
    }
  }, {
    key: 'getPatchesOfType',
    value: function getPatchesOfType(patches, fn) {
      return patches.filter(fn);
    }
  }, {
    key: 'getLib',
    value: function getLib() {
      return this.libMethods;
    }
  }, {
    key: '_get',
    value: function _get(path) {
      return _lib2.default.getIn(this.state, path);
    }
  }, {
    key: '_getContext',
    value: function _getContext(path) {
      return this.contextTree.get(path);
    }
  }, {
    key: 'setContext',
    value: function setContext(path, value) {
      return this.contextTree.set(path, value);
    }
  }, {
    key: '_hasRun',
    value: function _hasRun(count) {
      var times = this.getPluginRunCount(this.getCurrentPlugin());
      return times > (count || 0);
    }
  }, {
    key: '_clone',
    value: function _clone(obj) {
      // For debugging only
      return JSON.parse((0, _stringify2.default)(obj));
    }
  }, {
    key: 'dispatch',
    value: function dispatch() {
      var _this4 = this;

      var that = this;
      var plugin = this.nextPlugin();

      if (!plugin) {
        var nextPromise = this.nextPromisedPatch();
        if (nextPromise) {
          return nextPromise.then(function () {
            return _this4.dispatch();
          }).catch(function () {
            return _this4.dispatch();
          });
        }

        // We're done!
        var result = { spec: this.state, errors: this.errors };
        if (this.showDebug) {
          result.patches = this.allPatches;
        }
        return _promise2.default.resolve(result);
      }

      // Makes sure plugin isn't running an endless loop
      that.pluginCount = that.pluginCount || {};
      that.pluginCount[plugin] = (that.pluginCount[plugin] || 0) + 1;
      if (that.pluginCount[plugin] > HARD_LIMIT) {
        return _promise2.default.resolve({
          spec: that.state,
          errors: that.errors.concat(new Error('We\'ve reached a hard limit of ' + HARD_LIMIT + ' plugin runs'))
        });
      }

      // A different plugin runs, wait for all promises to resolve, then retry
      if (plugin !== this.currentPlugin && this.promisedPatches.length) {
        var promises = this.promisedPatches.map(function (p) {
          return p.value;
        });

        // Waits for all to settle instead of Promise.all which stops on rejection
        return _promise2.default.all(promises.map(function (promise) {
          return promise.then(Function, Function);
        })).then(function () {
          return _this4.dispatch();
        });
      }

      // Ok, run the plugin
      return executePlugin();

      function executePlugin() {
        that.currentPlugin = plugin;
        var mutations = that.getCurrentMutations();
        var lastMutationIndex = that.mutations.length - 1;

        try {
          if (plugin.isGenerator) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = (0, _getIterator3.default)(plugin(mutations, that.getLib())), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var yieldedPatches = _step3.value;

                updatePatches(yieldedPatches);
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          } else {
            var newPatches = plugin(mutations, that.getLib());
            updatePatches(newPatches);
          }
        } catch (e) {
          updatePatches([(0, _assign2.default)((0, _create2.default)(e), { plugin: plugin })]);
        } finally {
          that.updatePluginHistory(plugin, { mutationIndex: lastMutationIndex });
        }

        return that.dispatch();
      }

      function updatePatches(patches) {
        if (patches) {
          patches = _lib2.default.fullyNormalizeArray(patches);
          that.updatePatches(patches, plugin);
        }
      }
    }
  }]);
  return SpecMap;
}();

function mapSpec(opts) {
  return new SpecMap(opts).dispatch();
}

var plugins = { refs: _refs2.default, allOf: _allOf2.default, parameters: _parameters2.default, properties: _properties2.default };
exports.SpecMap = SpecMap;
exports.plugins = plugins;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  key: 'allOf',
  plugin: function plugin(val, key, fullPath, specmap, patch) {
    // Ignore replace patches created by $ref because the changes will
    // occur in the original "add" patch and we don't want this plugin
    // to redundantly processes those "relace" patches.
    if (patch.meta && patch.meta.$$ref) {
      return;
    }

    if (!Array.isArray(val)) {
      var err = new TypeError('allOf must be an array');
      err.fullPath = fullPath; // This is an array
      return err;
    }

    var parent = fullPath.slice(0, -1);
    var alreadyAddError = false;

    return [specmap.replace(parent, {})].concat(val.map(function (toMerge, index) {
      if (!specmap.isObject(toMerge)) {
        if (alreadyAddError) {
          return null;
        }
        alreadyAddError = true;

        var _err = new TypeError('Elements in allOf must be objects');
        _err.fullPath = fullPath; // This is an array
        return _err;
      }

      return specmap.mergeDeep(parent, toMerge);
    }));
  }
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = __webpack_require__(0);

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = __webpack_require__(4);

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__(12);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(13);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContextTree = function () {
  function ContextTree(value) {
    (0, _classCallCheck3.default)(this, ContextTree);

    this.root = createNode(value || {});
  }

  (0, _createClass3.default)(ContextTree, [{
    key: "set",
    value: function set(path, value) {
      var parent = this.getParent(path, true);
      if (!parent) {
        updateNode(this.root, value, null);
        return;
      }

      var key = path[path.length - 1];
      var children = parent.children;
      if (children[key]) {
        updateNode(children[key], value, parent);
        return;
      }

      children[key] = createNode(value, parent);
    }

    // Get the "best" node (node or nearest parent) and return its value.

  }, {
    key: "get",
    value: function get(path) {
      path = path || [];

      if (path.length < 1) {
        return this.root.value;
      }

      var branch = this.root;
      var child = void 0;
      var token = void 0;
      for (var i = 0; i < path.length; i++) {
        token = path[i];
        child = branch.children;
        if (!child[token]) {
          break;
        }
        branch = child[token];
      }

      return branch && branch.protoValue;
    }
  }, {
    key: "getParent",
    value: function getParent(path, ensureExists) {
      if (!path || path.length < 1) {
        return null;
      }

      if (path.length < 2) {
        return this.root;
      }

      return path.slice(0, -1).reduce(function (branch, token) {
        if (!branch) {
          return branch;
        }

        var children = branch.children;

        if (!children[token] && ensureExists) {
          children[token] = createNode(null, branch);
        }

        return children[token];
      }, this.root);
    }
  }]);
  return ContextTree;
}();

// =========================
// Utilities
// =========================

exports.default = ContextTree;
function createNode(value, parent) {
  return updateNode({ children: {} }, value, parent);
}

function updateNode(node, value, parent) {
  node.value = value || {};
  node.protoValue = parent ? (0, _extends3.default)({}, parent.protoValue, node.value) : node.value;

  (0, _keys2.default)(node.children).forEach(function (prop) {
    var child = node.children[prop];
    node.children[prop] = updateNode(child, child.value, node);
  });

  return node;
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createErrorType;
function createErrorType(name, init) {
  function E() {
    if (!Error.captureStackTrace) {
      this.stack = new Error().stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.message = args[0];
    init && init.apply(this, args);
  }

  E.prototype = new Error();
  E.prototype.name = name;
  E.prototype.constructor = E;

  return E;
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = __webpack_require__(1);

var _assign2 = _interopRequireDefault(_assign);

var _lib = __webpack_require__(3);

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  key: 'parameters',
  plugin: function plugin(parameters, key, fullPath, specmap, patch) {
    if (Array.isArray(parameters) && parameters.length) {
      var val = (0, _assign2.default)([], parameters);
      var opPath = fullPath.slice(0, -1);
      var op = (0, _assign2.default)({}, _lib2.default.getIn(specmap.spec, opPath));

      parameters.forEach(function (param, i) {
        try {
          val[i].default = specmap.parameterMacro(op, param);
        } catch (e) {
          var err = new Error(e);
          err.fullPath = fullPath;
          return err;
        }
      });

      var _patch = _lib2.default.replace(fullPath, val);

      return _patch;
    }

    return _lib2.default.replace(fullPath, parameters);
  }
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = __webpack_require__(1);

var _assign2 = _interopRequireDefault(_assign);

var _lib = __webpack_require__(3);

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  key: 'properties',
  plugin: function plugin(properties, key, fullPath, specmap) {
    var val = (0, _assign2.default)({}, properties);

    for (var k in properties) {
      try {
        val[k].default = specmap.modelPropertyMacro(val[k]);
      } catch (e) {
        var err = new Error(e);
        err.fullPath = fullPath; // This is an array
        return err;
      }
    }

    var patch = _lib2.default.replace(fullPath, val);

    return patch;
  }
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = __webpack_require__(5);

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = __webpack_require__(0);

var _keys2 = _interopRequireDefault(_keys);

var _promise = __webpack_require__(11);

var _promise2 = _interopRequireDefault(_promise);

var _weakMap = __webpack_require__(28);

var _weakMap2 = _interopRequireDefault(_weakMap);

var _assign = __webpack_require__(1);

var _assign2 = _interopRequireDefault(_assign);

var _isomorphicFetch = __webpack_require__(15);

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _url = __webpack_require__(9);

var _url2 = _interopRequireDefault(_url);

var _lib = __webpack_require__(3);

var _lib2 = _interopRequireDefault(_lib);

var _createError = __webpack_require__(23);

var _createError2 = _interopRequireDefault(_createError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ABSOLUTE_URL_REGEXP = new RegExp('^([a-z]+://|//)', 'i');

var JSONRefError = (0, _createError2.default)('JSONRefError', function (message, extra, oriError) {
  this.originalError = oriError;
  (0, _assign2.default)(this, extra || {});
});

var docCache = {};
var specmapRefs = new _weakMap2.default();

// =========================
// Core
// =========================

/**
 * This plugin resolves the JSON pointers.
 * A major part of this plugin deals with cyclic references via 2 mechanisms.
 * 1. If a pointer was already resolved before in this path, halt.
 * 2. If the patch value points to one of the ancestors in this path, halt.
 *
 * Note that either one of these mechanism is sufficient, both must be in place.
 * For examples:
 *
 * Given the following spec, #1 alone is insufficient because after the 2nd
 * application, there will be a cyclic object reference.
 *   a.b.c: $ref-d
 *   d.e.f: $ref-a (per #1, safe to return patch as no immediate cycle)
 *
 * Given the following spec, #2 alone is insufficient because although there will
 * never be any cyclic object reference, the plugin will keep producing patches.
 *   a: $ref-b
 *   b: $ref-a
 */
var plugin = {
  key: '$ref',
  plugin: function plugin(ref, key, fullPath, specmap) {
    var parent = fullPath.slice(0, -1);
    var baseDoc = specmap.getContext(fullPath).baseDoc;

    if (typeof ref !== 'string') {
      return new JSONRefError('$ref: must be a string (JSON-Ref)', {
        $ref: ref,
        baseDoc: baseDoc,
        fullPath: fullPath
      });
    }

    var splitString = split(ref);
    var refPath = splitString[0];
    var pointer = splitString[1] || '';

    var basePath = void 0;
    try {
      basePath = baseDoc || refPath ? absoluteify(refPath, baseDoc) : null;
    } catch (e) {
      return wrapError(e, {
        pointer: pointer,
        $ref: ref,
        basePath: basePath,
        fullPath: fullPath
      });
    }

    var promOrVal = void 0;
    var tokens = void 0;

    if (pointerAlreadyInPath(pointer, basePath, parent, specmap)) {
      return; // TODO: add some meta data, to indicate its cyclic!
    }

    if (basePath == null) {
      tokens = jsonPointerToArray(pointer);
      promOrVal = specmap.get(tokens);

      if (typeof promOrVal === 'undefined') {
        promOrVal = new JSONRefError('Could not resolve reference: ' + ref, {
          pointer: pointer,
          $ref: ref,
          baseDoc: baseDoc,
          fullPath: fullPath
        });
      }
    } else {
      promOrVal = extractFromDoc(basePath, pointer);
      if (promOrVal.__value != null) {
        promOrVal = promOrVal.__value;
      } else {
        promOrVal = promOrVal.catch(function (e) {
          throw wrapError(e, {
            pointer: pointer,
            $ref: ref,
            baseDoc: baseDoc,
            fullPath: fullPath
          });
        });
      }
    }

    if (promOrVal instanceof Error) {
      return [_lib2.default.remove(fullPath), promOrVal];
    }

    var patch = _lib2.default.replace(parent, promOrVal, { $$ref: ref });
    if (basePath && basePath !== baseDoc) {
      return [patch, _lib2.default.context(parent, { baseDoc: basePath })];
    }

    if (!patchValueAlreadyInPath(specmap.state, patch)) {
      return patch;
    }
  }
};

var mod = (0, _assign2.default)(plugin, {
  docCache: docCache,
  absoluteify: absoluteify,
  clearCache: clearCache,
  JSONRefError: JSONRefError,
  wrapError: wrapError,
  getDoc: getDoc,
  split: split,
  extractFromDoc: extractFromDoc,
  fetchJSON: fetchJSON,
  extract: extract,
  jsonPointerToArray: jsonPointerToArray,
  unescapeJsonPointerToken: unescapeJsonPointerToken
});

exports.default = mod;

// =========================
// Utilities
// =========================

/**
 * Resolves a path and its base to an abolute URL.
 * @api public
 */

function absoluteify(path, basePath) {
  if (!ABSOLUTE_URL_REGEXP.test(path)) {
    if (!basePath) {
      throw new JSONRefError('Tried to resolve a relative URL, without having a basePath. path: \'' + path + '\' basePath: \'' + basePath + '\'');
    }
    return _url2.default.resolve(basePath, path);
  }
  return path;
}

/**
 * Wraps an error as JSONRefError.
 * @param  {Error} e      the error.
 * @param  {Object} extra (optional) optional data.
 * @return {Error}        an instance of JSONRefError.
 * @api public
 */
function wrapError(e, extra) {
  return new JSONRefError('Could not resolve reference because of: ' + e.message, extra, e);
}

/**
 * Splits a pointer by the hash delimiter.
 * @api public
 */
function split(ref) {
  return (ref + '').split('#'); // eslint-disable-line prefer-template
}

/**
 * Extracts a pointer from its document.
 * @param  {String} docPath the absolute document URL.
 * @param  {String} pointer the pointer whose value is to be extracted.
 * @return {Promise}        a promise of the pointer value.
 * @api public
 */
function extractFromDoc(docPath, pointer) {
  var doc = docCache[docPath];
  if (doc && !_lib2.default.isPromise(doc)) {
    // If doc is already available, return __value together with the promise.
    // __value is for special handling in cycle check:
    // pointerAlreadyInPath() won't work if patch.value is a promise,
    // thus when that promise is finally resolved, cycle might happen (because
    // `spec` and `docCache[basePath]` refer to the exact same object).
    // See test "should resolve a cyclic spec when baseDoc is specified".
    try {
      var v = extract(pointer, doc);
      return (0, _assign2.default)(_promise2.default.resolve(v), { __value: v });
    } catch (e) {
      return _promise2.default.reject(e);
    }
  }

  return getDoc(docPath).then(function (_doc) {
    return extract(pointer, _doc);
  });
}

/**
 * Clears all document caches.
 * @param  {String} item (optional) the name of the cache item to be cleared.
 * @api public
 */
function clearCache(item) {
  if (typeof item !== 'undefined') {
    delete docCache[item];
  } else {
    (0, _keys2.default)(docCache).forEach(function (key) {
      delete docCache[key];
    });
  }
}

/**
 * Fetches and caches a document.
 * @param  {String} docPath the absolute URL of the document.
 * @return {Promise}        a promise of the document content.
 * @api public
 */
function getDoc(docPath) {
  var val = docCache[docPath];
  if (val) {
    return _lib2.default.isPromise(val) ? val : _promise2.default.resolve(val);
  }

  // NOTE: we need to use `mod.fetchJSON` in order to be able to overwrite it.
  // Any tips on how to make this cleaner, please ping!
  docCache[docPath] = mod.fetchJSON(docPath).then(function (doc) {
    docCache[docPath] = doc;
    return doc;
  });
  return docCache[docPath];
}

/**
 * Fetches a document.
 * @param  {String} docPath the absolute URL of the document.
 * @return {Promise}        a promise of the document content.
 * @api public
 */
function fetchJSON(docPath) {
  return (0, _isomorphicFetch2.default)(docPath, { headers: { Accept: 'application/json' }, loadSpec: true }).then(function (res) {
    return res.json();
  });
}

/**
 * Extracts a pointer from an object.
 * @param  {String[]} pointer the JSON pointer.
 * @param  {Object} obj       an object whose value is to be extracted.
 * @return {Object}           the value to be extracted.
 * @api public
 */
function extract(pointer, obj) {
  var tokens = jsonPointerToArray(pointer);
  if (tokens.length < 1) {
    return obj;
  }

  var val = _lib2.default.getIn(obj, tokens);
  if (typeof val === 'undefined') {
    throw new JSONRefError('Could not resolve pointer: ' + pointer + ' does not exist in document', { pointer: pointer });
  }
  return val;
}

/**
 * Converts a JSON pointer to array.
 * @api public
 */
function jsonPointerToArray(pointer) {
  if (typeof pointer !== 'string') {
    throw new TypeError('Expected a string, got a ' + (typeof pointer === 'undefined' ? 'undefined' : (0, _typeof3.default)(pointer)));
  }

  if (pointer[0] === '/') {
    pointer = pointer.substr(1);
  }

  if (pointer === '') {
    return [];
  }

  return pointer.split('/').map(unescapeJsonPointerToken);
}

/**
 * Unescapes a JSON pointer.
 * @api public
 */
function unescapeJsonPointerToken(token) {
  if (typeof token !== 'string') {
    return token;
  }
  return token.replace(/~1/g, '/').replace(/~0/g, '~');
}

/**
 * Escapes a JSON pointer.
 * @api public
 */
function escapeJsonPointerToken(token) {
  return token.replace(/~/g, '~0').replace(/\//g, '~1');
}

function arrayToJsonPointer(arr) {
  if (arr.length === 0) {
    return '';
  }

  return '/' + arr.map(escapeJsonPointerToken).join('/');
}

var pointerBoundaryChar = function pointerBoundaryChar(c) {
  return !c || c === '/' || c === '#';
};

function pointerIsAParent(pointer, parentPointer) {
  if (pointerBoundaryChar(parentPointer)) {
    // This is the root of the document, so its naturally a parent
    return true;
  }
  var nextChar = pointer.charAt(parentPointer.length);
  return pointer.indexOf(parentPointer) === 0 && (!nextChar || nextChar === '/' || nextChar === '#');
}

// =========================
// Private
// =========================

/**
 * Checks if this pointer points back to one or more pointers along the path.
 */
function pointerAlreadyInPath(pointer, basePath, parent, specmap) {
  var refs = specmapRefs.get(specmap);
  if (!refs) {
    // Stores all resolved references of a specmap instance.
    // Schema: path -> pointer (path's $ref value).
    refs = {};
    specmapRefs.set(specmap, refs);
  }

  var parentPointer = arrayToJsonPointer(parent);
  var fullyQualifiedPointer = (basePath || '<specmap-base>') + '#' + pointer;

  // Case 1: direct cycle, e.g. a.b.c.$ref: '/a.b'
  // Detect by checking that the parent path doesn't start with pointer.
  // This only applies if the pointer is internal, i.e. basePath === rootPath (could be null)
  var rootDoc = specmap.contextTree.get([]).baseDoc;
  if (basePath == rootDoc && pointerIsAParent(parentPointer, pointer)) {
    // eslint-disable-line
    return true;
  }

  // Case 2: indirect cycle
  //  ex1: a.$ref: '/b'  &  b.c.$ref: '/b/c'
  //  ex2: a.$ref: '/b/c'  &  b.c.$ref: '/b'
  // Detect by retrieving all the $refs along the path of parent
  // and checking if any starts with pointer or vice versa.
  var currPath = '';
  var hasIndirectCycle = parent.some(function (token) {
    currPath = currPath + '/' + escapeJsonPointerToken(token);
    return refs[currPath] && refs[currPath].some(function (ref) {
      return pointerIsAParent(ref, fullyQualifiedPointer) || pointerIsAParent(fullyQualifiedPointer, ref);
    });
  });
  if (hasIndirectCycle) {
    return true;
  }

  // No cycle, this ref will be resolved, so stores it now for future detection.
  // No need to store if has cycle, as parent path is a dead-end and won't be checked again.
  refs[parentPointer] = (refs[parentPointer] || []).concat(fullyQualifiedPointer);
}

/**
 * Checks if the value of this patch ends up pointing to an ancestor along the path.
 */
function patchValueAlreadyInPath(root, patch) {
  var ancestors = [root];
  patch.path.reduce(function (parent, p) {
    ancestors.push(parent[p]);
    return parent[p];
  }, root);
  return pointToAncestor(patch.value);

  function pointToAncestor(obj) {
    return _lib2.default.isObject(obj) && (ancestors.indexOf(obj) >= 0 || (0, _keys2.default)(obj).some(function (k) {
      return pointToAncestor(obj[k]);
    }));
  }
}

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/create");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/weak-map");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/objectWithoutProperties");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/slicedToArray");

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/toConsumableArray");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("btoa");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("deep-extend");

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("fast-json-patch");

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = require("isomorphic-form-data");

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("js-yaml");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("lodash/cloneDeep");

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("lodash/get");

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("lodash/isArray");

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("lodash/isObject");

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = require("lodash/isPlainObject");

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = require("lodash/isString");

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = require("lodash/pick");

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = require("qs");

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16);


/***/ })
/******/ ]);