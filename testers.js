/*
 *  testers.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-07-24
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

const iotdb = require("iotdb");
const _ = iotdb._;

const log_raw = what => [
    d => console.log("+", what, JSON.stringify(d)),
    error => console.log("#", what, _.error.message(error), error.stack),
    () => console.log("+", what, "<end>")
];

const log_id = what => [
    ld => console.log("+", what, ld.id),
    error => console.log("#", what, _.error.message(error), error.stack),
    () => console.log("+", what, "<end>")
];

const log_band = what => [
    ld => console.log("+", what, ld.id + "/" + ld.band),
    error => console.log("#", what, _.error.message(error), error.stack),
    () => console.log("+", what, "<end>")
];

const log_value = what => [
    ld => console.log("+", what, ld.id + "/" + ld.band + "/" + JSON.stringify(ld.value)),
    error => console.log("#", what, _.error.message(error), error.stack),
    () => console.log("+", what, "<end>")
];

const put = ( transport, d, tag ) => {
    d = _.d.compose.shallow(d, {
        id: "MyThingID", 
        band: "meta", 
        value: {
            first: "David",
            last: "Smith",
            now: _.timestamp.make(),
        },
    });

    transport
        .put(d)
        .subscribe(...log_value(tag || "put"));
};

const get = ( transport, d, tag ) => {
    d = _.d.compose.shallow(d, {
        id: "MyThingID", 
        band: "meta", 
    });

    transport
        .get(d)
        .subscribe(...log_value(tag || "get"));
};

const list = transport => {
    transport
        .list()
        .subscribe(...log_id("list"));
};

const bands = ( transport, d, tag ) => {
    d = _.d.compose.shallow(d, { id: "MyThingID" });
    transport
        .bands(d)
        .subscribe(...log_band(tag || "bands"));
};

const updated = ( transport, d, tag ) => {
    d = _.d.compose.shallow(d, {});
    transport
        .updated(d)
        .subscribe(...log_value(tag || "updated"));
};

const all = ( transport, d, tag ) => {
    d = _.d.compose.shallow(d, {});
    transport
        .all(d)
        .subscribe(...log_raw(tag || "all"));
};


/*
 *  API
 */
exports.log_id = log_id;
exports.log_band = log_band;
exports.log_value = log_value;
exports.log_raw = log_raw;

exports.put = put;
exports.list = list;
exports.bands = bands;
exports.updated = updated;
exports.get = get;
exports.all = all;
