/*
 *  transporter.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-07-23
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

const iotdb = require('iotdb');
const _ = iotdb._;
const errors = require('iotdb-errors');

const logger = iotdb.logger({
    name: 'iotdb-transport',
    module: 'transporter',
});

const make = () => {
    const self = Object.assign({}, events.EventEmitter.prototype);

    self.setMaxListeners(0);

    self.list = paramd => { throw errors.ShouldBeImplementedInSubclass(); };
    self.updated = paramd => { throw errors.ShouldBeImplementedInSubclass(); };
    self.put = (d, paramd) => { throw errors.ShouldBeImplementedInSubclass(); };
    self.get = (d, paramd) => { throw errors.ShouldBeImplementedInSubclass(); };
    self.bands = (d, paramd) => { throw errors.ShouldBeImplementedInSubclass(); };

    return self;
};

/**
 *  API
 */
exports.make = make;
