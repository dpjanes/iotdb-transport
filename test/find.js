/*
 *  find.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-10-04
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

const assert = require("assert");
const create = require("../create");

describe("find", function() {
    it("core", function() {
        const cfgd = create.find("core");
        assert.ok(cfgd, "expected to find this");
        assert.ok(_.is.Dictionary(cfgd), "expected it to be a dictionary");
    })
    it("persist", function() {
        const cfgd = create.find("persist");
        assert.ok(cfgd, "expected to find this");
        assert.ok(_.is.Dictionary(cfgd), "expected it to be a dictionary");
    });
    it("not found", function() {
        const cfgd = create.find("not found");
        assert.ok(!cfgd, "don't exepect to find this");
    });
});
