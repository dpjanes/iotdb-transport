/*
 *  test_channel.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-08-13
 *
 *  Copyright [2013-2015] [David P. Janes]
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

const assert = require("assert");
const helpers = require("../helpers");

describe("test_channel", function() {
    describe("no prefix", function() {
        const initd = {};
        it("root", function() {
            const result = helpers.channel(initd, {});
            
            assert.strictEqual(result, "");
        });
        it("id", function() {
            const result = helpers.channel(initd, {
                id: "the-id",
            });
            
            assert.strictEqual(result, "the-id");
        });
        it("id+band", function() {
            const result = helpers.channel(initd, {
                id: "the-id",
                band: "the-band",
            });
            
            assert.strictEqual(result, "the-id/the-band");
        });
    })
    describe("prefix: /", function() {
        const initd = { prefix: "/" };
        it("root", function() {
            const result = helpers.channel(initd, {});
            
            assert.strictEqual(result, "/");
        });
        it("id", function() {
            const result = helpers.channel(initd, {
                id: "the-id",
            });
            
            assert.strictEqual(result, "/the-id");
        });
        it("id+band", function() {
            const result = helpers.channel(initd, {
                id: "the-id",
                band: "the-band",
            });
            
            assert.strictEqual(result, "/the-id/the-band");
        });
    })
    describe("prefix: /path", function() {
        const initd = { prefix: "/path" };
        it("root", function() {
            const result = helpers.channel(initd, {});
            
            assert.strictEqual(result, "/path");
        });
        it("id", function() {
            const result = helpers.channel(initd, {
                id: "the-id",
            });
            
            assert.strictEqual(result, "/path/the-id");
        });
        it("id+band", function() {
            const result = helpers.channel(initd, {
                id: "the-id",
                band: "the-band",
            });
            
            assert.strictEqual(result, "/path/the-id/the-band");
        });
    })
    describe("prefix: /path/path/", function() {
        const initd = { prefix: "/path/path/" };
        it("root", function() {
            const result = helpers.channel(initd, {});
            
            assert.strictEqual(result, "/path/path/");
        });
        it("id", function() {
            const result = helpers.channel(initd, {
                id: "the-id",
            });
            
            assert.strictEqual(result, "/path/path/the-id");
        });
        it("id+band", function() {
            const result = helpers.channel(initd, {
                id: "the-id",
                band: "the-band",
            });
            
            assert.strictEqual(result, "/path/path/the-id/the-band");
        });
    })
    describe("edge cases", function() {
        it("band without id - ignore", function() {
            const initd = {};
            const result = helpers.channel(initd, {
                band: "the-band",
            });
            
            assert.strictEqual(result, "");
        });
        it("many slashes for root", function() {
            const initd = { prefix: "/////" };
            const result = helpers.channel(initd, {});
            
            assert.strictEqual(result, "/");
        });
        it("many slashes for root with id", function() {
            const initd = { prefix: "/////" };
            const result = helpers.channel(initd, {
                id: "id"
            });
            
            assert.strictEqual(result, "/id");
        });
    });
    describe("encoder, prefix: /path", function() {
        const initd = { prefix: "/path", encode: s => s.toUpperCase() };
        it("root", function() {
            const result = helpers.channel(initd, {});
            
            assert.strictEqual(result, "/path");
        });
        it("id", function() {
            const result = helpers.channel(initd, {
                id: "the-id",
            });
            
            assert.strictEqual(result, "/path/THE-ID");
        });
        it("id+band", function() {
            const result = helpers.channel(initd, {
                id: "the-id",
                band: "the-band",
            });
            
            assert.strictEqual(result, "/path/THE-ID/THE-BAND");
        });
    })
});
