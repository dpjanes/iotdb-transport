/*
 *  base_binding.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-09-16
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

const errors = require("iotdb-errors");
const rx = require("Rx");

const assert = require("assert");
const transporter = require("../transporter");

const _isObservable = o => o.subscribe != null;

describe("base_binding", function() {
    describe("binding interface", function() {
        describe("use", function() {
            it('exists', function(done) {
                const t = transporter.make();
                assert(_.is.Function(t.use));
                done();
            });
        });
        describe("monitor", function() {
            it('exists', function(done) {
                const t = transporter.make();
                assert(_.is.Function(t.monitor));
                done();
            });
        });
    });
});
