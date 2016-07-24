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

const assert = require('assert');
const Rx = require('rx');

const logger = iotdb.logger({
    name: 'iotdb-transport',
    module: 'transporter',
});

const make = () => {
    const self = {
        rx: {},
    };

    self.rx.list = (observer, d) => { throw errors.ShouldBeImplementedInSubclass(); };
    self.rx.updated = (observer, d) => { throw errors.ShouldBeImplementedInSubclass(); };
    self.rx.put = (observer, d) => { throw errors.ShouldBeImplementedInSubclass(); };
    self.rx.get = (observer, d) => { throw errors.ShouldBeImplementedInSubclass(); };
    self.rx.bands = (observer, d) => { throw errors.ShouldBeImplementedInSubclass(); };

    self.list = d => {
        assert.ok(_.is.Dictionary(d) || _.is.Undefined(d), "d must be a Dictionary or Undefined");

        d = _.d.clone.deep(d || {});
        delete d.id;
        delete d.band;
        delete d.value;

        return Rx.Observable.create(observer => self.rx.list(observer, d));
    };
    self.updated = d => {
        assert.ok(_.is.Dictionary(d) || _.is.Undefined(d), "d must be a Dictionary or Undefined");

        d = _.d.clone.deep(d || {});
        delete d.id;
        delete d.band;
        delete d.value;

        return Rx.Observable.create(observer => self.rx.updated(observer, d));
    };
    self.put = d => {
        assert.ok(_.is.Dictionary(d), "d must be a Dictionary");
        assert.ok(_.is.String(d.id), "d.id must be a String");
        assert.ok(_.is.String(d.band), "d.band must be a String");
        assert.ok(_.is.Dictionary(d.value), "d.value must be a Dictionary");

        d = _.d.clone.deep(d);

        return Rx.Observable.create(observer => self.rx.put(observer, d));
    };
    self.get = d => {
        assert.ok(_.is.Dictionary(d), "d must be a Dictionary");
        assert.ok(_.is.String(d.id), "d.id must be a String");
        assert.ok(_.is.String(d.band), "d.band must be a String");

        d = _.d.clone.deep(d);
        delete d.value;

        return Rx.Observable.create(observer => self.rx.get(observer, d));
    };
    self.bands = d => {
        assert.ok(_.is.Dictionary(d), "d must be a Dictionary");
        assert.ok(_.is.String(d.id), "d.id must be a String");

        d = _.d.clone.deep(d || {});
        delete d.band;
        delete d.value;

        return Rx.Observable.create(observer => self.rx.bands(observer, d));
    };

    return self;
};

/**
 *  API
 */
exports.make = make;
