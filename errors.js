/*
 *  errors.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-01-29
 *
 *  Copyright [2013-2016] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

var assert = require('assert');
var util = require('util');

/**
 */
function NotFound(message) {
    Error.call(this);
    this.message = message || "not found";
    this.code = 404;
}

util.inherits(NotFound, Error);

/**
 */
function NotAuthorized(message) {
    Error.call(this);
    this.message = message || "not authorized";
    this.code = 401;
}

util.inherits(NotAuthorized, Error);

/**
 *  Timestanp was out of date
 */
function Timestamp(message) {
    Error.call(this);
    this.message = message || "timestamp out of date";
    this.code = 409;
}

util.inherits(Timestamp, Error);

/**
 *  e.g. expecting a thing and got a recipe
 */
function NotAppropriate(message) {
    Error.call(this);
    this.message = message || "not appropriate";
    this.code = 403;
}

util.inherits(NotAppropriate, Error);

/**
 *  e.g. something is imporperly formatted
 */
function Invalid(message) {
    Error.call(this);
    this.message = message || "invalid";
    this.code = 403;
}

util.inherits(Invalid, Error);

/**
 *  e.g. doing a PUT on a model
 */
function MethodNotAllowed(message) {
    Error.call(this);
    this.message = message || "method not allowed";
    this.code = 405;
}

util.inherits(MethodNotAllowed, Error);

/**
 *  e.g. we're connecting to Redis and it doesn't work
 */
function ServiceNotAvailable(message) {
    Error.call(this);
    this.message = message || "underlying service not available";
    this.code = 503;
}

util.inherits(ServiceNotAvailable, Error);

/**
 *  e.g. expecting a thing and got a recipe
 */
function NotImplemented(message) {
    Error.call(this);
    this.message = message || "not implemented";
    this.code = 501;
}

util.inherits(NotImplemented, Error);

/**
 *  This is not implemented and never will be implemented
 */
function NeverImplemented(message) {
    Error.call(this);
    this.message = message || "never will be implemented";
    this.code = 501;    
}

util.inherits(NeverImplemented, Error);

/**
 *  Additional setup is required
 */
function SetupRequired(message) {
    Error.call(this);
    this.message = message || "setup required";
    this.code = 500;
}

util.inherits(SetupRequired, Error);

/**
 *  Some sort of internal error
 */
function Internal(message) {
    Error.call(this);
    this.message = message || "internal error";
    this.code = 500;
}

util.inherits(Internal, Error);

/**
 *  API
 */
exports.NotFound = NotFound;
exports.NotAuthorized = NotAuthorized;
exports.Timestamp = Timestamp;
exports.NotAppropriate = NotAppropriate;
exports.Invalid = Invalid;
exports.MethodNotAllowed = MethodNotAllowed;
exports.ServiceNotAvailable = ServiceNotAvailable;
exports.NotImplemented = NotImplemented;
exports.NeverImplemented = NeverImplemented;
exports.SetupRequired = SetupRequired;
exports.Internal = Internal;
