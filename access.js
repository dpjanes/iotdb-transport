/*
 *  access.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-08-17
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

const assert = require('assert');
const Rx = require('rx');

const iotdb_transport = require("./transporter");

const logger = iotdb.logger({
    name: 'iotdb-transport',
    module: 'transporter',
});

const make = (initd) => {
    const self = iotdb_transport.make();
    const original = _.d.clone.shallow(self);
    const _initd = _.d.compose.shallow(initd, {
        check_read: (d) => null,
        check_write: (d) => null,
    });

    // internals
    const _filter_read = item => {
        const result = _initd.check_read(item);
        if (_.is.Error(result)) {
            return false;
        } else {
            return true;
        }
    };

    const _error = error => 
        Rx.Observable.create(function (observer) {
            observer.onError(error);
        });

    // replace interface
    self.list = d => original.list(d).filter(_filter_read);
    self.added = d => original.added(d).filter(_filter_read);
    self.updated = d => original.updated(d).filter(_filter_read);
    self.put = d => {
        const error = _initd.check_write(d);
        if (error) {
            return _error(error);
        } else {
            return original.put(d);
        }
    };
    self.get = d => {
        const error = _initd.check_read(d);
        if (error) {
            return _error(error);
        }

        return original.get(d);
    };
    self.bands = d => {
        const error = _initd.check_read(d);
        if (error) {
            return _error(error);
        }

        return original.bands(d);
    };

    return self;
};

/**
 *  API
 */
exports.make = make;
