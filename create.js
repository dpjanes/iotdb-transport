/*
 *  create.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-10-03
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
    module: 'create',
});

const defaultds = [
    {
        "_tag": "core",
        "_transporter": "iotdb-transport-iotdb",
    },
    {
        "_tag": "metadata",
        "_transporter": "iotdb-transport-fs",
        "initd": {
            "prefix": ".iotdb/things",
        },
        "out_bands": [ "meta", "model", "connection", "istate", "ostate" ],
        "in_bands": [ "meta", "ostate" ],
    }
];

const create = d => {
    let td;

    if (_.is.String(d)) {
        td = iotdb.settings().get("transporters", []).concat(defaultds).find(td => td._tag === d);
        assert.ok(_.is.Dictionary(td), `should have found transporter '${ d }'`);
    } else {
        assert.ok(_.is.Dictionary(d));
        td = d;
    }

    assert.ok(_.is.String(td._transporter), "expected to see '_transporter'");

    const module = require(td._transporter);
    const maker = td._make || "make";
    const make = module[maker];
    const connecter = td._connect || "connect";
    const connect = module[connecter] || null;

    assert.ok(_.is.Function(make), `should have found function '${ maker }'`);
    assert.ok(_.is.Function(connect) || _.is.Null(connect), `should have found function '${ connecter }' or nothing`);

    const initd = _.d.transform(td, { key: key => !key.match(/^_/) ? key : null });

    return make(initd, connect ? connect(initd) : null);
};

// create("core")
// create("metadata")
