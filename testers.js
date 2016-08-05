/*
 *  testers.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-07-24
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

const put = ( transport, d ) => {
    d = _.d.compose.shallow(d, {
        id: "MyThingID", 
        band: "meta", 
        value: {
            first: "David",
            last: "Janes",
            now: _.timestamp.make(),
        },
    });

    transport
        .put(d)
        .subscribe(...log_value("put"));
};

const get = ( transport, d ) => {
    d = _.d.compose.shallow(d, {
        id: "MyThingID", 
        band: "meta", 
    });

    transport
        .get(d)
        .subscribe(...log_value("get"));
};

const list = transport => {
    transport
        .list()
        .subscribe(...log_id("list"));
};

const bands = ( transport, d ) => {
    d = _.d.compose.shallow(d, { id: "MyThingID" });
    transport
        .bands(d)
        .subscribe(...log_band("bands"));
};

const updated = ( transport, d ) => {
    d = _.d.compose.shallow(d, {});
    transport
        .updated(d)
        .subscribe(...log_value("updated"));
};

const all = ( transport, d ) => {
    d = _.d.compose.shallow(d, {});
    transport
        .all(d)
        .subscribe(...log_raw("all"));
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
