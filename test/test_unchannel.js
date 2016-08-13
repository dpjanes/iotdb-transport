/*
 *  test_unchannel.js
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

describe("test_unchannel", function() {
    describe("no prefix", function() {
        const initd = {};

        it("root", function() {
            const path = "";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {});
        });
        it("id", function() {
            const path = "the-id";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
            });
        });
        it("id + band", function() {
            const path = "the-id/the-band";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
                band: "the-band",
            });
        });
        it("id + band + extra slashes", function() {
            const path = "the-id////the-band";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
                band: "the-band",
            });
        });
        it("id + band + leading slashes", function() {
            // not sure if we are happy with this
            const path = "////the-id/the-band";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
                band: "the-band",
            });
        });
    });
    describe("prefix: /", function() {
        const initd = {
            prefix: "/",
        };

        it("root", function() {
            const path = "/";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {});
        });
        it("id", function() {
            const path = "/the-id";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
            });
        });
        it("id + band", function() {
            const path = "/the-id/the-band";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
                band: "the-band",
            });
        });
        it("id + band + extra slashes", function() {
            const path = "/the-id////the-band";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
                band: "the-band",
            });
        });
        it("id + band + leading slashes", function() {
            // not sure if we are happy with this
            const path = "////the-id/the-band";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
                band: "the-band",
            });
        });
        it("not a match", function() {
            const path = "the-id";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {});
        });
    });
    describe("prefix: /path", function() {
        const initd = {
            prefix: "/path",
        };

        it("root", function() {
            const path = "/path";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {});
        });
        it("id", function() {
            const path = "/path/the-id";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
            });
        });
        it("id + band", function() {
            const path = "/path/the-id/the-band";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
                band: "the-band",
            });
        });
        it("id + band + extra slashes", function() {
            const path = "/path/the-id////the-band";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
                band: "the-band",
            });
        });
        it("id + band + leading slashes", function() {
            const path = "////path/the-id/the-band";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
                band: "the-band",
            });
        });
        it("not a match", function() {
            const path = "/the-id/the-band";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {});
        });
    });
    describe("prefix: /path/tail/", function() {
        const initd = {
            prefix: "/path/tail/",
        };

        it("root", function() {
            const path = "/path/tail";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {});
        });
        it("root with trailing /", function() {
            const path = "/path/tail/";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {});
        });
        it("id", function() {
            const path = "/path/tail/the-id";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
            });
        });
        it("id + band", function() {
            const path = "/path/tail/the-id/the-band";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
                band: "the-band",
            });
        });
        it("id + band + extra slashes", function() {
            const path = "/path/tail/the-id////the-band";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
                band: "the-band",
            });
        });
        it("id + band + leading slashes", function() {
            const path = "////path/tail/the-id/the-band";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {
                id: "the-id",
                band: "the-band",
            });
        });
        it("not a match", function() {
            const path = "/the-id/the-band";
            const result = helpers.unchannel(initd, path);

            assert.deepEqual(result, {});
        });
    });
});
