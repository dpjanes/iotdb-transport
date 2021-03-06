/*
 *  index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-07-22
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

const transporter = require('./transporter');
exports.make = transporter.make;

const create = require('./create');
exports.create = create.create;
exports.find = create.find;

const helpers = require('./helpers');
exports.channel = helpers.channel;
exports.unchannel = helpers.unchannel;

const access = require("./access");
exports.access = access;

const testers = require("./testers");
exports.testers = testers;
