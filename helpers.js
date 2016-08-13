/*
 *  transporter.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-03-21
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

const logger = iotdb.logger({
    name: 'iotdb-transport',
    module: 'helpers',
});

const channel = function (paramd, d) {
    assert.ok(_.is.Dictionary(paramd), "'paramd' must be a Dictionary");
    assert.ok(_.is.Dictionary(d), "'d' must be a Dictionary");
    assert.ok(_.is.Undefined(d.id) || _.is.String(d.id), "'d.id' must be a String or undefined");
    assert.ok(_.is.Undefined(d.band) || _.is.String(d.band), "'d.band' must be a String or undefined");

    paramd = _.d.compose.shallow(paramd, {
        prefix: "",
        encode: s => s,
    });

    const parts = [];
    if (!_.is.Empty(paramd.prefix)) {
        parts.push(paramd.prefix);
    }

    if (d.id) {
        parts.push(paramd.encode(d.id));

        if (d.band && !paramd.flat_band) {
            parts.push(paramd.encode(d.band));
        }
    }

    return parts.join("/").replace(/[\/]+/g, '/');
};

const unchannel = function (paramd, path) {
    assert.ok(_.is.Dictionary(paramd), "'paramd' must be a Dictionary");
    assert.ok(_.is.String(path), "'id' must be a String");

    paramd = _.d.compose.shallow(paramd, {
        prefix: "",
        decode: s => s,
    });

    path = path.replace(/\/+/g, '/');

    if (path.indexOf(paramd.prefix) !== 0) {
        return {};
    }

    const subpath = path.substring(paramd.prefix.length)
    const parts = subpath.split("/")
        .map(paramd.decode)
        .filter(part => !_.is.Empty(part));

    const rd = {};

    switch (parts.length) {
    case 1:
        rd.id = parts[0];
        
        if (paramd.flat_band) {
            rd.band = paramd.flat_band;
        }
        break;

    case 2:
        rd.id = parts[0];

        if (paramd.flat_band) {
            rd.band = paramd.flat_band;
        } else {
            rd.band = parts[1];
        }
        break;

    default:
        break;
    }

    return rd;
};

/**
 *  API
 */
exports.unchannel = unchannel;
exports.channel = channel;
