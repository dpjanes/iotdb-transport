/*
 *  base_rx.js
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

describe("base_rx", function() {
    describe("reactive interface", function() {
        describe("list", function() {
            it('exists', function(done) {
                const t = transporter.make();
                assert(_.is.Function(t.rx.list));
                done();
            });
        });
        describe("added", function() {
            it('exists', function(done) {
                const t = transporter.make();
                assert(_.is.Function(t.rx.added));
                done();
            });
        });
        describe("updated", function() {
            it('exists', function(done) {
                const t = transporter.make();
                assert(_.is.Function(t.rx.updated));
                done();
            });
        });
        describe("get", function() {
            it('exists', function(done) {
                const t = transporter.make();
                assert(_.is.Function(t.rx.get));
                done();
            });
        });
        describe("put", function() {
            it('exists', function(done) {
                const t = transporter.make();
                assert(_.is.Function(t.rx.put));
                done();
            });
        });
        describe("bands", function() {
            it('exists', function(done) {
                const t = transporter.make();
                assert(_.is.Function(t.rx.bands));
                done();
            });
        });
    });
});
