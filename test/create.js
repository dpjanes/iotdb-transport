/*
 *  create.js
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

const errors = require("iotdb-errors");

const assert = require("assert");
const create = require("../create");

describe("create", function() {
    it("core", function() {
        const transporter = create.create("core");
        assert.ok(transporter, "expected to create this");
        assert.ok(_.is.Transporter(transporter), "expected it to be a Transporter");
    })
    it("persist", function() {
        const transporter = create.create("persist");
        assert.ok(transporter, "expected to create this");
        assert.ok(_.is.Transporter(transporter), "expected it to be a Transporter");
    });
    it("not found", function() {
        assert.throws(() => {
            create.create("not found");
        }, errors.NotFound);
    });
});
