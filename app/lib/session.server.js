"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HydrogenSession = exports.unsign = exports.sign = void 0;
var server_runtime_1 = require("@remix-run/server-runtime");
var encoder = new TextEncoder();
var sign = function (value, secret) { return __awaiter(void 0, void 0, void 0, function () {
    var data, key, signature, hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = encoder.encode(value);
                return [4 /*yield*/, createKey(secret, ['sign'])];
            case 1:
                key = _a.sent();
                return [4 /*yield*/, crypto.subtle.sign('HMAC', key, data)];
            case 2:
                signature = _a.sent();
                hash = btoa(String.fromCharCode.apply(String, new Uint8Array(signature))).replace(/=+$/, '');
                return [2 /*return*/, value + '.' + hash];
        }
    });
}); };
exports.sign = sign;
var unsign = function (cookie, secret) { return __awaiter(void 0, void 0, void 0, function () {
    var value, hash, data, key, signature, valid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                value = cookie.slice(0, cookie.lastIndexOf('.'));
                hash = cookie.slice(cookie.lastIndexOf('.') + 1);
                data = encoder.encode(value);
                return [4 /*yield*/, createKey(secret, ['verify'])];
            case 1:
                key = _a.sent();
                signature = byteStringToUint8Array(atob(hash));
                return [4 /*yield*/, crypto.subtle.verify('HMAC', key, signature, data)];
            case 2:
                valid = _a.sent();
                return [2 /*return*/, valid ? value : false];
        }
    });
}); };
exports.unsign = unsign;
function createKey(secret, usages) {
    return __awaiter(this, void 0, Promise, function () {
        var key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, usages)];
                case 1:
                    key = _a.sent();
                    return [2 /*return*/, key];
            }
        });
    });
}
function byteStringToUint8Array(byteString) {
    var array = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        array[i] = byteString.charCodeAt(i);
    }
    return array;
}
/**
 * This is a custom session implementation for your Hydrogen shop.
 * Feel free to customize it to your needs, add helper methods, or
 * swap out the cookie-based implementation with something else!
 */
var HydrogenSession = /** @class */ (function () {
    function HydrogenSession(sessionStorage, session) {
        this.sessionStorage = sessionStorage;
        this.session = session;
        this.session = session;
        this.sessionStorage = sessionStorage;
    }
    HydrogenSession.init = function (request, secrets) {
        return __awaiter(this, void 0, void 0, function () {
            var createCookie, createCookieSessionStorage, storage, session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createCookie = (0, server_runtime_1.createCookieFactory)({ sign: exports.sign, unsign: exports.unsign });
                        createCookieSessionStorage = (0, server_runtime_1.createCookieSessionStorageFactory)(createCookie);
                        storage = createCookieSessionStorage({
                            cookie: {
                                name: 'session',
                                httpOnly: true,
                                path: '/',
                                sameSite: 'lax',
                                secrets: secrets,
                            },
                        });
                        return [4 /*yield*/, storage.getSession(request.headers.get('Cookie'))];
                    case 1:
                        session = _a.sent();
                        return [2 /*return*/, new this(storage, session)];
                }
            });
        });
    };
    HydrogenSession.prototype.has = function (key) {
        return this.session.has(key);
    };
    HydrogenSession.prototype.get = function (key) {
        return this.session.get(key);
    };
    HydrogenSession.prototype.destroy = function () {
        return this.sessionStorage.destroySession(this.session);
    };
    HydrogenSession.prototype.flash = function (key, value) {
        this.session.flash(key, value);
    };
    HydrogenSession.prototype.unset = function (key) {
        this.session.unset(key);
    };
    HydrogenSession.prototype.set = function (key, value) {
        this.session.set(key, value);
    };
    HydrogenSession.prototype.commit = function () {
        return this.sessionStorage.commitSession(this.session);
    };
    return HydrogenSession;
}());
exports.HydrogenSession = HydrogenSession;
