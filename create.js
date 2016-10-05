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
        "tag": "core",
        "transporter": "iotdb-transport-iotdb",
        "initd": {},
    },
    {
        "tag": "persist",
        "transporter": "iotdb-transport-fs",
        "initd": {
            "prefix": ".iotdb/things",
        },
        "out_bands": [ "meta", "model", "connection", "istate", "ostate" ],
        "in_bands": [ "meta", "ostate" ],
    }
];

const find = d => {
    if (_.is.String(d)) {
        return iotdb.settings().get("transporters", []).concat(defaultds).find(td => td.tag === d);
    } else {
        assert.ok(_.is.Dictionary(d));
        return d;
    }
}

const create = d => {
    const td = find(d);
    if (!td) {
        throw new errors.NotFound(`did not find transporter '${ d }'`);
    }

    assert.ok(_.is.String(td.transporter), "expected to see 'transporter'");

    const module = require(td.transporter);
    const make_name = td.make || "make";
    const make = module[make_name];
    const connect_name = td.connect || "connect";
    const connect = module[connect_name] || null;

    assert.ok(_.is.Function(make), `should have found function '${ make_name }'`);
    assert.ok(_.is.Function(connect) || _.is.Null(connect), `should have found function '${ connect_name }' or nothing`);

    return make(td.initd, connect ? connect(td.initd, _.noop) : null);
};

/*
 *  API
 */
exports.create = create;
exports.find = find;
