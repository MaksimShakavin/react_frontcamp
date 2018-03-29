module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch(e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	function hotDisposeChunk(chunkId) { //eslint-disable-line no-unused-vars
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "5d9dc41c0c9c0b290166"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
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
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(17)(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _stringify = __webpack_require__(31);

var _stringify2 = _interopRequireDefault(_stringify);

var _slicedToArray2 = __webpack_require__(32);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

var prefix = 's';
var inserted = {};

// Base64 encoding and decoding - The "Unicode Problem"
// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

/**
 * Remove style/link elements for specified node IDs
 * if they are no longer referenced by UI components.
 */
function removeCss(ids) {
  ids.forEach(function (id) {
    if (--inserted[id] <= 0) {
      var elem = document.getElementById(prefix + id);
      if (elem) {
        elem.parentNode.removeChild(elem);
      }
    }
  });
}

/**
 * Example:
 *   // Insert CSS styles object generated by `css-loader` into DOM
 *   var removeCss = insertCss([[1, 'body { color: red; }']]);
 *
 *   // Remove it from the DOM
 *   removeCss();
 */
function insertCss(styles) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$replace = _ref.replace,
      replace = _ref$replace === undefined ? false : _ref$replace,
      _ref$prepend = _ref.prepend,
      prepend = _ref$prepend === undefined ? false : _ref$prepend;

  var ids = [];
  for (var i = 0; i < styles.length; i++) {
    var _styles$i = (0, _slicedToArray3.default)(styles[i], 4),
        moduleId = _styles$i[0],
        css = _styles$i[1],
        media = _styles$i[2],
        sourceMap = _styles$i[3];

    var id = moduleId + '-' + i;

    ids.push(id);

    if (inserted[id]) {
      if (!replace) {
        inserted[id]++;
        continue;
      }
    }

    inserted[id] = 1;

    var elem = document.getElementById(prefix + id);
    var create = false;

    if (!elem) {
      create = true;

      elem = document.createElement('style');
      elem.setAttribute('type', 'text/css');
      elem.id = prefix + id;

      if (media) {
        elem.setAttribute('media', media);
      }
    }

    var cssText = css;
    if (sourceMap && typeof btoa === 'function') {
      // skip IE9 and below, see http://caniuse.com/atob-btoa
      cssText += '\n/*# sourceMappingURL=data:application/json;base64,' + b64EncodeUnicode((0, _stringify2.default)(sourceMap)) + '*/';
      cssText += '\n/*# sourceURL=' + sourceMap.file + '?' + id + '*/';
    }

    if ('textContent' in elem) {
      elem.textContent = cssText;
    } else {
      elem.styleSheet.cssText = cssText;
    }

    if (create) {
      if (prepend) {
        document.head.insertBefore(elem, document.head.childNodes[0]);
      } else {
        document.head.appendChild(elem);
      }
    }
  }

  return removeCss.bind(null, ids);
}

module.exports = insertCss;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPosts = getPosts;
exports.addPost = addPost;
exports.removePost = removePost;
exports.sortPost = sortPost;
var path = 'http://localhost:3000';

var SORT_POSTS = exports.SORT_POSTS = "SORT_POSTS";
var RECIEVE_POSTS = exports.RECIEVE_POSTS = "RECIEVE_POSTS";

function fetchPosts(url, dispatch) {
    return fetch(url).then(function (response) {
        return response.json().then(function (json) {
            return dispatch(recievePosts(json));
        });
    });
}

function fetchAddPost(url, data, dispatch) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(function (response) {
        return dispatch(getPosts());
    });
}

function fetchRemovePost(url, id, dispatch) {
    return fetch(url, {
        method: 'DELETE',
        body: id
    }).then(function (response) {
        return dispatch(getPosts());
    });
}

function getPosts() {
    return function (dispatch, getState) {
        return fetchPosts(path + "/blogs", dispatch);
    };
}

function addPost(data) {
    return function (dispatch, getState) {
        return fetchAddPost(path + "/blogs", data, dispatch);
    };
}

function removePost(id) {
    return function (dispatch, getState) {
        return fetchRemovePost(path + "/blogs/" + id, id, dispatch);
    };
}

function recievePosts(posts) {
    return {
        type: RECIEVE_POSTS,
        posts: posts
    };
}

function sortPost(sortBy) {
    return {
        type: SORT_POSTS,
        sortBy: sortBy
    };
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".delete-button-post{\r\n    color: rgb(223, 128, 128);\r\n    padding: 5px 10px;\r\n    background-color: white;\r\n    font-size: 12px;\r\n    border: none;\r\n    cursor: pointer;\r\n    position: absolute;\r\n    right: 5px;\r\n    top: 5px;\r\n    border-radius: 5px;\r\n}\r\n\r\n.post-inform .author{\r\n    color: rgb(140,140,140);\r\n}\r\n\r\n.post-inform{\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-between;\r\n    padding: 10px 0 5px 0;\r\n}\r\n\r\n.post-inform span:first-child{\r\n    font-size: 12px;\r\n    width: 100px;\r\n    font-weight: bold;\r\n    text-transform: uppercase;\r\n}\r\n\r\n.title{\r\n    max-width: 290px;\r\n}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var content = __webpack_require__(9);
var insertCss = __webpack_require__(3);

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

module.exports = content.locals || {};
module.exports._getContent = function () {
  return content;
};
module.exports._getCss = function () {
  return content.toString();
};
module.exports._insertCss = function (options) {
  return insertCss(content, options);
};

// Hot Module Replacement
// https://webpack.github.io/docs/hot-module-replacement
// Only activated in browser context
if (module.hot && typeof window !== 'undefined' && window.document) {
  var removeCss = function removeCss() {};
  module.hot.accept(9, function () {
    content = __webpack_require__(9);

    if (typeof content === 'string') {
      content = [[module.i, content, '']];
    }

    removeCss = insertCss(content, { replace: true });
  });
  module.hot.dispose(function () {
    removeCss();
  });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".content {\r\n    display: flex;\r\n    flex-direction: row;\r\n    flex-wrap: wrap;\r\n    justify-content: flex-start;\r\n    align-items: flex-start;\r\n    align-content: flex-start;\r\n    flex: 1 0 auto;\r\n    padding: 0 10px 20px 10px;\r\n}\r\n\r\n.content-add-post{\r\n    display: flex;\r\n    flex-direction: column;\r\n    flex-wrap: wrap;\r\n    flex: 1 0 auto;\r\n    padding: 0 10px 20px 10px;\r\n}\r\n\r\n.imageBlock {\r\n    display: block;\r\n    height: 200px;\r\n    width: 150px;\r\n}\r\n\r\n.poster {\r\n    padding: 10px;\r\n    margin: 10px;\r\n    flex: 0 1 auto;\r\n    margin-right: 20px;\r\n    background-color: #F5F5F5;\r\n    max-width: 350px;\r\n    min-width: 350px;\r\n    border-radius: 5px;\r\n    position: relative;\r\n}\r\n\r\n.not-found-post {\r\n    margin: 0 auto;\r\n    font-size: 40px;\r\n    color: rgb(210,210,210);\r\n    align-self: center;\r\n}\r\n\r\n.create-post-title{\r\n    margin: 20px auto;\r\n}\r\n\r\n.add-post{\r\n    margin: 20px auto;\r\n    width: 70%;\r\n}\r\n\r\n.add-post > label {\r\n    display: inline-block;\r\n    padding-left: 7px;\r\n    color: rgb(105, 100, 100);\r\n    font-weight: bold;\r\n}\r\n\r\n.add-post > input[type=text], .add-post textarea {\r\n    outline: none;\r\n    display: block;\r\n    width: 100%;\r\n    padding: 7px;\r\n    border: none;\r\n    border-bottom: 1px solid #ddd;\r\n    background: transparent;\r\n    margin-bottom: 10px;\r\n    font: 14px Arial, Helvetica, sans-serif;\r\n    height: 30px;\r\n}\r\n\r\n.add-post textarea{\r\n    resize:none;\r\n    overflow: hidden;\r\n}\r\n\r\n.add-post input[type=submit]{\r\n    color: white;\r\n    padding: 10px 20px;\r\n    background-color: rgb(97, 241, 162);\r\n    font-size: 12px;\r\n    border: none;\r\n    cursor: pointer;\r\n    border-radius: 5px;\r\n    position: relative;\r\n    right: -80%;\r\n    width: 20%;\r\n    margin-top: 15px;\r\n}", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".sort-part{\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-between;\r\n    padding: 10px 80px;\r\n}\r\n.count-posts, .sort-by-title, .sort-director {\r\n    color: rgb(59,68,75);\r\n    font-weight: bold;\r\n    font-size: 14px;\r\n    margin-top: 2px;\r\n}\r\n\r\n.radios-as-text{\r\n    display: flex;\r\n    flex-direction: row;\r\n}\r\n\r\n.radios-as-text input{\r\n    position: absolute;\r\n    left: -99999px;\r\n}\r\n\r\n.radios-as-text label {\r\n    color: rgb(59,68,75);\r\n    margin-left: 10px;\r\n    font-weight: bold;\r\n    font-size: 14px;\r\n    cursor: pointer;\r\n}\r\n\r\n.radios-as-text input[type=radio]:checked ~ label {\r\n    color: rgb(251, 99, 98);\r\n}\r\n", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".header{\r\n    flex: 1 0 auto;\r\n}\r\n\r\n.header-part{\r\n   position: relative;\r\n   z-index: 5;\r\n   min-height: 100px;\r\n}\r\n\r\n.header-part .fond-image {\r\n    position: absolute;\r\n    z-index: -1;\r\n    top: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n    background-image: url(\"http://qubemedia.net/wp-content/uploads/2015/04/book-film-holiday.jpg\");\r\n    background-size: cover;\r\n    width: 100%;\r\n    height: 100%;\r\n    box-shadow:0 0 0 128px rgba(0, 0, 0, 0.33) inset;\r\n}\r\n\r\n.header-part h1{\r\n    color: rgb(251, 99, 98);\r\n    text-align: left;\r\n    padding: 40px 0 0 200px;\r\n}\r\n\r\n.result-panel {\r\n    background-color: rgb(230, 230, 230);\r\n    height: 40px;\r\n}\r\n\r\n.add-button-post{\r\n    color: rgb(251, 99, 98);\r\n    padding: 10px 20px;\r\n    background-color: white;\r\n    font-size: 12px;\r\n    border: none;\r\n    cursor: pointer;\r\n    position: absolute;\r\n    right: 60px;\r\n    top: 10px;\r\n    border-radius: 5px;\r\n}", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".footer {\r\n    flex: 0 0 auto;\r\n    background-color: rgb(59,68,75);\r\n}\r\n\r\n.footer h4 {\r\n    color: rgb(251, 99, 98);\r\n    text-align: left;\r\n    padding: 20px 0 20px 40px;\r\n}", ""]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "* {\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\nhtml,\r\nbody {\r\n    height: 100%;\r\n}\r\n\r\n#app{\r\n    height: 100%;\r\n}\r\n\r\n.wrapper {\r\n    display: flex;\r\n    flex-direction: column;\r\n    height: 100%;\r\n    width: 850px;\r\n    margin: 0 auto;\r\n    font-family: Arial, sans-serif;\r\n}", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Post = __webpack_require__(15);

var _Post2 = _interopRequireDefault(_Post);

var _reactRouterDom = __webpack_require__(1);

var _reactRedux = __webpack_require__(4);

var _actions = __webpack_require__(5);

var _content = __webpack_require__(8);

var _content2 = _interopRequireDefault(_content);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// const BlogAPI = {
//     posts: [
//         {number: 1, title: "Ben Blocker", description: "Comedies Comedies Comedies Comedies", releaseDate: "2014", author: "Quentin Tarantino"},
//         {number: 2, title: "Dave Defend", description: "Dramas Dramas Dramas Dramas Dramas", releaseDate: "2015", author: "Quentin Tarantino"},
//         {number: 3, title: "Sam Sweeper", description: "Dramas Dramas Dramas Dramas Dramas Dramas", releaseDate: "2014", author: "Quentin Tarantino"},
//         {number: 4, title: "Matt Midfiel", description: "Thriller Thriller Thriller Thriller Thriller", releaseDate: "2015", author: "Big Dealan"},
//         {number: 5, title: "Will Winger", description: "Thriller Thriller Thriller Thriller Thriller", releaseDate: "2014", author: "Big Dealan"},
//         {number: 6, title: "Fillipe Forw", description: "Comedies Comedies Comedies Comedies", releaseDate: "2016", author: "Big Dealan"},
//         {number: 7, title: "William Win", description: "Thriller Thriller Thriller Thriller Thriller", releaseDate: "2017", author: "Gvinet Paltrou"},
//         {number: 8, title: "Fil Forward", description: "Comedies Comedies Comedies Comedies", releaseDate: "2016", author: "Gvinet Paltrou"}
//     ],
//     all: function() { return this.posts},
//     get: function(id) {
//         const isPost = p => p.number === id;
//         return this.posts.find(isPost)
//     }
// };

var ContentPost = function (_React$Component) {
    _inherits(ContentPost, _React$Component);

    function ContentPost(props) {
        _classCallCheck(this, ContentPost);

        return _possibleConstructorReturn(this, (ContentPost.__proto__ || Object.getPrototypeOf(ContentPost)).call(this, props));
    }

    _createClass(ContentPost, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.requestPosts();
        }
    }, {
        key: 'requestPosts',
        value: function requestPosts() {
            this.props.fetchPosts();
        }
    }, {
        key: 'sortPostsBy',
        value: function sortPostsBy(sortBy, posts) {
            if (sortBy === "releaseDate") {
                posts.sort(function (a, b) {
                    var itemA = a.releaseDate || '0';
                    var itemB = b.releaseDate || '0';
                    return itemB.replace(/-/g, '') - itemA.replace(/-/g, '');
                });
            } else {
                posts.sort(function (a, b) {
                    return a.author.localeCompare(b.author);
                });
            }
            return posts;
        }
    }, {
        key: 'render',
        value: function render() {
            console.log(this.props.state);
            var posts = this.sortPostsBy(this.props.sortBy, this.props.posts);
            return _react2.default.createElement(
                'div',
                { className: 'content' },
                posts.map(function (p) {
                    return _react2.default.createElement(_Post2.default, { info: p, key: p.id });
                })
            );
        }
    }]);

    return ContentPost;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(store) {
    return {
        posts: store.storePosts.posts,
        sortBy: store.storePosts.sortBy
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        fetchPosts: function fetchPosts() {
            dispatch((0, _actions.getPosts)());
        }
    };
};

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ContentPost));

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _post = __webpack_require__(30);

var _post2 = _interopRequireDefault(_post);

var _reactRedux = __webpack_require__(4);

var _actions = __webpack_require__(5);

var _reactRouterDom = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Post = function (_React$Component) {
    _inherits(Post, _React$Component);

    function Post(props) {
        _classCallCheck(this, Post);

        return _possibleConstructorReturn(this, (Post.__proto__ || Object.getPrototypeOf(Post)).call(this, props));
    }

    _createClass(Post, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var info = this.props.info;
            return _react2.default.createElement(
                'article',
                { className: 'poster' },
                _react2.default.createElement(
                    'h3',
                    { className: 'title' },
                    info.title
                ),
                _react2.default.createElement('input', { type: 'button', value: 'Delete', className: 'delete-button-post',
                    onClick: function onClick() {
                        _this2.props.fetchRemovePosts(info.id);
                    } }),
                _react2.default.createElement(
                    'p',
                    { className: 'description' },
                    info.description
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'post-inform' },
                    _react2.default.createElement(
                        'span',
                        { className: 'data' },
                        info.releaseDate
                    ),
                    _react2.default.createElement(
                        'span',
                        { className: 'author' },
                        info.author
                    )
                )
            );
        }
    }]);

    return Post;
}(_react2.default.Component);

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        fetchRemovePosts: function fetchRemovePosts(id) {
            dispatch((0, _actions.removePost)(id));
        }
    };
};

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(null, mapDispatchToProps)(Post));
;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Post = __webpack_require__(15);

var _Post2 = _interopRequireDefault(_Post);

var _reactRouterDom = __webpack_require__(1);

var _reactRedux = __webpack_require__(4);

var _actions = __webpack_require__(5);

var _content = __webpack_require__(8);

var _content2 = _interopRequireDefault(_content);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContentAddPost = function (_React$Component) {
    _inherits(ContentAddPost, _React$Component);

    function ContentAddPost(props) {
        _classCallCheck(this, ContentAddPost);

        var _this = _possibleConstructorReturn(this, (ContentAddPost.__proto__ || Object.getPrototypeOf(ContentAddPost)).call(this, props));

        _this.state = {
            title: null,
            description: null,
            author: null,
            releaseDate: null
        };

        _this.onSubmit = _this.onSubmit.bind(_this);
        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }

    _createClass(ContentAddPost, [{
        key: 'adjust_textarea',
        value: function adjust_textarea(h) {
            h.style.height = "20px";
            h.style.height = h.scrollHeight + "px";
        }
    }, {
        key: 'onSubmit',
        value: function onSubmit(e) {
            e.preventDefault();
            console.log(this.state);
            this.props.fetchAddPost(this.state);
            this.props.history.push("/");
        }
    }, {
        key: 'onChange',
        value: function onChange(e) {
            var target = e.target;
            var value = target.value;
            var name = target.name;
            this.setState(_defineProperty({}, name, value));
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'content-add-post' },
                _react2.default.createElement(
                    'h2',
                    { className: 'create-post-title' },
                    ' Create your new post'
                ),
                _react2.default.createElement(
                    'form',
                    { className: 'add-post', onSubmit: this.onSubmit },
                    _react2.default.createElement(
                        'label',
                        { htmlFor: 'title' },
                        'Enter title of the new post'
                    ),
                    _react2.default.createElement('input', { name: 'title', type: 'text', id: 'title', placeholder: 'Title..',
                        onChange: this.onChange }),
                    _react2.default.createElement(
                        'label',
                        { htmlFor: 'description' },
                        'Enter description of the new post'
                    ),
                    _react2.default.createElement('textarea', { name: 'description', id: 'description', placeholder: 'Description..',
                        onChange: this.onChange }),
                    _react2.default.createElement(
                        'label',
                        { htmlFor: 'author' },
                        'Enter your name'
                    ),
                    _react2.default.createElement('input', { name: 'author', type: 'text', id: 'author', placeholder: 'Your name..',
                        onChange: this.onChange }),
                    _react2.default.createElement(
                        'label',
                        { htmlFor: 'releaseDate' },
                        'Enter date'
                    ),
                    _react2.default.createElement('input', { name: 'releaseDate', type: 'text', id: 'releaseDate', placeholder: 'Choosen date..',
                        onChange: this.onChange }),
                    _react2.default.createElement('input', { type: 'submit', value: 'Submit' })
                )
            );
        }
    }]);

    return ContentAddPost;
}(_react2.default.Component);

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        fetchAddPost: function fetchAddPost(data) {
            dispatch((0, _actions.addPost)(data));
        }
    };
};

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(null, mapDispatchToProps)(ContentAddPost));

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(18);

var _express2 = _interopRequireDefault(_express);

var _path = __webpack_require__(19);

var _path2 = _interopRequireDefault(_path);

var _handleRander = __webpack_require__(20);

var _handleRander2 = _interopRequireDefault(_handleRander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = 7700;
var PUBLIC_PATH = '.';

var app = (0, _express2.default)();

app.use(_express2.default.static(PUBLIC_PATH));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

// Serve requests with our handleRender function
app.get('*', _handleRander2.default);

app.listen(PORT, function () {
    console.log('Listening on port ' + PORT + '...');
});

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = handleRender;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _server = __webpack_require__(21);

var _reactRouterDom = __webpack_require__(1);

var _reactRouterConfig = __webpack_require__(22);

var _reactRedux = __webpack_require__(4);

var _store = __webpack_require__(23);

var _store2 = _interopRequireDefault(_store);

__webpack_require__(28);

var _routes = __webpack_require__(29);

var _routes2 = _interopRequireDefault(_routes);

var _App = __webpack_require__(33);

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderPage(renderedApp, preloadedState) {
    var appData = '<!DOCTYPE html>\n    <html lang="en">\n    <head>\n        <meta charset="UTF-8">\n        <title>SPA</title>\n    </head>\n    <body>\n    <div id="app">' + renderedApp + '</div>\n    <script>\n        window.PRELOADED_STATE = ' + JSON.stringify(preloadedState).replace(/</g, '\\u003c') + '\n    </script>\n    <script type="text/javascript" src="./public/bundle.js"></script>\n    </body>\n    </html>';

    return appData;
}

function handleRender(req, res) {
    // const css = new Set(); // CSS for all rendered React components
    // const context = { insertCss: (...styles) => styles.forEach(style => css.add(style._getCss())) };
    var context = {};
    var store = (0, _store2.default)();
    var branch = (0, _reactRouterConfig.matchRoutes)(_routes2.default, req.url);
    var promiseAll = branch.map(function (_ref) {
        var route = _ref.route,
            match = _ref.match;
        var fetchData = route.component.fetchData;

        if (!(fetchData instanceof Function)) {
            return Promise.resolve(null);
        }
        return fetchData(store.dispatch, match);
    });
    Promise.all(promiseAll).then(function () {
        var app = _react2.default.createElement(
            _reactRedux.Provider,
            { store: store },
            _react2.default.createElement(
                _reactRouterDom.StaticRouter,
                { location: req.url, context: context },
                _react2.default.createElement(_App2.default, null)
            )
        );
        var renderedApp = (0, _server.renderToString)(app);

        if (context.url) {
            return res.redirect(context.url);
        }

        var preloadedState = store.getState();

        return res.send(renderPage(renderedApp, preloadedState));
    });
}

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("react-router-config");

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = __webpack_require__(6);

var _reduxThunk = __webpack_require__(24);

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _index = __webpack_require__(25);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var middleware = (0, _redux.applyMiddleware)(_reduxThunk2.default);

exports.default = function (initialState) {
    return (0, _redux.createStore)(_index.rootReducer, initialState, middleware);
};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("redux-thunk");

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.rootReducer = undefined;

var _redux = __webpack_require__(6);

var _userReducer = __webpack_require__(26);

var _userReducer2 = _interopRequireDefault(_userReducer);

var _postsReducer = __webpack_require__(27);

var _postsReducer2 = _interopRequireDefault(_postsReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_userReducer2.default);
console.log(_postsReducer2.default);

var rootReducer = exports.rootReducer = (0, _redux.combineReducers)({
    storeUser: _userReducer2.default,
    storePosts: _postsReducer2.default
});

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = reducer;
// import {

// } from '../actions/actions'

function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        usersPost: []
    };
    var action = arguments[1];

    switch (action.type) {
        default:
            return state;
    }
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = reducer;

var _redux = __webpack_require__(6);

var _actions = __webpack_require__(5);

function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        posts: [],
        sortBy: 'releaseDate'
    };
    var action = arguments[1];

    switch (action.type) {
        case _actions.RECIEVE_POSTS:
            {
                return Object.assign({}, state, { posts: action.posts });
            }
        case _actions.SORT_POSTS:
            {
                return Object.assign({}, state, { sortBy: action.sortBy });
            }
        default:
            return state;
    }
}

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ContentPost = __webpack_require__(14);

var _ContentPost2 = _interopRequireDefault(_ContentPost);

var _ContentAddPost = __webpack_require__(16);

var _ContentAddPost2 = _interopRequireDefault(_ContentAddPost);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [{
  path: '/',
  component: _ContentPost2.default
}, {
  path: '/add',
  component: _ContentAddPost2.default
}];

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var content = __webpack_require__(7);
var insertCss = __webpack_require__(3);

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

module.exports = content.locals || {};
module.exports._getContent = function () {
  return content;
};
module.exports._getCss = function () {
  return content.toString();
};
module.exports._insertCss = function (options) {
  return insertCss(content, options);
};

// Hot Module Replacement
// https://webpack.github.io/docs/hot-module-replacement
// Only activated in browser context
if (module.hot && typeof window !== 'undefined' && window.document) {
  var removeCss = function removeCss() {};
  module.hot.accept(7, function () {
    content = __webpack_require__(7);

    if (typeof content === 'string') {
      content = [[module.i, content, '']];
    }

    removeCss = insertCss(content, { replace: true });
  });
  module.hot.dispose(function () {
    removeCss();
  });
}

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/slicedToArray");

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Header = __webpack_require__(34);

var _Header2 = _interopRequireDefault(_Header);

var _Content = __webpack_require__(38);

var _Content2 = _interopRequireDefault(_Content);

var _Footer = __webpack_require__(40);

var _Footer2 = _interopRequireDefault(_Footer);

__webpack_require__(42);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'wrapper' },
                _react2.default.createElement(_Header2.default, null),
                _react2.default.createElement(_Content2.default, null),
                _react2.default.createElement(_Footer2.default, null)
            );
        }
    }]);

    return App;
}(_react2.default.Component);

exports.default = App;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(1);

var _ResultSortBox = __webpack_require__(35);

var _ResultSortBox2 = _interopRequireDefault(_ResultSortBox);

var _header = __webpack_require__(37);

var _header2 = _interopRequireDefault(_header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Header = function (_React$Component) {
    _inherits(Header, _React$Component);

    function Header(props) {
        _classCallCheck(this, Header);

        return _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, props));
    }

    _createClass(Header, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'header',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'header' },
                    _react2.default.createElement(
                        'div',
                        { className: 'header-part' },
                        _react2.default.createElement('div', { className: 'fond-image' }),
                        _react2.default.createElement(
                            'h1',
                            null,
                            'Keep calm and add new post;)'
                        ),
                        _react2.default.createElement(
                            _reactRouterDom.Link,
                            { to: '/add' },
                            _react2.default.createElement('input', { type: 'button', value: 'ADD', className: 'add-button-post' })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'result-panel' },
                        _react2.default.createElement(_ResultSortBox2.default, null)
                    )
                )
            );
        }
    }]);

    return Header;
}(_react2.default.Component);

exports.default = Header;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(4);

var _actions = __webpack_require__(5);

__webpack_require__(36);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResultSortBox = function (_React$Component) {
    _inherits(ResultSortBox, _React$Component);

    function ResultSortBox(props) {
        _classCallCheck(this, ResultSortBox);

        var _this = _possibleConstructorReturn(this, (ResultSortBox.__proto__ || Object.getPrototypeOf(ResultSortBox)).call(this, props));

        _this.state = {
            selectedSort: 'releaseDate'
        };
        return _this;
    }

    _createClass(ResultSortBox, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'sort-part' },
                _react2.default.createElement(
                    'p',
                    { className: 'count-posts' },
                    this.props.countPosts ? this.props.countPosts === 1 ? "Only one post found" : this.props.countPosts + " posts found" : "No posts found"
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'radios-as-text' },
                    _react2.default.createElement(
                        'p',
                        { className: 'sort-by-title' },
                        'Sort by'
                    ),
                    _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement('input', { type: 'radio', name: 'sortBy', id: 'releaseDate', checked: this.props.selectedSort === 'releaseDate', onChange: this.props.handleSortChange }),
                        _react2.default.createElement(
                            'label',
                            { htmlFor: 'releaseDate' },
                            'release data'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement('input', { type: 'radio', name: 'sortBy', id: 'author', checked: this.props.selectedSort === 'author', onChange: this.props.handleSortChange }),
                        _react2.default.createElement(
                            'label',
                            { htmlFor: 'author' },
                            'author'
                        )
                    )
                )
            );
        }
    }]);

    return ResultSortBox;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(store) {
    return {
        countPosts: store.storePosts.posts.length,
        selectedSort: store.storePosts.sortBy
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        handleSortChange: function handleSortChange(changeEvent) {
            dispatch((0, _actions.sortPost)(changeEvent.target.id));
        }
    };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ResultSortBox);

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var content = __webpack_require__(10);
var insertCss = __webpack_require__(3);

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

module.exports = content.locals || {};
module.exports._getContent = function () {
  return content;
};
module.exports._getCss = function () {
  return content.toString();
};
module.exports._insertCss = function (options) {
  return insertCss(content, options);
};

// Hot Module Replacement
// https://webpack.github.io/docs/hot-module-replacement
// Only activated in browser context
if (module.hot && typeof window !== 'undefined' && window.document) {
  var removeCss = function removeCss() {};
  module.hot.accept(10, function () {
    content = __webpack_require__(10);

    if (typeof content === 'string') {
      content = [[module.i, content, '']];
    }

    removeCss = insertCss(content, { replace: true });
  });
  module.hot.dispose(function () {
    removeCss();
  });
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var content = __webpack_require__(11);
var insertCss = __webpack_require__(3);

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

module.exports = content.locals || {};
module.exports._getContent = function () {
  return content;
};
module.exports._getCss = function () {
  return content.toString();
};
module.exports._insertCss = function (options) {
  return insertCss(content, options);
};

// Hot Module Replacement
// https://webpack.github.io/docs/hot-module-replacement
// Only activated in browser context
if (module.hot && typeof window !== 'undefined' && window.document) {
  var removeCss = function removeCss() {};
  module.hot.accept(11, function () {
    content = __webpack_require__(11);

    if (typeof content === 'string') {
      content = [[module.i, content, '']];
    }

    removeCss = insertCss(content, { replace: true });
  });
  module.hot.dispose(function () {
    removeCss();
  });
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(1);

var _NotFound = __webpack_require__(39);

var _NotFound2 = _interopRequireDefault(_NotFound);

var _ContentPost = __webpack_require__(14);

var _ContentPost2 = _interopRequireDefault(_ContentPost);

var _ContentAddPost = __webpack_require__(16);

var _ContentAddPost2 = _interopRequireDefault(_ContentAddPost);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Content = function Content() {
    return _react2.default.createElement(
        _reactRouterDom.Switch,
        null,
        _react2.default.createElement(_reactRouterDom.Route, { path: '/add', component: _ContentAddPost2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { path: '/', component: _ContentPost2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { path: '*', component: _ContentPost2.default })
    );
};

exports.default = Content;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotFound = function (_React$Component) {
    _inherits(NotFound, _React$Component);

    function NotFound() {
        _classCallCheck(this, NotFound);

        return _possibleConstructorReturn(this, (NotFound.__proto__ || Object.getPrototypeOf(NotFound)).apply(this, arguments));
    }

    _createClass(NotFound, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'content' },
                _react2.default.createElement(
                    'p',
                    { className: 'not-found-post' },
                    'No post found'
                )
            );
        }
    }]);

    return NotFound;
}(_react2.default.Component);

exports.default = NotFound;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(41);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Footer = function (_React$Component) {
    _inherits(Footer, _React$Component);

    function Footer() {
        _classCallCheck(this, Footer);

        return _possibleConstructorReturn(this, (Footer.__proto__ || Object.getPrototypeOf(Footer)).apply(this, arguments));
    }

    _createClass(Footer, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'footer' },
                _react2.default.createElement(
                    'h4',
                    null,
                    'netflixroulette'
                )
            );
        }
    }]);

    return Footer;
}(_react2.default.Component);

exports.default = Footer;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var content = __webpack_require__(12);
var insertCss = __webpack_require__(3);

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

module.exports = content.locals || {};
module.exports._getContent = function () {
  return content;
};
module.exports._getCss = function () {
  return content.toString();
};
module.exports._insertCss = function (options) {
  return insertCss(content, options);
};

// Hot Module Replacement
// https://webpack.github.io/docs/hot-module-replacement
// Only activated in browser context
if (module.hot && typeof window !== 'undefined' && window.document) {
  var removeCss = function removeCss() {};
  module.hot.accept(12, function () {
    content = __webpack_require__(12);

    if (typeof content === 'string') {
      content = [[module.i, content, '']];
    }

    removeCss = insertCss(content, { replace: true });
  });
  module.hot.dispose(function () {
    removeCss();
  });
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var content = __webpack_require__(13);
var insertCss = __webpack_require__(3);

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

module.exports = content.locals || {};
module.exports._getContent = function () {
  return content;
};
module.exports._getCss = function () {
  return content.toString();
};
module.exports._insertCss = function (options) {
  return insertCss(content, options);
};

// Hot Module Replacement
// https://webpack.github.io/docs/hot-module-replacement
// Only activated in browser context
if (module.hot && typeof window !== 'undefined' && window.document) {
  var removeCss = function removeCss() {};
  module.hot.accept(13, function () {
    content = __webpack_require__(13);

    if (typeof content === 'string') {
      content = [[module.i, content, '']];
    }

    removeCss = insertCss(content, { replace: true });
  });
  module.hot.dispose(function () {
    removeCss();
  });
}

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWQ5ZGM0MWMwYzljMGIyOTAxNjYiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVhY3RcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdC1yb3V0ZXItZG9tXCIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9pc29tb3JwaGljLXN0eWxlLWxvYWRlci9saWIvaW5zZXJ0Q3NzLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlYWN0LXJlZHV4XCIiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NsaWVudC9hY3Rpb25zL2FjdGlvbnMuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVkdXhcIiIsIndlYnBhY2s6Ly8vLi9hcHAvY2xpZW50L2NvbXBvbmVudHMvUG9zdC9wb3N0LmNzcz82MTU3Iiwid2VicGFjazovLy8uL2FwcC9jbGllbnQvY29tcG9uZW50cy9Db250ZW50L2NvbnRlbnQuY3NzIiwid2VicGFjazovLy8uL2FwcC9jbGllbnQvY29tcG9uZW50cy9Db250ZW50L2NvbnRlbnQuY3NzPzY3NWEiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NsaWVudC9jb21wb25lbnRzL1Jlc3VsdEJveC9yZXN1bHRCb3guY3NzP2RjYjIiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NsaWVudC9jb21wb25lbnRzL0hlYWRlci9oZWFkZXIuY3NzPzkwNjAiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NsaWVudC9jb21wb25lbnRzL0Zvb3Rlci9mb290ZXIuY3NzPzQ0YzIiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NsaWVudC9zcGEvYXBwLmNzcz8xOGY2Iiwid2VicGFjazovLy8uL2FwcC9jbGllbnQvY29tcG9uZW50cy9Db250ZW50L0NvbnRlbnRQb3N0LmpzIiwid2VicGFjazovLy8uL2FwcC9jbGllbnQvY29tcG9uZW50cy9Qb3N0L1Bvc3QuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NsaWVudC9jb21wb25lbnRzL0NvbnRlbnQvQ29udGVudEFkZFBvc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NlcnZlci9oYW5kbGVSYW5kZXIuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVhY3QtZG9tL3NlcnZlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlYWN0LXJvdXRlci1jb25maWdcIiIsIndlYnBhY2s6Ly8vLi9hcHAvY2xpZW50L3N0b3JlLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlZHV4LXRodW5rXCIiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NsaWVudC9yZWR1Y2Vycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvY2xpZW50L3JlZHVjZXJzL3VzZXJSZWR1Y2VyLmpzIiwid2VicGFjazovLy8uL2FwcC9jbGllbnQvcmVkdWNlcnMvcG9zdHNSZWR1Y2VyLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImlzb21vcnBoaWMtZmV0Y2hcIiIsIndlYnBhY2s6Ly8vLi9hcHAvY2xpZW50L3JvdXRlcy5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvY2xpZW50L2NvbXBvbmVudHMvUG9zdC9wb3N0LmNzcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnlcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheVwiIiwid2VicGFjazovLy8uL2FwcC9jbGllbnQvc3BhL0FwcC5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvY2xpZW50L2NvbXBvbmVudHMvSGVhZGVyL0hlYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvY2xpZW50L2NvbXBvbmVudHMvUmVzdWx0Qm94L1Jlc3VsdFNvcnRCb3guanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NsaWVudC9jb21wb25lbnRzL1Jlc3VsdEJveC9yZXN1bHRCb3guY3NzIiwid2VicGFjazovLy8uL2FwcC9jbGllbnQvY29tcG9uZW50cy9IZWFkZXIvaGVhZGVyLmNzcyIsIndlYnBhY2s6Ly8vLi9hcHAvY2xpZW50L2NvbXBvbmVudHMvQ29udGVudC9Db250ZW50LmpzIiwid2VicGFjazovLy8uL2FwcC9jbGllbnQvY29tcG9uZW50cy9Db250ZW50L05vdEZvdW5kLmpzIiwid2VicGFjazovLy8uL2FwcC9jbGllbnQvY29tcG9uZW50cy9Gb290ZXIvRm9vdGVyLmpzIiwid2VicGFjazovLy8uL2FwcC9jbGllbnQvY29tcG9uZW50cy9Gb290ZXIvZm9vdGVyLmNzcyIsIndlYnBhY2s6Ly8vLi9hcHAvY2xpZW50L3NwYS9hcHAuY3NzIl0sIm5hbWVzIjpbImdldFBvc3RzIiwiYWRkUG9zdCIsInJlbW92ZVBvc3QiLCJzb3J0UG9zdCIsInBhdGgiLCJTT1JUX1BPU1RTIiwiUkVDSUVWRV9QT1NUUyIsImZldGNoUG9zdHMiLCJ1cmwiLCJkaXNwYXRjaCIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsInJlY2lldmVQb3N0cyIsImZldGNoQWRkUG9zdCIsImRhdGEiLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJmZXRjaFJlbW92ZVBvc3QiLCJpZCIsImdldFN0YXRlIiwicG9zdHMiLCJ0eXBlIiwic29ydEJ5IiwiY29udGVudCIsInJlcXVpcmUiLCJpbnNlcnRDc3MiLCJtb2R1bGUiLCJleHBvcnRzIiwibG9jYWxzIiwiX2dldENvbnRlbnQiLCJfZ2V0Q3NzIiwidG9TdHJpbmciLCJfaW5zZXJ0Q3NzIiwib3B0aW9ucyIsImhvdCIsIndpbmRvdyIsImRvY3VtZW50IiwicmVtb3ZlQ3NzIiwiYWNjZXB0IiwicmVwbGFjZSIsImRpc3Bvc2UiLCJDb250ZW50UG9zdCIsInByb3BzIiwicmVxdWVzdFBvc3RzIiwic29ydCIsImEiLCJiIiwiaXRlbUEiLCJyZWxlYXNlRGF0ZSIsIml0ZW1CIiwiYXV0aG9yIiwibG9jYWxlQ29tcGFyZSIsImNvbnNvbGUiLCJsb2ciLCJzdGF0ZSIsInNvcnRQb3N0c0J5IiwibWFwIiwicCIsIkNvbXBvbmVudCIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0b3JlIiwic3RvcmVQb3N0cyIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsIlBvc3QiLCJpbmZvIiwidGl0bGUiLCJmZXRjaFJlbW92ZVBvc3RzIiwiZGVzY3JpcHRpb24iLCJDb250ZW50QWRkUG9zdCIsIm9uU3VibWl0IiwiYmluZCIsIm9uQ2hhbmdlIiwiaCIsInN0eWxlIiwiaGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0IiwiZSIsInByZXZlbnREZWZhdWx0IiwiaGlzdG9yeSIsInB1c2giLCJ0YXJnZXQiLCJ2YWx1ZSIsIm5hbWUiLCJzZXRTdGF0ZSIsIlBPUlQiLCJQVUJMSUNfUEFUSCIsImFwcCIsInVzZSIsInN0YXRpYyIsInJlcSIsInJlcyIsIm5leHQiLCJzZXRIZWFkZXIiLCJnZXQiLCJsaXN0ZW4iLCJoYW5kbGVSZW5kZXIiLCJyZW5kZXJQYWdlIiwicmVuZGVyZWRBcHAiLCJwcmVsb2FkZWRTdGF0ZSIsImFwcERhdGEiLCJjb250ZXh0IiwiYnJhbmNoIiwicHJvbWlzZUFsbCIsInJvdXRlIiwibWF0Y2giLCJmZXRjaERhdGEiLCJjb21wb25lbnQiLCJGdW5jdGlvbiIsIlByb21pc2UiLCJyZXNvbHZlIiwiYWxsIiwicmVkaXJlY3QiLCJzZW5kIiwibWlkZGxld2FyZSIsImluaXRpYWxTdGF0ZSIsInJvb3RSZWR1Y2VyIiwic3RvcmVVc2VyIiwicmVkdWNlciIsInVzZXJzUG9zdCIsImFjdGlvbiIsIk9iamVjdCIsImFzc2lnbiIsIkFwcCIsIkhlYWRlciIsIlJlc3VsdFNvcnRCb3giLCJzZWxlY3RlZFNvcnQiLCJjb3VudFBvc3RzIiwiaGFuZGxlU29ydENoYW5nZSIsImxlbmd0aCIsImNoYW5nZUV2ZW50IiwiQ29udGVudCIsIk5vdEZvdW5kIiwiRm9vdGVyIl0sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUE0QztBQUM1QztBQUNBO0FBQ0E7O0FBRUEsMENBQWtDO0FBQ2xDO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkNBQXFDO0FBQ3JDO0FBQ0E7Ozs7QUFJQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBO0FBQ0Esb0NBQTRCO0FBQzVCLHFDQUE2QjtBQUM3Qix5Q0FBaUM7O0FBRWpDLCtDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4Q0FBc0M7QUFDdEM7QUFDQTtBQUNBLHFDQUE2QjtBQUM3QixxQ0FBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQWlCLDhCQUE4QjtBQUMvQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUEsNERBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQWtCLGNBQWM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQWEsNEJBQTRCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Q2xFLE1BQUlDLFlBQVkscUJBQVcsQ0FBRSxDQUE3QjtBQUNBWCxTQUFPUSxHQUFQLENBQVdJLE1BQVgsQ0FBa0IsRUFBbEIsRUFBMkUsWUFBVztBQUNwRmYsY0FBVSxtQkFBQUMsQ0FBUSxFQUFSLENBQVY7O0FBRUEsUUFBSSxPQUFPRCxPQUFQLEtBQW1CLFFBQXZCLEVBQWlDO0FBQy9CQSxnQkFBVSxDQUFDLENBQUMsUUFBRCxFQUFZQSxPQUFaLEVBQXFCLEVBQXJCLENBQUQsQ0FBVjtBQUNEOztBQUVEYyxnQkFBWVosVUFBVUYsT0FBVixFQUFtQixFQUFFZ0IsU0FBUyxJQUFYLEVBQW5CLENBQVo7QUFDRCxHQVJEO0FBU0FiLFNBQU9RLEdBQVAsQ0FBV00sT0FBWCxDQUFtQixZQUFXO0FBQUVIO0FBQWMsR0FBOUM7QUFDRCxDIiwiZmlsZSI6InNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRcdHZhciBjaHVuayA9IHJlcXVpcmUoXCIuL1wiICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiKTtcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmsuaWQsIGNodW5rLm1vZHVsZXMpO1xuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRcdHRyeSB7XG4gXHRcdFx0dmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIuL1wiICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCIpO1xuIFx0XHR9IGNhdGNoKGUpIHtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gXHRcdH1cbiBcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh1cGRhdGUpO1xuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkgeyAvL2VzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cblxuIFx0XHJcbiBcdFxyXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XHJcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiNWQ5ZGM0MWMwYzljMGIyOTAxNjZcIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcclxuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XHJcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRpZighbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xyXG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcclxuIFx0XHRcdGlmKG1lLmhvdC5hY3RpdmUpIHtcclxuIFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xyXG4gXHRcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA8IDApXHJcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA8IDApXHJcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcclxuIFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlcXVlc3QgKyBcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgKyBtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcclxuIFx0XHR9O1xyXG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fTtcclxuIFx0XHRmb3IodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmIG5hbWUgIT09IFwiZVwiKSB7XHJcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicmVhZHlcIilcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcclxuIFx0XHRcdFx0dGhyb3cgZXJyO1xyXG4gXHRcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xyXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XHJcbiBcdFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcclxuIFx0XHRcdFx0XHRpZighaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9O1xyXG4gXHRcdHJldHVybiBmbjtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaG90ID0ge1xyXG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxyXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcclxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXHJcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcclxuIFx0XHJcbiBcdFx0XHQvLyBNb2R1bGUgQVBJXHJcbiBcdFx0XHRhY3RpdmU6IHRydWUsXHJcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxyXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxyXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxyXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGlmKCFsKSByZXR1cm4gaG90U3RhdHVzO1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxyXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXHJcbiBcdFx0fTtcclxuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XHJcbiBcdFx0cmV0dXJuIGhvdDtcclxuIFx0fVxyXG4gXHRcclxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XHJcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcclxuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcclxuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdERlZmVycmVkO1xyXG4gXHRcclxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXHJcbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XHJcbiBcdFx0dmFyIGlzTnVtYmVyID0gKCtpZCkgKyBcIlwiID09PSBpZDtcclxuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcclxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XHJcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XHJcbiBcdFx0XHRpZighdXBkYXRlKSB7XHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0XHRcdHJldHVybiBudWxsO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcclxuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcclxuIFx0XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcclxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcclxuIFx0XHRcdHZhciBjaHVua0lkID0gMDtcclxuIFx0XHRcdHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xyXG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xyXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxyXG4gXHRcdFx0cmV0dXJuO1xyXG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XHJcbiBcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0aWYoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xyXG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XHJcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcclxuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcclxuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XHJcbiBcdFx0aWYoIWRlZmVycmVkKSByZXR1cm47XHJcbiBcdFx0aWYoaG90QXBwbHlPblVwZGF0ZSkge1xyXG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cclxuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxyXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxyXG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xyXG4gXHRcdFx0fSkudGhlbihcclxuIFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiBcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XHJcbiBcdFx0XHRcdGlmKCFjaGlsZCkgY29udGludWU7XHJcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSB7XHJcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcclxuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcclxuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xyXG4gXHRcdFx0XHRcdFx0aWYoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcclxuIFx0XHJcbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcclxuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcclxuIFx0XHRcdFx0XHRcdGlmKGNiKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gXHRcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xyXG4gXHRcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcclxuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycjIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmdpbmFsRXJyb3I6IGVyciwgLy8gVE9ETyByZW1vdmUgaW4gd2VicGFjayA0XHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSgxNykoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTcpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDVkOWRjNDFjMGM5YzBiMjkwMTY2IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJyZWFjdFwiXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0LXJvdXRlci1kb21cIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJyZWFjdC1yb3V0ZXItZG9tXCJcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3N0cmluZ2lmeSA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9qc29uL3N0cmluZ2lmeScpO1xuXG52YXIgX3N0cmluZ2lmeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpbmdpZnkpO1xuXG52YXIgX3NsaWNlZFRvQXJyYXkyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3NsaWNlZFRvQXJyYXknKTtcblxudmFyIF9zbGljZWRUb0FycmF5MyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NsaWNlZFRvQXJyYXkyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBJc29tb3JwaGljIENTUyBzdHlsZSBsb2FkZXIgZm9yIFdlYnBhY2tcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNS1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBwcmVmaXggPSAncyc7XG52YXIgaW5zZXJ0ZWQgPSB7fTtcblxuLy8gQmFzZTY0IGVuY29kaW5nIGFuZCBkZWNvZGluZyAtIFRoZSBcIlVuaWNvZGUgUHJvYmxlbVwiXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2luZG93QmFzZTY0L0Jhc2U2NF9lbmNvZGluZ19hbmRfZGVjb2RpbmcjVGhlX1VuaWNvZGVfUHJvYmxlbVxuZnVuY3Rpb24gYjY0RW5jb2RlVW5pY29kZShzdHIpIHtcbiAgcmV0dXJuIGJ0b2EoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvJShbMC05QS1GXXsyfSkvZywgZnVuY3Rpb24gKG1hdGNoLCBwMSkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKCcweCcgKyBwMSk7XG4gIH0pKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgc3R5bGUvbGluayBlbGVtZW50cyBmb3Igc3BlY2lmaWVkIG5vZGUgSURzXG4gKiBpZiB0aGV5IGFyZSBubyBsb25nZXIgcmVmZXJlbmNlZCBieSBVSSBjb21wb25lbnRzLlxuICovXG5mdW5jdGlvbiByZW1vdmVDc3MoaWRzKSB7XG4gIGlkcy5mb3JFYWNoKGZ1bmN0aW9uIChpZCkge1xuICAgIGlmICgtLWluc2VydGVkW2lkXSA8PSAwKSB7XG4gICAgICB2YXIgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByZWZpeCArIGlkKTtcbiAgICAgIGlmIChlbGVtKSB7XG4gICAgICAgIGVsZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIEV4YW1wbGU6XG4gKiAgIC8vIEluc2VydCBDU1Mgc3R5bGVzIG9iamVjdCBnZW5lcmF0ZWQgYnkgYGNzcy1sb2FkZXJgIGludG8gRE9NXG4gKiAgIHZhciByZW1vdmVDc3MgPSBpbnNlcnRDc3MoW1sxLCAnYm9keSB7IGNvbG9yOiByZWQ7IH0nXV0pO1xuICpcbiAqICAgLy8gUmVtb3ZlIGl0IGZyb20gdGhlIERPTVxuICogICByZW1vdmVDc3MoKTtcbiAqL1xuZnVuY3Rpb24gaW5zZXJ0Q3NzKHN0eWxlcykge1xuICB2YXIgX3JlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge30sXG4gICAgICBfcmVmJHJlcGxhY2UgPSBfcmVmLnJlcGxhY2UsXG4gICAgICByZXBsYWNlID0gX3JlZiRyZXBsYWNlID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9yZWYkcmVwbGFjZSxcbiAgICAgIF9yZWYkcHJlcGVuZCA9IF9yZWYucHJlcGVuZCxcbiAgICAgIHByZXBlbmQgPSBfcmVmJHByZXBlbmQgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRwcmVwZW5kO1xuXG4gIHZhciBpZHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgX3N0eWxlcyRpID0gKDAsIF9zbGljZWRUb0FycmF5My5kZWZhdWx0KShzdHlsZXNbaV0sIDQpLFxuICAgICAgICBtb2R1bGVJZCA9IF9zdHlsZXMkaVswXSxcbiAgICAgICAgY3NzID0gX3N0eWxlcyRpWzFdLFxuICAgICAgICBtZWRpYSA9IF9zdHlsZXMkaVsyXSxcbiAgICAgICAgc291cmNlTWFwID0gX3N0eWxlcyRpWzNdO1xuXG4gICAgdmFyIGlkID0gbW9kdWxlSWQgKyAnLScgKyBpO1xuXG4gICAgaWRzLnB1c2goaWQpO1xuXG4gICAgaWYgKGluc2VydGVkW2lkXSkge1xuICAgICAgaWYgKCFyZXBsYWNlKSB7XG4gICAgICAgIGluc2VydGVkW2lkXSsrO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbnNlcnRlZFtpZF0gPSAxO1xuXG4gICAgdmFyIGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcmVmaXggKyBpZCk7XG4gICAgdmFyIGNyZWF0ZSA9IGZhbHNlO1xuXG4gICAgaWYgKCFlbGVtKSB7XG4gICAgICBjcmVhdGUgPSB0cnVlO1xuXG4gICAgICBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJyk7XG4gICAgICBlbGVtLmlkID0gcHJlZml4ICsgaWQ7XG5cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSgnbWVkaWEnLCBtZWRpYSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNzc1RleHQgPSBjc3M7XG4gICAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gc2tpcCBJRTkgYW5kIGJlbG93LCBzZWUgaHR0cDovL2Nhbml1c2UuY29tL2F0b2ItYnRvYVxuICAgICAgY3NzVGV4dCArPSAnXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCwnICsgYjY0RW5jb2RlVW5pY29kZSgoMCwgX3N0cmluZ2lmeTIuZGVmYXVsdCkoc291cmNlTWFwKSkgKyAnKi8nO1xuICAgICAgY3NzVGV4dCArPSAnXFxuLyojIHNvdXJjZVVSTD0nICsgc291cmNlTWFwLmZpbGUgKyAnPycgKyBpZCArICcqLyc7XG4gICAgfVxuXG4gICAgaWYgKCd0ZXh0Q29udGVudCcgaW4gZWxlbSkge1xuICAgICAgZWxlbS50ZXh0Q29udGVudCA9IGNzc1RleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW0uc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzVGV4dDtcbiAgICB9XG5cbiAgICBpZiAoY3JlYXRlKSB7XG4gICAgICBpZiAocHJlcGVuZCkge1xuICAgICAgICBkb2N1bWVudC5oZWFkLmluc2VydEJlZm9yZShlbGVtLCBkb2N1bWVudC5oZWFkLmNoaWxkTm9kZXNbMF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChlbGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVtb3ZlQ3NzLmJpbmQobnVsbCwgaWRzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRDc3M7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvaXNvbW9ycGhpYy1zdHlsZS1sb2FkZXIvbGliL2luc2VydENzcy5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC1yZWR1eFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlYWN0LXJlZHV4XCJcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgcGF0aCA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFNPUlRfUE9TVFMgPSBcIlNPUlRfUE9TVFNcIjtcclxuZXhwb3J0IGNvbnN0IFJFQ0lFVkVfUE9TVFMgPSBcIlJFQ0lFVkVfUE9TVFNcIjtcclxuXHJcbmZ1bmN0aW9uIGZldGNoUG9zdHMgKHVybCwgZGlzcGF0Y2gpe1xyXG4gICAgcmV0dXJuIGZldGNoKHVybClcclxuICAgIC50aGVuKFxyXG4gICAgICAgIHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKS50aGVuKFxyXG4gICAgICAgICAgICBqc29uID0+IGRpc3BhdGNoKHJlY2lldmVQb3N0cyhqc29uKSlcclxuICAgICAgICApXHJcbiAgICApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZldGNoQWRkUG9zdCAodXJsLCBkYXRhLCBkaXNwYXRjaCl7XHJcbiAgICByZXR1cm4gZmV0Y2godXJsLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcclxuICAgIH0pXHJcbiAgICAudGhlbihcclxuICAgICAgICByZXNwb25zZSA9PiBkaXNwYXRjaChnZXRQb3N0cygpKVxyXG4gICAgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBmZXRjaFJlbW92ZVBvc3QgKHVybCwgaWQsIGRpc3BhdGNoKXtcclxuICAgIHJldHVybiBmZXRjaCh1cmwsIHtcclxuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgICAgIGJvZHk6IGlkLFxyXG4gICAgfSlcclxuICAgIC50aGVuKFxyXG4gICAgICAgIHJlc3BvbnNlID0+IGRpc3BhdGNoKGdldFBvc3RzKCkpXHJcbiAgICApXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRQb3N0cyAoKXtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoUG9zdHMoYCR7cGF0aH0vYmxvZ3NgLCBkaXNwYXRjaCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRQb3N0KGRhdGEpe1xyXG4gICAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2hBZGRQb3N0KGAke3BhdGh9L2Jsb2dzYCwgZGF0YSwgZGlzcGF0Y2gpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVQb3N0KGlkKXtcclxuICAgIHJldHVybiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoUmVtb3ZlUG9zdChgJHtwYXRofS9ibG9ncy8ke2lkfWAsIGlkLCBkaXNwYXRjaClcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVjaWV2ZVBvc3RzKHBvc3RzKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IFJFQ0lFVkVfUE9TVFMsXHJcbiAgICBwb3N0c1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRQb3N0KHNvcnRCeSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBTT1JUX1BPU1RTLFxyXG4gICAgc29ydEJ5XHJcbiAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NsaWVudC9hY3Rpb25zL2FjdGlvbnMuanMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWR1eFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlZHV4XCJcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmRlbGV0ZS1idXR0b24tcG9zdHtcXHJcXG4gICAgY29sb3I6IHJnYigyMjMsIDEyOCwgMTI4KTtcXHJcXG4gICAgcGFkZGluZzogNXB4IDEwcHg7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcclxcbiAgICBmb250LXNpemU6IDEycHg7XFxyXFxuICAgIGJvcmRlcjogbm9uZTtcXHJcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcclxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgIHJpZ2h0OiA1cHg7XFxyXFxuICAgIHRvcDogNXB4O1xcclxcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XFxyXFxufVxcclxcblxcclxcbi5wb3N0LWluZm9ybSAuYXV0aG9ye1xcclxcbiAgICBjb2xvcjogcmdiKDE0MCwxNDAsMTQwKTtcXHJcXG59XFxyXFxuXFxyXFxuLnBvc3QtaW5mb3Jte1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIHBhZGRpbmc6IDEwcHggMCA1cHggMDtcXHJcXG59XFxyXFxuXFxyXFxuLnBvc3QtaW5mb3JtIHNwYW46Zmlyc3QtY2hpbGR7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTJweDtcXHJcXG4gICAgd2lkdGg6IDEwMHB4O1xcclxcbiAgICBmb250LXdlaWdodDogYm9sZDtcXHJcXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXHJcXG59XFxyXFxuXFxyXFxuLnRpdGxle1xcclxcbiAgICBtYXgtd2lkdGg6IDI5MHB4O1xcclxcbn1cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyIS4vYXBwL2NsaWVudC9jb21wb25lbnRzL1Bvc3QvcG9zdC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXG4gICAgdmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2NvbnRlbnQuY3NzXCIpO1xuICAgIHZhciBpbnNlcnRDc3MgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9pc29tb3JwaGljLXN0eWxlLWxvYWRlci9saWIvaW5zZXJ0Q3NzLmpzXCIpO1xuXG4gICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHMgfHwge307XG4gICAgbW9kdWxlLmV4cG9ydHMuX2dldENvbnRlbnQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbnRlbnQ7IH07XG4gICAgbW9kdWxlLmV4cG9ydHMuX2dldENzcyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29udGVudC50b1N0cmluZygpOyB9O1xuICAgIG1vZHVsZS5leHBvcnRzLl9pbnNlcnRDc3MgPSBmdW5jdGlvbihvcHRpb25zKSB7IHJldHVybiBpbnNlcnRDc3MoY29udGVudCwgb3B0aW9ucykgfTtcbiAgICBcbiAgICAvLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG4gICAgLy8gaHR0cHM6Ly93ZWJwYWNrLmdpdGh1Yi5pby9kb2NzL2hvdC1tb2R1bGUtcmVwbGFjZW1lbnRcbiAgICAvLyBPbmx5IGFjdGl2YXRlZCBpbiBicm93c2VyIGNvbnRleHRcbiAgICBpZiAobW9kdWxlLmhvdCAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZG9jdW1lbnQpIHtcbiAgICAgIHZhciByZW1vdmVDc3MgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgbW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vY29udGVudC5jc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2NvbnRlbnQuY3NzXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVDc3MgPSBpbnNlcnRDc3MoY29udGVudCwgeyByZXBsYWNlOiB0cnVlIH0pO1xuICAgICAgfSk7XG4gICAgICBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHJlbW92ZUNzcygpOyB9KTtcbiAgICB9XG4gIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9jbGllbnQvY29tcG9uZW50cy9Db250ZW50L2NvbnRlbnQuY3NzIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmNvbnRlbnQge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBmbGV4LXdyYXA6IHdyYXA7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XFxyXFxuICAgIGFsaWduLWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XFxyXFxuICAgIGZsZXg6IDEgMCBhdXRvO1xcclxcbiAgICBwYWRkaW5nOiAwIDEwcHggMjBweCAxMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uY29udGVudC1hZGQtcG9zdHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgZmxleC13cmFwOiB3cmFwO1xcclxcbiAgICBmbGV4OiAxIDAgYXV0bztcXHJcXG4gICAgcGFkZGluZzogMCAxMHB4IDIwcHggMTBweDtcXHJcXG59XFxyXFxuXFxyXFxuLmltYWdlQmxvY2sge1xcclxcbiAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gICAgaGVpZ2h0OiAyMDBweDtcXHJcXG4gICAgd2lkdGg6IDE1MHB4O1xcclxcbn1cXHJcXG5cXHJcXG4ucG9zdGVyIHtcXHJcXG4gICAgcGFkZGluZzogMTBweDtcXHJcXG4gICAgbWFyZ2luOiAxMHB4O1xcclxcbiAgICBmbGV4OiAwIDEgYXV0bztcXHJcXG4gICAgbWFyZ2luLXJpZ2h0OiAyMHB4O1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRjVGNUY1O1xcclxcbiAgICBtYXgtd2lkdGg6IDM1MHB4O1xcclxcbiAgICBtaW4td2lkdGg6IDM1MHB4O1xcclxcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XFxyXFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG59XFxyXFxuXFxyXFxuLm5vdC1mb3VuZC1wb3N0IHtcXHJcXG4gICAgbWFyZ2luOiAwIGF1dG87XFxyXFxuICAgIGZvbnQtc2l6ZTogNDBweDtcXHJcXG4gICAgY29sb3I6IHJnYigyMTAsMjEwLDIxMCk7XFxyXFxuICAgIGFsaWduLXNlbGY6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmNyZWF0ZS1wb3N0LXRpdGxle1xcclxcbiAgICBtYXJnaW46IDIwcHggYXV0bztcXHJcXG59XFxyXFxuXFxyXFxuLmFkZC1wb3N0e1xcclxcbiAgICBtYXJnaW46IDIwcHggYXV0bztcXHJcXG4gICAgd2lkdGg6IDcwJTtcXHJcXG59XFxyXFxuXFxyXFxuLmFkZC1wb3N0ID4gbGFiZWwge1xcclxcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICAgIHBhZGRpbmctbGVmdDogN3B4O1xcclxcbiAgICBjb2xvcjogcmdiKDEwNSwgMTAwLCAxMDApO1xcclxcbiAgICBmb250LXdlaWdodDogYm9sZDtcXHJcXG59XFxyXFxuXFxyXFxuLmFkZC1wb3N0ID4gaW5wdXRbdHlwZT10ZXh0XSwgLmFkZC1wb3N0IHRleHRhcmVhIHtcXHJcXG4gICAgb3V0bGluZTogbm9uZTtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBwYWRkaW5nOiA3cHg7XFxyXFxuICAgIGJvcmRlcjogbm9uZTtcXHJcXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XFxyXFxuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xcclxcbiAgICBmb250OiAxNHB4IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxyXFxuICAgIGhlaWdodDogMzBweDtcXHJcXG59XFxyXFxuXFxyXFxuLmFkZC1wb3N0IHRleHRhcmVhe1xcclxcbiAgICByZXNpemU6bm9uZTtcXHJcXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcXHJcXG59XFxyXFxuXFxyXFxuLmFkZC1wb3N0IGlucHV0W3R5cGU9c3VibWl0XXtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBwYWRkaW5nOiAxMHB4IDIwcHg7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYig5NywgMjQxLCAxNjIpO1xcclxcbiAgICBmb250LXNpemU6IDEycHg7XFxyXFxuICAgIGJvcmRlcjogbm9uZTtcXHJcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcclxcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XFxyXFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gICAgcmlnaHQ6IC04MCU7XFxyXFxuICAgIHdpZHRoOiAyMCU7XFxyXFxuICAgIG1hcmdpbi10b3A6IDE1cHg7XFxyXFxufVwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIhLi9hcHAvY2xpZW50L2NvbXBvbmVudHMvQ29udGVudC9jb250ZW50LmNzc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuc29ydC1wYXJ0e1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICAgIHBhZGRpbmc6IDEwcHggODBweDtcXHJcXG59XFxyXFxuLmNvdW50LXBvc3RzLCAuc29ydC1ieS10aXRsZSwgLnNvcnQtZGlyZWN0b3Ige1xcclxcbiAgICBjb2xvcjogcmdiKDU5LDY4LDc1KTtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTRweDtcXHJcXG4gICAgbWFyZ2luLXRvcDogMnB4O1xcclxcbn1cXHJcXG5cXHJcXG4ucmFkaW9zLWFzLXRleHR7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxufVxcclxcblxcclxcbi5yYWRpb3MtYXMtdGV4dCBpbnB1dHtcXHJcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICBsZWZ0OiAtOTk5OTlweDtcXHJcXG59XFxyXFxuXFxyXFxuLnJhZGlvcy1hcy10ZXh0IGxhYmVsIHtcXHJcXG4gICAgY29sb3I6IHJnYig1OSw2OCw3NSk7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAxMHB4O1xcclxcbiAgICBmb250LXdlaWdodDogYm9sZDtcXHJcXG4gICAgZm9udC1zaXplOiAxNHB4O1xcclxcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxufVxcclxcblxcclxcbi5yYWRpb3MtYXMtdGV4dCBpbnB1dFt0eXBlPXJhZGlvXTpjaGVja2VkIH4gbGFiZWwge1xcclxcbiAgICBjb2xvcjogcmdiKDI1MSwgOTksIDk4KTtcXHJcXG59XFxyXFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlciEuL2FwcC9jbGllbnQvY29tcG9uZW50cy9SZXN1bHRCb3gvcmVzdWx0Qm94LmNzc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmhlYWRlcntcXHJcXG4gICAgZmxleDogMSAwIGF1dG87XFxyXFxufVxcclxcblxcclxcbi5oZWFkZXItcGFydHtcXHJcXG4gICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuICAgei1pbmRleDogNTtcXHJcXG4gICBtaW4taGVpZ2h0OiAxMDBweDtcXHJcXG59XFxyXFxuXFxyXFxuLmhlYWRlci1wYXJ0IC5mb25kLWltYWdlIHtcXHJcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICB6LWluZGV4OiAtMTtcXHJcXG4gICAgdG9wOiAwO1xcclxcbiAgICBib3R0b206IDA7XFxyXFxuICAgIGxlZnQ6IDA7XFxyXFxuICAgIHJpZ2h0OiAwO1xcclxcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXFxcImh0dHA6Ly9xdWJlbWVkaWEubmV0L3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDE1LzA0L2Jvb2stZmlsbS1ob2xpZGF5LmpwZ1xcXCIpO1xcclxcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgICBib3gtc2hhZG93OjAgMCAwIDEyOHB4IHJnYmEoMCwgMCwgMCwgMC4zMykgaW5zZXQ7XFxyXFxufVxcclxcblxcclxcbi5oZWFkZXItcGFydCBoMXtcXHJcXG4gICAgY29sb3I6IHJnYigyNTEsIDk5LCA5OCk7XFxyXFxuICAgIHRleHQtYWxpZ246IGxlZnQ7XFxyXFxuICAgIHBhZGRpbmc6IDQwcHggMCAwIDIwMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4ucmVzdWx0LXBhbmVsIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIzMCwgMjMwLCAyMzApO1xcclxcbiAgICBoZWlnaHQ6IDQwcHg7XFxyXFxufVxcclxcblxcclxcbi5hZGQtYnV0dG9uLXBvc3R7XFxyXFxuICAgIGNvbG9yOiByZ2IoMjUxLCA5OSwgOTgpO1xcclxcbiAgICBwYWRkaW5nOiAxMHB4IDIwcHg7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcclxcbiAgICBmb250LXNpemU6IDEycHg7XFxyXFxuICAgIGJvcmRlcjogbm9uZTtcXHJcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcclxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgIHJpZ2h0OiA2MHB4O1xcclxcbiAgICB0b3A6IDEwcHg7XFxyXFxuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcXHJcXG59XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlciEuL2FwcC9jbGllbnQvY29tcG9uZW50cy9IZWFkZXIvaGVhZGVyLmNzc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmZvb3RlciB7XFxyXFxuICAgIGZsZXg6IDAgMCBhdXRvO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoNTksNjgsNzUpO1xcclxcbn1cXHJcXG5cXHJcXG4uZm9vdGVyIGg0IHtcXHJcXG4gICAgY29sb3I6IHJnYigyNTEsIDk5LCA5OCk7XFxyXFxuICAgIHRleHQtYWxpZ246IGxlZnQ7XFxyXFxuICAgIHBhZGRpbmc6IDIwcHggMCAyMHB4IDQwcHg7XFxyXFxufVwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIhLi9hcHAvY2xpZW50L2NvbXBvbmVudHMvRm9vdGVyL2Zvb3Rlci5jc3Ncbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIioge1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxufVxcclxcbmh0bWwsXFxyXFxuYm9keSB7XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuI2FwcHtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG4ud3JhcHBlciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG4gICAgd2lkdGg6IDg1MHB4O1xcclxcbiAgICBtYXJnaW46IDAgYXV0bztcXHJcXG4gICAgZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmO1xcclxcbn1cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyIS4vYXBwL2NsaWVudC9zcGEvYXBwLmNzc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFBvc3QgZnJvbSAnLi4vUG9zdC9Qb3N0JztcclxuaW1wb3J0IHt3aXRoUm91dGVyfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7Z2V0UG9zdHN9IGZyb20gXCIuLi8uLi9hY3Rpb25zL2FjdGlvbnNcIjtcclxuaW1wb3J0IHN0eWxlcyBmcm9tJy4vY29udGVudC5jc3MnO1xyXG4gXHJcblxyXG4vLyBjb25zdCBCbG9nQVBJID0ge1xyXG4vLyAgICAgcG9zdHM6IFtcclxuLy8gICAgICAgICB7bnVtYmVyOiAxLCB0aXRsZTogXCJCZW4gQmxvY2tlclwiLCBkZXNjcmlwdGlvbjogXCJDb21lZGllcyBDb21lZGllcyBDb21lZGllcyBDb21lZGllc1wiLCByZWxlYXNlRGF0ZTogXCIyMDE0XCIsIGF1dGhvcjogXCJRdWVudGluIFRhcmFudGlub1wifSxcclxuLy8gICAgICAgICB7bnVtYmVyOiAyLCB0aXRsZTogXCJEYXZlIERlZmVuZFwiLCBkZXNjcmlwdGlvbjogXCJEcmFtYXMgRHJhbWFzIERyYW1hcyBEcmFtYXMgRHJhbWFzXCIsIHJlbGVhc2VEYXRlOiBcIjIwMTVcIiwgYXV0aG9yOiBcIlF1ZW50aW4gVGFyYW50aW5vXCJ9LFxyXG4vLyAgICAgICAgIHtudW1iZXI6IDMsIHRpdGxlOiBcIlNhbSBTd2VlcGVyXCIsIGRlc2NyaXB0aW9uOiBcIkRyYW1hcyBEcmFtYXMgRHJhbWFzIERyYW1hcyBEcmFtYXMgRHJhbWFzXCIsIHJlbGVhc2VEYXRlOiBcIjIwMTRcIiwgYXV0aG9yOiBcIlF1ZW50aW4gVGFyYW50aW5vXCJ9LFxyXG4vLyAgICAgICAgIHtudW1iZXI6IDQsIHRpdGxlOiBcIk1hdHQgTWlkZmllbFwiLCBkZXNjcmlwdGlvbjogXCJUaHJpbGxlciBUaHJpbGxlciBUaHJpbGxlciBUaHJpbGxlciBUaHJpbGxlclwiLCByZWxlYXNlRGF0ZTogXCIyMDE1XCIsIGF1dGhvcjogXCJCaWcgRGVhbGFuXCJ9LFxyXG4vLyAgICAgICAgIHtudW1iZXI6IDUsIHRpdGxlOiBcIldpbGwgV2luZ2VyXCIsIGRlc2NyaXB0aW9uOiBcIlRocmlsbGVyIFRocmlsbGVyIFRocmlsbGVyIFRocmlsbGVyIFRocmlsbGVyXCIsIHJlbGVhc2VEYXRlOiBcIjIwMTRcIiwgYXV0aG9yOiBcIkJpZyBEZWFsYW5cIn0sXHJcbi8vICAgICAgICAge251bWJlcjogNiwgdGl0bGU6IFwiRmlsbGlwZSBGb3J3XCIsIGRlc2NyaXB0aW9uOiBcIkNvbWVkaWVzIENvbWVkaWVzIENvbWVkaWVzIENvbWVkaWVzXCIsIHJlbGVhc2VEYXRlOiBcIjIwMTZcIiwgYXV0aG9yOiBcIkJpZyBEZWFsYW5cIn0sXHJcbi8vICAgICAgICAge251bWJlcjogNywgdGl0bGU6IFwiV2lsbGlhbSBXaW5cIiwgZGVzY3JpcHRpb246IFwiVGhyaWxsZXIgVGhyaWxsZXIgVGhyaWxsZXIgVGhyaWxsZXIgVGhyaWxsZXJcIiwgcmVsZWFzZURhdGU6IFwiMjAxN1wiLCBhdXRob3I6IFwiR3ZpbmV0IFBhbHRyb3VcIn0sXHJcbi8vICAgICAgICAge251bWJlcjogOCwgdGl0bGU6IFwiRmlsIEZvcndhcmRcIiwgZGVzY3JpcHRpb246IFwiQ29tZWRpZXMgQ29tZWRpZXMgQ29tZWRpZXMgQ29tZWRpZXNcIiwgcmVsZWFzZURhdGU6IFwiMjAxNlwiLCBhdXRob3I6IFwiR3ZpbmV0IFBhbHRyb3VcIn1cclxuLy8gICAgIF0sXHJcbi8vICAgICBhbGw6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5wb3N0c30sXHJcbi8vICAgICBnZXQ6IGZ1bmN0aW9uKGlkKSB7XHJcbi8vICAgICAgICAgY29uc3QgaXNQb3N0ID0gcCA9PiBwLm51bWJlciA9PT0gaWQ7XHJcbi8vICAgICAgICAgcmV0dXJuIHRoaXMucG9zdHMuZmluZChpc1Bvc3QpXHJcbi8vICAgICB9XHJcbi8vIH07XHJcblxyXG5jbGFzcyBDb250ZW50UG9zdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcyl7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCl7XHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0UG9zdHMoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0UG9zdHMoKXtcclxuICAgICAgICB0aGlzLnByb3BzLmZldGNoUG9zdHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBzb3J0UG9zdHNCeSAoc29ydEJ5LCBwb3N0cyl7XHJcbiAgICAgICAgaWYoc29ydEJ5ID09PSBcInJlbGVhc2VEYXRlXCIpIHtcclxuICAgICAgICAgICAgcG9zdHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbUEgPSBhLnJlbGVhc2VEYXRlIHx8ICcwJztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1CID0gYi5yZWxlYXNlRGF0ZSB8fCAnMCc7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbUIucmVwbGFjZSgvLS9nLCAnJylcclxuICAgICAgICAgICAgICAgICAgICAtIGl0ZW1BLnJlcGxhY2UoLy0vZywgJycpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHBvc3RzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhLmF1dGhvci5sb2NhbGVDb21wYXJlKGIuYXV0aG9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwb3N0cztcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnByb3BzLnN0YXRlKTtcclxuICAgICAgICBsZXQgcG9zdHMgPSB0aGlzLnNvcnRQb3N0c0J5KHRoaXMucHJvcHMuc29ydEJ5LCB0aGlzLnByb3BzLnBvc3RzKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3N0cy5tYXAocCA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxQb3N0IGluZm89e3B9IGtleT17cC5pZH0gLz5cclxuICAgICAgICAgICAgICAgICAgICApKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBmdW5jdGlvbihzdG9yZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwb3N0czogc3RvcmUuc3RvcmVQb3N0cy5wb3N0cyxcclxuICAgICAgICBzb3J0Qnk6IHN0b3JlLnN0b3JlUG9zdHMuc29ydEJ5LCBcclxuICAgIH07XHJcbn07XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZldGNoUG9zdHM6ICgpID0+IHtcclxuICAgICAgICAgIGRpc3BhdGNoKGdldFBvc3RzKCkpXHJcbiAgICAgIH1cclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB3aXRoUm91dGVyKGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLG1hcERpc3BhdGNoVG9Qcm9wcykoQ29udGVudFBvc3QpKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvY2xpZW50L2NvbXBvbmVudHMvQ29udGVudC9Db250ZW50UG9zdC5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBzdHlsZXMgZnJvbSAnLi9wb3N0LmNzcyc7XHJcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyByZW1vdmVQb3N0IH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvYWN0aW9uc1wiO1xyXG5pbXBvcnQge3dpdGhSb3V0ZXJ9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSdcclxuXHJcbmNsYXNzIFBvc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnR7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcyl7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICBjb25zdCBpbmZvID0gdGhpcy5wcm9wcy5pbmZvO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxhcnRpY2xlIGNsYXNzTmFtZT1cInBvc3RlclwiPlxyXG4gICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRpdGxlXCI+e2luZm8udGl0bGV9PC9oMz5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJEZWxldGVcIiBjbGFzc05hbWU9XCJkZWxldGUtYnV0dG9uLXBvc3RcIiBcclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHt0aGlzLnByb3BzLmZldGNoUmVtb3ZlUG9zdHMoaW5mby5pZCl9fS8+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPntpbmZvLmRlc2NyaXB0aW9ufTwvcD5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicG9zdC1pbmZvcm1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkYXRhXCI+e2luZm8ucmVsZWFzZURhdGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImF1dGhvclwiPntpbmZvLmF1dGhvcn08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZmV0Y2hSZW1vdmVQb3N0czogKGlkKSA9PiB7XHJcbiAgICAgICAgICBkaXNwYXRjaChyZW1vdmVQb3N0KGlkKSlcclxuICAgICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdpdGhSb3V0ZXIoY29ubmVjdChudWxsLG1hcERpc3BhdGNoVG9Qcm9wcykoUG9zdCkpOztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NsaWVudC9jb21wb25lbnRzL1Bvc3QvUG9zdC5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBQb3N0IGZyb20gJy4uL1Bvc3QvUG9zdCc7XHJcbmltcG9ydCB7d2l0aFJvdXRlcn0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBhZGRQb3N0IH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvYWN0aW9uc1wiO1xyXG5pbXBvcnQgc3R5bGVzIGZyb20nLi9jb250ZW50LmNzcyc7XHJcbiBcclxuXHJcbmNsYXNzIENvbnRlbnRBZGRQb3N0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50e1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKXtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBudWxsLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogbnVsbCxcclxuICAgICAgICAgICAgYXV0aG9yOiBudWxsLFxyXG4gICAgICAgICAgICByZWxlYXNlRGF0ZTogbnVsbFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5vblN1Ym1pdCA9IHRoaXMub25TdWJtaXQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gdGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkanVzdF90ZXh0YXJlYShoKSB7XHJcbiAgICAgICAgaC5zdHlsZS5oZWlnaHQgPSBcIjIwcHhcIjtcclxuICAgICAgICBoLnN0eWxlLmhlaWdodCA9IChoLnNjcm9sbEhlaWdodCkrXCJweFwiO1xyXG4gICAgfVxyXG5cclxuICAgIG9uU3VibWl0IChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xyXG4gICAgICAgIHRoaXMucHJvcHMuZmV0Y2hBZGRQb3N0KHRoaXMuc3RhdGUpO1xyXG4gICAgICAgIHRoaXMucHJvcHMuaGlzdG9yeS5wdXNoKFwiL1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkNoYW5nZSAoZSkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0YXJnZXQubmFtZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgW25hbWVdOiB2YWx1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpe1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudC1hZGQtcG9zdFwiPlxyXG4gICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImNyZWF0ZS1wb3N0LXRpdGxlXCI+IENyZWF0ZSB5b3VyIG5ldyBwb3N0PC9oMj5cclxuICAgICAgICAgICAgICAgIDxmb3JtICBjbGFzc05hbWU9XCJhZGQtcG9zdFwiIG9uU3VibWl0PXt0aGlzLm9uU3VibWl0fT5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInRpdGxlXCI+RW50ZXIgdGl0bGUgb2YgdGhlIG5ldyBwb3N0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInRpdGxlXCIgdHlwZT1cInRleHRcIiBpZD1cInRpdGxlXCIgcGxhY2Vob2xkZXI9XCJUaXRsZS4uXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJkZXNjcmlwdGlvblwiPkVudGVyIGRlc2NyaXB0aW9uIG9mIHRoZSBuZXcgcG9zdDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJkZXNjcmlwdGlvblwiIGlkPVwiZGVzY3JpcHRpb25cIiBwbGFjZWhvbGRlcj1cIkRlc2NyaXB0aW9uLi5cIiBcclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX0vPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiYXV0aG9yXCI+RW50ZXIgeW91ciBuYW1lPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImF1dGhvclwiIHR5cGU9XCJ0ZXh0XCIgaWQ9XCJhdXRob3JcIiBwbGFjZWhvbGRlcj1cIllvdXIgbmFtZS4uXCJcclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX0vPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwicmVsZWFzZURhdGVcIj5FbnRlciBkYXRlPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInJlbGVhc2VEYXRlXCIgdHlwZT1cInRleHRcIiBpZD1cInJlbGVhc2VEYXRlXCIgcGxhY2Vob2xkZXI9XCJDaG9vc2VuIGRhdGUuLlwiXHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9Lz5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiU3VibWl0XCIgLz5cclxuICAgICAgICAgICAgICAgIDwvZm9ybT4gICAgXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZmV0Y2hBZGRQb3N0OiAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgZGlzcGF0Y2goYWRkUG9zdChkYXRhKSlcclxuICAgICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdpdGhSb3V0ZXIoY29ubmVjdChudWxsLCBtYXBEaXNwYXRjaFRvUHJvcHMpKENvbnRlbnRBZGRQb3N0KSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NsaWVudC9jb21wb25lbnRzL0NvbnRlbnQvQ29udGVudEFkZFBvc3QuanMiLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBoYW5kbGVSZW5kZXIgZnJvbSAnLi9hcHAvc2VydmVyL2hhbmRsZVJhbmRlcidcclxuXHJcbmNvbnN0IFBPUlQgPSA3NzAwO1xyXG5jb25zdCBQVUJMSUNfUEFUSCA9ICcuJztcclxuXHJcbnZhciBhcHAgPSBleHByZXNzKCk7XHJcblxyXG5hcHAudXNlKGV4cHJlc3Muc3RhdGljKFBVQkxJQ19QQVRIKSk7XHJcblxyXG5hcHAudXNlKGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xyXG4gICAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcclxuICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULCBQT1NULCBPUFRJT05TLCBQVVQsIFBBVENILCBERUxFVEUnKTtcclxuICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnWC1SZXF1ZXN0ZWQtV2l0aCxjb250ZW50LXR5cGUnKTtcclxuICAgIHJlcy5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzJywgdHJ1ZSk7XHJcblxyXG4gICAgbmV4dCgpO1xyXG59KTtcclxuXHJcbi8vIFNlcnZlIHJlcXVlc3RzIHdpdGggb3VyIGhhbmRsZVJlbmRlciBmdW5jdGlvblxyXG5hcHAuZ2V0KCcqJywgaGFuZGxlUmVuZGVyKTtcclxuXHJcbmFwcC5saXN0ZW4oUE9SVCwgZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZygnTGlzdGVuaW5nIG9uIHBvcnQgJyArIFBPUlQgKyAnLi4uJyk7XHJcbn0pO1xyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2VydmVyLmpzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImV4cHJlc3NcIlxuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhdGhcIlxuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmltcG9ydCB7IHJlbmRlclRvU3RyaW5nIH0gZnJvbSAncmVhY3QtZG9tL3NlcnZlcic7XHJcbmltcG9ydCB7IFN0YXRpY1JvdXRlciB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xyXG5pbXBvcnQgeyBtYXRjaFJvdXRlcyB9IGZyb20gJ3JlYWN0LXJvdXRlci1jb25maWcnO1xyXG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IGNvbmZpZ3VyZVN0b3JlIGZyb20gXCIuLi9jbGllbnQvc3RvcmVcIjtcclxuaW1wb3J0ICdpc29tb3JwaGljLWZldGNoJztcclxuXHJcbmltcG9ydCByb3V0ZXMgZnJvbSAnLi4vY2xpZW50L3JvdXRlcyc7XHJcbmltcG9ydCBBcHAgZnJvbSAnLi4vY2xpZW50L3NwYS9BcHAnO1xyXG5cclxuZnVuY3Rpb24gcmVuZGVyUGFnZShyZW5kZXJlZEFwcCwgcHJlbG9hZGVkU3RhdGUpIHtcclxuICAgIGNvbnN0IGFwcERhdGEgPSBgPCFET0NUWVBFIGh0bWw+XHJcbiAgICA8aHRtbCBsYW5nPVwiZW5cIj5cclxuICAgIDxoZWFkPlxyXG4gICAgICAgIDxtZXRhIGNoYXJzZXQ9XCJVVEYtOFwiPlxyXG4gICAgICAgIDx0aXRsZT5TUEE8L3RpdGxlPlxyXG4gICAgPC9oZWFkPlxyXG4gICAgPGJvZHk+XHJcbiAgICA8ZGl2IGlkPVwiYXBwXCI+JHtyZW5kZXJlZEFwcH08L2Rpdj5cclxuICAgIDxzY3JpcHQ+XHJcbiAgICAgICAgd2luZG93LlBSRUxPQURFRF9TVEFURSA9ICR7SlNPTi5zdHJpbmdpZnkocHJlbG9hZGVkU3RhdGUpLnJlcGxhY2UoLzwvZywgJ1xcXFx1MDAzYycpfVxyXG4gICAgPC9zY3JpcHQ+XHJcbiAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCIuL3B1YmxpYy9idW5kbGUuanNcIj48L3NjcmlwdD5cclxuICAgIDwvYm9keT5cclxuICAgIDwvaHRtbD5gXHJcblxyXG4gICAgcmV0dXJuIGFwcERhdGE7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhhbmRsZVJlbmRlcihyZXEsIHJlcykge1xyXG4gICAgLy8gY29uc3QgY3NzID0gbmV3IFNldCgpOyAvLyBDU1MgZm9yIGFsbCByZW5kZXJlZCBSZWFjdCBjb21wb25lbnRzXHJcbiAgICAvLyBjb25zdCBjb250ZXh0ID0geyBpbnNlcnRDc3M6ICguLi5zdHlsZXMpID0+IHN0eWxlcy5mb3JFYWNoKHN0eWxlID0+IGNzcy5hZGQoc3R5bGUuX2dldENzcygpKSkgfTtcclxuICAgIGNvbnN0IGNvbnRleHQgPSB7fTtcclxuICAgIGNvbnN0IHN0b3JlID0gY29uZmlndXJlU3RvcmUoKTtcclxuICAgIGNvbnN0IGJyYW5jaCA9IG1hdGNoUm91dGVzKHJvdXRlcywgcmVxLnVybCk7XHJcbiAgICBjb25zdCBwcm9taXNlQWxsID0gYnJhbmNoLm1hcCgoeyByb3V0ZSwgbWF0Y2ggfSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgZmV0Y2hEYXRhIH0gPSByb3V0ZS5jb21wb25lbnQ7XHJcbiAgICAgICAgaWYgKCEoZmV0Y2hEYXRhIGluc3RhbmNlb2YgRnVuY3Rpb24pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmZXRjaERhdGEoc3RvcmUuZGlzcGF0Y2gsIG1hdGNoKTtcclxuICAgIH0pO1xyXG4gICAgUHJvbWlzZS5hbGwocHJvbWlzZUFsbClcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFwcCA9IChcclxuICAgICAgICAgICAgICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxTdGF0aWNSb3V0ZXIgbG9jYXRpb249e3JlcS51cmx9IGNvbnRleHQ9e2NvbnRleHR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QXBwIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9TdGF0aWNSb3V0ZXI+XHJcbiAgICAgICAgICAgICAgICA8L1Byb3ZpZGVyPlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBjb25zdCByZW5kZXJlZEFwcCA9IHJlbmRlclRvU3RyaW5nKGFwcCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGV4dC51cmwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMucmVkaXJlY3QoY29udGV4dC51cmwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwcmVsb2FkZWRTdGF0ZSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnNlbmQocmVuZGVyUGFnZShyZW5kZXJlZEFwcCwgcHJlbG9hZGVkU3RhdGUpKTtcclxuICAgICAgICB9KTtcclxuXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvc2VydmVyL2hhbmRsZVJhbmRlci5qcyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0LWRvbS9zZXJ2ZXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJyZWFjdC1kb20vc2VydmVyXCJcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0LXJvdXRlci1jb25maWdcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJyZWFjdC1yb3V0ZXItY29uZmlnXCJcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGFwcGx5TWlkZGxld2FyZSwgY3JlYXRlU3RvcmUgfSAgZnJvbSBcInJlZHV4XCI7XHJcbmltcG9ydCB0aHVuayBmcm9tIFwicmVkdXgtdGh1bmtcIjtcclxuaW1wb3J0IHtyb290UmVkdWNlcn0gZnJvbSBcIi4vcmVkdWNlcnMvaW5kZXhcIjtcclxuXHJcbmNvbnN0IG1pZGRsZXdhcmUgPSBhcHBseU1pZGRsZXdhcmUodGh1bmspO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKGluaXRpYWxTdGF0ZSkgPT4ge1xyXG4gICAgcmV0dXJuIGNyZWF0ZVN0b3JlKHJvb3RSZWR1Y2VyLCBpbml0aWFsU3RhdGUsIG1pZGRsZXdhcmUpXHJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NsaWVudC9zdG9yZS5qcyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZHV4LXRodW5rXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicmVkdXgtdGh1bmtcIlxuLy8gbW9kdWxlIGlkID0gMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtjb21iaW5lUmVkdWNlcnN9IGZyb20gXCJyZWR1eFwiO1xyXG5cclxuaW1wb3J0IHVzZXJSZWR1Y2VyIGZyb20gXCIuL3VzZXJSZWR1Y2VyXCI7XHJcbmltcG9ydCBwb3N0c1JlZHVjZXIgZnJvbSBcIi4vcG9zdHNSZWR1Y2VyXCI7XHJcblxyXG5jb25zb2xlLmxvZyh1c2VyUmVkdWNlcik7XHJcbmNvbnNvbGUubG9nKHBvc3RzUmVkdWNlcik7XHJcblxyXG5leHBvcnQgY29uc3Qgcm9vdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgc3RvcmVVc2VyOiB1c2VyUmVkdWNlcixcclxuICAgIHN0b3JlUG9zdHM6IHBvc3RzUmVkdWNlclxyXG59KTtcclxuXHJcblxyXG5cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9jbGllbnQvcmVkdWNlcnMvaW5kZXguanMiLCIvLyBpbXBvcnQge1xyXG5cclxuLy8gfSBmcm9tICcuLi9hY3Rpb25zL2FjdGlvbnMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlPXtcclxuICAgIHVzZXJzUG9zdDogW11cclxufSwgYWN0aW9uKXtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpe1xyXG4gICAgICAgIGRlZmF1bHQ6IHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9jbGllbnQvcmVkdWNlcnMvdXNlclJlZHVjZXIuanMiLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuaW1wb3J0IHtcclxuICBTT1JUX1BPU1RTLCBSRUNJRVZFX1BPU1RTXHJcbn0gZnJvbSAnLi4vYWN0aW9ucy9hY3Rpb25zJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZT17XHJcbiAgICBwb3N0czogW10sXHJcbiAgICBzb3J0Qnk6ICdyZWxlYXNlRGF0ZScsXHJcbn0sIGFjdGlvbil7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSl7XHJcbiAgICAgIGNhc2UgUkVDSUVWRV9QT1NUUzoge1xyXG4gICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IHBvc3RzOiBhY3Rpb24ucG9zdHMgfSk7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSBTT1JUX1BPU1RTOiB7XHJcbiAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IHNvcnRCeTogYWN0aW9uLnNvcnRCeSB9KTtcclxuICAgICAgfVxyXG4gICAgICBkZWZhdWx0OiByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NsaWVudC9yZWR1Y2Vycy9wb3N0c1JlZHVjZXIuanMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJpc29tb3JwaGljLWZldGNoXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiaXNvbW9ycGhpYy1mZXRjaFwiXG4vLyBtb2R1bGUgaWQgPSAyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgQ29udGVudFBvc3QgZnJvbSAnLi9jb21wb25lbnRzL0NvbnRlbnQvQ29udGVudFBvc3QnO1xyXG5pbXBvcnQgQ29udGVudEFkZFBvc3QgZnJvbSAnLi9jb21wb25lbnRzL0NvbnRlbnQvQ29udGVudEFkZFBvc3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgW1xyXG4gIHtcclxuICAgIHBhdGg6ICcvJyxcclxuICAgIGNvbXBvbmVudDogQ29udGVudFBvc3RcclxuICB9LFxyXG4gIHtcclxuICAgIHBhdGg6ICcvYWRkJyxcclxuICAgIGNvbXBvbmVudDogQ29udGVudEFkZFBvc3RcclxuICB9LFxyXG5dXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NsaWVudC9yb3V0ZXMuanMiLCJcbiAgICB2YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vcG9zdC5jc3NcIik7XG4gICAgdmFyIGluc2VydENzcyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2lzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi9pbnNlcnRDc3MuanNcIik7XG5cbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscyB8fCB7fTtcbiAgICBtb2R1bGUuZXhwb3J0cy5fZ2V0Q29udGVudCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29udGVudDsgfTtcbiAgICBtb2R1bGUuZXhwb3J0cy5fZ2V0Q3NzID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb250ZW50LnRvU3RyaW5nKCk7IH07XG4gICAgbW9kdWxlLmV4cG9ydHMuX2luc2VydENzcyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHsgcmV0dXJuIGluc2VydENzcyhjb250ZW50LCBvcHRpb25zKSB9O1xuICAgIFxuICAgIC8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbiAgICAvLyBodHRwczovL3dlYnBhY2suZ2l0aHViLmlvL2RvY3MvaG90LW1vZHVsZS1yZXBsYWNlbWVudFxuICAgIC8vIE9ubHkgYWN0aXZhdGVkIGluIGJyb3dzZXIgY29udGV4dFxuICAgIGlmIChtb2R1bGUuaG90ICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5kb2N1bWVudCkge1xuICAgICAgdmFyIHJlbW92ZUNzcyA9IGZ1bmN0aW9uKCkge307XG4gICAgICBtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9wb3N0LmNzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vcG9zdC5jc3NcIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUNzcyA9IGluc2VydENzcyhjb250ZW50LCB7IHJlcGxhY2U6IHRydWUgfSk7XG4gICAgICB9KTtcbiAgICAgIG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgcmVtb3ZlQ3NzKCk7IH0pO1xuICAgIH1cbiAgXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NsaWVudC9jb21wb25lbnRzL1Bvc3QvcG9zdC5jc3MiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnlcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnlcIlxuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL3NsaWNlZFRvQXJyYXlcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheVwiXG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4uL2NvbXBvbmVudHMvSGVhZGVyL0hlYWRlcic7XHJcbmltcG9ydCBDb250ZW50IGZyb20gJy4uL2NvbXBvbmVudHMvQ29udGVudC9Db250ZW50JztcclxuaW1wb3J0IEZvb3RlciBmcm9tICcuLi9jb21wb25lbnRzL0Zvb3Rlci9Gb290ZXInO1xyXG5pbXBvcnQgJy4vYXBwLmNzcyc7XHJcblxyXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnR7XHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndyYXBwZXJcIj5cclxuICAgICAgICAgICAgICAgIDxIZWFkZXIvPlxyXG4gICAgICAgICAgICAgICAgPENvbnRlbnQvPlxyXG4gICAgICAgICAgICAgICAgPEZvb3Rlci8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFwcDtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NsaWVudC9zcGEvQXBwLmpzIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBTd2l0Y2gsIFJvdXRlLCBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSdcclxuaW1wb3J0IFJlc3VsdFNvcnRCb3ggZnJvbSAnLi4vUmVzdWx0Qm94L1Jlc3VsdFNvcnRCb3gnO1xyXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vaGVhZGVyLmNzcyc7XHJcblxyXG5cclxuY2xhc3MgSGVhZGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50e1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpe1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8aGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlci1wYXJ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9uZC1pbWFnZVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZWVwIGNhbG0gYW5kIGFkZCBuZXcgcG9zdDspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtgL2FkZGB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIkFERFwiIGNsYXNzTmFtZT1cImFkZC1idXR0b24tcG9zdFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzdWx0LXBhbmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxSZXN1bHRTb3J0Qm94Lz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2hlYWRlcj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIZWFkZXI7XHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NsaWVudC9jb21wb25lbnRzL0hlYWRlci9IZWFkZXIuanMiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHtzb3J0UG9zdH0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvYWN0aW9uc1wiO1xyXG5pbXBvcnQgJy4vcmVzdWx0Qm94LmNzcyc7XHJcblxyXG5jbGFzcyBSZXN1bHRTb3J0Qm94IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50e1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpe1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBzZWxlY3RlZFNvcnQ6ICdyZWxlYXNlRGF0ZSdcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpe1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic29ydC1wYXJ0XCI+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjb3VudC1wb3N0c1wiPnt0aGlzLnByb3BzLmNvdW50UG9zdHMgP1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY291bnRQb3N0cyA9PT0gMSA/IFwiT25seSBvbmUgcG9zdCBmb3VuZFwiIDogdGhpcy5wcm9wcy5jb3VudFBvc3RzICsgXCIgcG9zdHMgZm91bmRcIlxyXG4gICAgICAgICAgICAgICAgICAgIDogXCJObyBwb3N0cyBmb3VuZFwifTwvcD5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmFkaW9zLWFzLXRleHRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJzb3J0LWJ5LXRpdGxlXCI+U29ydCBieTwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNvcnRCeVwiIGlkPVwicmVsZWFzZURhdGVcIiBjaGVja2VkPXt0aGlzLnByb3BzLnNlbGVjdGVkU29ydD09PSdyZWxlYXNlRGF0ZSd9IG9uQ2hhbmdlPXt0aGlzLnByb3BzLmhhbmRsZVNvcnRDaGFuZ2V9Lz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJyZWxlYXNlRGF0ZVwiPnJlbGVhc2UgZGF0YTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzb3J0QnlcIiBpZD1cImF1dGhvclwiIGNoZWNrZWQ9e3RoaXMucHJvcHMuc2VsZWN0ZWRTb3J0PT09J2F1dGhvcid9IG9uQ2hhbmdlPXt0aGlzLnByb3BzLmhhbmRsZVNvcnRDaGFuZ2V9Lz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhdXRob3JcIj5hdXRob3I8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBmdW5jdGlvbihzdG9yZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjb3VudFBvc3RzOiBzdG9yZS5zdG9yZVBvc3RzLnBvc3RzLmxlbmd0aCxcclxuICAgICAgICBzZWxlY3RlZFNvcnQ6IHN0b3JlLnN0b3JlUG9zdHMuc29ydEJ5XHJcbiAgICB9O1xyXG59O1xyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGhhbmRsZVNvcnRDaGFuZ2U6IChjaGFuZ2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBkaXNwYXRjaChzb3J0UG9zdChjaGFuZ2VFdmVudC50YXJnZXQuaWQpKVxyXG5cclxuICAgICAgICB9LFxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsbWFwRGlzcGF0Y2hUb1Byb3BzKShSZXN1bHRTb3J0Qm94KTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NsaWVudC9jb21wb25lbnRzL1Jlc3VsdEJveC9SZXN1bHRTb3J0Qm94LmpzIiwiXG4gICAgdmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3Jlc3VsdEJveC5jc3NcIik7XG4gICAgdmFyIGluc2VydENzcyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2lzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi9pbnNlcnRDc3MuanNcIik7XG5cbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscyB8fCB7fTtcbiAgICBtb2R1bGUuZXhwb3J0cy5fZ2V0Q29udGVudCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29udGVudDsgfTtcbiAgICBtb2R1bGUuZXhwb3J0cy5fZ2V0Q3NzID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb250ZW50LnRvU3RyaW5nKCk7IH07XG4gICAgbW9kdWxlLmV4cG9ydHMuX2luc2VydENzcyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHsgcmV0dXJuIGluc2VydENzcyhjb250ZW50LCBvcHRpb25zKSB9O1xuICAgIFxuICAgIC8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbiAgICAvLyBodHRwczovL3dlYnBhY2suZ2l0aHViLmlvL2RvY3MvaG90LW1vZHVsZS1yZXBsYWNlbWVudFxuICAgIC8vIE9ubHkgYWN0aXZhdGVkIGluIGJyb3dzZXIgY29udGV4dFxuICAgIGlmIChtb2R1bGUuaG90ICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5kb2N1bWVudCkge1xuICAgICAgdmFyIHJlbW92ZUNzcyA9IGZ1bmN0aW9uKCkge307XG4gICAgICBtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9yZXN1bHRCb3guY3NzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9yZXN1bHRCb3guY3NzXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVDc3MgPSBpbnNlcnRDc3MoY29udGVudCwgeyByZXBsYWNlOiB0cnVlIH0pO1xuICAgICAgfSk7XG4gICAgICBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHJlbW92ZUNzcygpOyB9KTtcbiAgICB9XG4gIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9jbGllbnQvY29tcG9uZW50cy9SZXN1bHRCb3gvcmVzdWx0Qm94LmNzcyIsIlxuICAgIHZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9oZWFkZXIuY3NzXCIpO1xuICAgIHZhciBpbnNlcnRDc3MgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9pc29tb3JwaGljLXN0eWxlLWxvYWRlci9saWIvaW5zZXJ0Q3NzLmpzXCIpO1xuXG4gICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHMgfHwge307XG4gICAgbW9kdWxlLmV4cG9ydHMuX2dldENvbnRlbnQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbnRlbnQ7IH07XG4gICAgbW9kdWxlLmV4cG9ydHMuX2dldENzcyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29udGVudC50b1N0cmluZygpOyB9O1xuICAgIG1vZHVsZS5leHBvcnRzLl9pbnNlcnRDc3MgPSBmdW5jdGlvbihvcHRpb25zKSB7IHJldHVybiBpbnNlcnRDc3MoY29udGVudCwgb3B0aW9ucykgfTtcbiAgICBcbiAgICAvLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG4gICAgLy8gaHR0cHM6Ly93ZWJwYWNrLmdpdGh1Yi5pby9kb2NzL2hvdC1tb2R1bGUtcmVwbGFjZW1lbnRcbiAgICAvLyBPbmx5IGFjdGl2YXRlZCBpbiBicm93c2VyIGNvbnRleHRcbiAgICBpZiAobW9kdWxlLmhvdCAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZG9jdW1lbnQpIHtcbiAgICAgIHZhciByZW1vdmVDc3MgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgbW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vaGVhZGVyLmNzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vaGVhZGVyLmNzc1wiKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlQ3NzID0gaW5zZXJ0Q3NzKGNvbnRlbnQsIHsgcmVwbGFjZTogdHJ1ZSB9KTtcbiAgICAgIH0pO1xuICAgICAgbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyByZW1vdmVDc3MoKTsgfSk7XG4gICAgfVxuICBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvY2xpZW50L2NvbXBvbmVudHMvSGVhZGVyL2hlYWRlci5jc3MiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IFN3aXRjaCwgUm91dGUgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJ1xyXG5pbXBvcnQgTm90Rm91bmQgZnJvbSAnLi9Ob3RGb3VuZCdcclxuaW1wb3J0IENvbnRlbnRQb3N0IGZyb20gJy4vQ29udGVudFBvc3QnXHJcbmltcG9ydCBDb250ZW50QWRkUG9zdCBmcm9tICcuL0NvbnRlbnRBZGRQb3N0J1xyXG5cclxuY29uc3QgQ29udGVudCA9ICgpID0+IChcclxuICAgICAgICA8U3dpdGNoPlxyXG4gICAgICAgICAgICA8Um91dGUgcGF0aD0nL2FkZCcgY29tcG9uZW50PXtDb250ZW50QWRkUG9zdH0vPlxyXG4gICAgICAgICAgICA8Um91dGUgcGF0aD0nLycgY29tcG9uZW50PXtDb250ZW50UG9zdH0vPlxyXG4gICAgICAgICAgICA8Um91dGUgcGF0aD0nKicgY29tcG9uZW50PXtDb250ZW50UG9zdH0vPlxyXG4gICAgICAgIDwvU3dpdGNoPlxyXG4pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ29udGVudDtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NsaWVudC9jb21wb25lbnRzL0NvbnRlbnQvQ29udGVudC5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCAnLi9jb250ZW50LmNzcyc7XHJcblxyXG5jbGFzcyBOb3RGb3VuZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcclxuICAgIHJlbmRlcigpe1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibm90LWZvdW5kLXBvc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICBObyBwb3N0IGZvdW5kXHJcbiAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5vdEZvdW5kO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvY2xpZW50L2NvbXBvbmVudHMvQ29udGVudC9Ob3RGb3VuZC5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCAnLi9mb290ZXIuY3NzJztcclxuXHJcbmNsYXNzIEZvb3RlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudHtcclxuICAgcmVuZGVyKCl7XHJcbiAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgIDxoND5cclxuICAgICAgICAgICAgICAgICAgIG5ldGZsaXhyb3VsZXR0ZVxyXG4gICAgICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgKTtcclxuICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGb290ZXI7XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvY2xpZW50L2NvbXBvbmVudHMvRm9vdGVyL0Zvb3Rlci5qcyIsIlxuICAgIHZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9mb290ZXIuY3NzXCIpO1xuICAgIHZhciBpbnNlcnRDc3MgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9pc29tb3JwaGljLXN0eWxlLWxvYWRlci9saWIvaW5zZXJ0Q3NzLmpzXCIpO1xuXG4gICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHMgfHwge307XG4gICAgbW9kdWxlLmV4cG9ydHMuX2dldENvbnRlbnQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbnRlbnQ7IH07XG4gICAgbW9kdWxlLmV4cG9ydHMuX2dldENzcyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29udGVudC50b1N0cmluZygpOyB9O1xuICAgIG1vZHVsZS5leHBvcnRzLl9pbnNlcnRDc3MgPSBmdW5jdGlvbihvcHRpb25zKSB7IHJldHVybiBpbnNlcnRDc3MoY29udGVudCwgb3B0aW9ucykgfTtcbiAgICBcbiAgICAvLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG4gICAgLy8gaHR0cHM6Ly93ZWJwYWNrLmdpdGh1Yi5pby9kb2NzL2hvdC1tb2R1bGUtcmVwbGFjZW1lbnRcbiAgICAvLyBPbmx5IGFjdGl2YXRlZCBpbiBicm93c2VyIGNvbnRleHRcbiAgICBpZiAobW9kdWxlLmhvdCAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZG9jdW1lbnQpIHtcbiAgICAgIHZhciByZW1vdmVDc3MgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgbW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vZm9vdGVyLmNzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vZm9vdGVyLmNzc1wiKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlQ3NzID0gaW5zZXJ0Q3NzKGNvbnRlbnQsIHsgcmVwbGFjZTogdHJ1ZSB9KTtcbiAgICAgIH0pO1xuICAgICAgbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyByZW1vdmVDc3MoKTsgfSk7XG4gICAgfVxuICBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvY2xpZW50L2NvbXBvbmVudHMvRm9vdGVyL2Zvb3Rlci5jc3MiLCJcbiAgICB2YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vYXBwLmNzc1wiKTtcbiAgICB2YXIgaW5zZXJ0Q3NzID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvaXNvbW9ycGhpYy1zdHlsZS1sb2FkZXIvbGliL2luc2VydENzcy5qc1wiKTtcblxuICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzIHx8IHt9O1xuICAgIG1vZHVsZS5leHBvcnRzLl9nZXRDb250ZW50ID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb250ZW50OyB9O1xuICAgIG1vZHVsZS5leHBvcnRzLl9nZXRDc3MgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbnRlbnQudG9TdHJpbmcoKTsgfTtcbiAgICBtb2R1bGUuZXhwb3J0cy5faW5zZXJ0Q3NzID0gZnVuY3Rpb24ob3B0aW9ucykgeyByZXR1cm4gaW5zZXJ0Q3NzKGNvbnRlbnQsIG9wdGlvbnMpIH07XG4gICAgXG4gICAgLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuICAgIC8vIGh0dHBzOi8vd2VicGFjay5naXRodWIuaW8vZG9jcy9ob3QtbW9kdWxlLXJlcGxhY2VtZW50XG4gICAgLy8gT25seSBhY3RpdmF0ZWQgaW4gYnJvd3NlciBjb250ZXh0XG4gICAgaWYgKG1vZHVsZS5ob3QgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRvY3VtZW50KSB7XG4gICAgICB2YXIgcmVtb3ZlQ3NzID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgIG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2FwcC5jc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2FwcC5jc3NcIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUNzcyA9IGluc2VydENzcyhjb250ZW50LCB7IHJlcGxhY2U6IHRydWUgfSk7XG4gICAgICB9KTtcbiAgICAgIG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgcmVtb3ZlQ3NzKCk7IH0pO1xuICAgIH1cbiAgXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL2NsaWVudC9zcGEvYXBwLmNzcyJdLCJzb3VyY2VSb290IjoiIn0=