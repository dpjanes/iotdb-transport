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

const make = (initd, underlying) => {
    const self = iotdb_transport.make();

    const _initd = _.d.compose.shallow(initd, {
        check_read: (d) => null,
        check_write: (d) => null,
    });

    const _filter = ( observer, d, command, how ) => {
        Rx.Observable.create(sub_observer => underlying.rx[command](sub_observer, d))
            .filter(item => !_.is.Error(_initd[how](item)))
            .subscribe(
                next => observer.onNext(next),
                error => observer.onError(error),
                () => observer.onCompleted()
            );
    }

    const _check = ( observer, d, command, how ) => {
        const error = _initd[how](d);
        if (error) {
            return observer.onError(error);
        } else {
            return underlying.rx[command](observer, d);
        }
    }

    // replace interface
    self.rx.list = ( observer, d) => _filter(observer, d, "list", "check_read");
    self.rx.added = ( observer, d) => _filter(observer, d, "added", "check_read");
    self.rx.updated = ( observer, d) => _filter(observer, d, "updated", "check_read");

    self.rx.put = ( observer, d) => _check(observer, d, "put", "check_write");
    self.rx.get = ( observer, d) => _check(observer, d, "get", "check_read");
    self.rx.bands = ( observer, d) => _check(observer, d, "bands", "check_read");

    return self;
};

/**
 *  API
 */
exports.make = make;
