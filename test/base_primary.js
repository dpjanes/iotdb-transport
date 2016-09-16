/*
 *  base_primary.js
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

// test raw functionality
describe("base_primary", function() {
    describe("primary interface", function() {
        describe("make", function() {
            it('exists', function(done) {
                const t = transporter.make();
                done();
            });
            it('returns correct type', function(done) {
                const t = transporter.make();
                _.is.Transporter(t);
                done();
            });
        });
        describe("list", function() {
            it('exists', function(done) {
                const t = transporter.make();
                const o = t.list({})
                done();
            });
            it('returns Rx.Observable', function(done) {
                const t = transporter.make();
                const o = t.list({})
                assert.ok(_isObservable(o));
                done();
            });
            it('does not require an argument', function(done) {
                const t = transporter.make();
                const o = t.list();
                done();
            })
            it('fails if called', function(done) {
                const t = transporter.make();
                const o = t.list({})
                o.subscribe(
                    result => assert(false, "this should not be called"),
                    error => {
                        assert.ok(error instanceof errors.ShouldBeImplementedInSubclass)
                        done()
                    }
                )
            });
        });
        describe("added", function() {
            it('exists', function(done) {
                const t = transporter.make();
                const o = t.added({})
                done();
            });
            it('returns Rx.Observable', function(done) {
                const t = transporter.make();
                const o = t.added({})
                assert.ok(_isObservable(o));
                done();
            });
            it('does not require an argument', function(done) {
                const t = transporter.make();
                const o = t.added();
                done();
            })
            it('returns error observable', function(done) {
                const t = transporter.make();
                const o = t.added({})
                o.subscribe(
                    result => assert(false, "this should not be called"),
                    error => {
                        assert.ok(error instanceof errors.ShouldBeImplementedInSubclass)
                        done()
                    }
                )
            });
        });
        describe("updated", function() {
            it('exists', function(done) {
                const t = transporter.make();
                const o = t.updated({})
                done();
            });
            it('returns Rx.Observable', function(done) {
                const t = transporter.make();
                const o = t.updated({})
                assert.ok(_isObservable(o));
                done();
            });
            it('does not require an argument', function(done) {
                const t = transporter.make();
                const o = t.updated();
                done();
            })
            it('returns error observable', function(done) {
                const t = transporter.make();
                const o = t.updated({})
                o.subscribe(
                    result => assert(false, "this should not be called"),
                    error => {
                        assert.ok(error instanceof errors.ShouldBeImplementedInSubclass)
                        done()
                    }
                )
            });
        });
        describe("get", function() {
            it('exists', function(done) {
                const t = transporter.make();
                assert.ok(t.get)
                done();
            });
            it('requires an argument', function(done) {
                const t = transporter.make();
                assert.throws(() => t.get(), Error)
                done();
            })
            it('requires id', function(done) {
                const t = transporter.make();
                assert.throws(() => t.get({}), Error)
                done();
            })
            it('requires band', function(done) {
                const t = transporter.make();
                assert.throws(() => t.get({ id: "123" }), Error)
                done();
            })
            it('requires id and band', function(done) {
                const t = transporter.make();
                t.get({ id: "123", band: "meta" });
                done();
            })
            it('returns Rx.Observable', function(done) {
                const t = transporter.make();
                const o = t.get({id: "123", band: "meta" })
                assert.ok(_isObservable(o));
                done();
            });
            it('returns error observable', function(done) {
                const t = transporter.make();
                const o = t.get({id: "123", band: "meta"})
                o.subscribe(
                    result => assert(false, "this should not be called"),
                    error => {
                        assert.ok(error instanceof errors.ShouldBeImplementedInSubclass)
                        done()
                    }
                )
            });
        });
        describe("put", function() {
            it('exists', function(done) {
                const t = transporter.make();
                assert.ok(t.put)
                done();
            });
            it('requires an argument', function(done) {
                const t = transporter.make();
                assert.throws(() => t.put(), Error)
                done();
            })
            it('requires id', function(done) {
                const t = transporter.make();
                assert.throws(() => t.put({}), Error)
                done();
            })
            it('requires band', function(done) {
                const t = transporter.make();
                assert.throws(() => t.put({ id: "123" }), Error)
                done();
            })
            it('requires id and band', function(done) {
                const t = transporter.make();
                assert.throws(() => t.put({ id: "123", band: "meta" }));
                done();
            })
            it('requires id, band and value', function(done) {
                const t = transporter.make();
                t.put({ id: "123", band: "meta", value: {} });
                done();
            })
            it('requires value to be a dictionary', function(done) {
                const t = transporter.make();
                assert.throws(() => t.put({ id: "123", band: "meta", value: 123 }));
                done();
            })
            it('returns Rx.Observable', function(done) {
                const t = transporter.make();
                const o = t.put({id: "123", band: "meta", value: {} })
                assert.ok(_isObservable(o));
                done();
            });
            it('returns error observable', function(done) {
                const t = transporter.make();
                const o = t.put({id: "123", band: "meta", value: {}})
                o.subscribe(
                    result => assert(false, "this should not be called"),
                    error => {
                        assert.ok(error instanceof errors.ShouldBeImplementedInSubclass)
                        done()
                    }
                )
            });
        });
        describe("bands", function() {
            it('exists', function(done) {
                const t = transporter.make();
                assert.ok(t.bands)
                done();
            });
            it('requires an argument', function(done) {
                const t = transporter.make();
                assert.throws(() => t.bands(), Error)
                done();
            })
            it('requires id', function(done) {
                const t = transporter.make();
                assert.throws(() => t.bands({}), Error)
                done();
            })
            it('returns Rx.Observable', function(done) {
                const t = transporter.make();
                const o = t.bands({id: "123" })
                assert.ok(_isObservable(o));
                done();
            });
            it('returns error observable', function(done) {
                const t = transporter.make();
                const o = t.bands({id: "123", })
                o.subscribe(
                    result => assert(false, "this should not be called"),
                    error => {
                        assert.ok(error instanceof errors.ShouldBeImplementedInSubclass)
                        done()
                    }
                )
            });
        });
    });
});
