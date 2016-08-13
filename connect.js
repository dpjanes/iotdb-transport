/*
 *  connect.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-07-22
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

var url = require('url');
var fs = require('fs');
var iotdb = require('iotdb');
var _ = iotdb._;

var connect_fs = function (uri, paramd, callback) {
    var transport;
    try {
        transport = require('iotdb-transport-fs');
    } catch (x) {
        return callback(new Error("fs: do $ homestar install iotdb-transport-fs"));
    }

    var urip = url.parse(uri);
    fs.stat(urip.path, function (error, stats) {
        if (error) {
            return callback(new Error("fs: " + _.error.message(error)));
        }

        if (!stats.isDirectory()) {
            return callback(new Error("fs: not a directory"));
        }

        var transporter = new transport.Transport({
            prefix: urip.path,
        });

        return callback(null, {
            store: paramd.store || "things",
            module: "iotdb-transport-fs",
            transport: transporter,
        });
    });

};

var connect_rest = function (uri, paramd, callback) {
    var transport;
    try {
        transport = require('iotdb-transport-rest');
    } catch (x) {
        return callback(new Error("fs: do $ homestar install iotdb-transport-rest"));
    }

    var things = iotdb.connect();
    var transporter = new transport.Transport(paramd, things);

    return callback(null, {
        store: paramd.store || "things",
        module: "iotdb-transport-rest",
        transport: transporter,
    });
};

var connect_mqtt = function (uri, paramd, callback) {
    return callback(new Error("mqtt: not implemented"));
};

var connect_firebase = function (uri, paramd, callback) {
    var transport;
    try {
        transport = require('iotdb-transport-firebase');
    } catch (x) {
        return callback(new Error("fs: do $ homestar install iotdb-transport-firebase"));
    }

    var transporter = new transport.Transport(paramd);

    return callback(null, {
        store: paramd.store || "things",
        module: "iotdb-transport-firebase",
        transport: transporter,
    });
};

var connect_iotdb = function (uri, paramd, callback) {
    var transport;
    try {
        transport = require('iotdb-transport-iotdb');
    } catch (x) {
        return callback(new Error("fs: do $ homestar install iotdb-transport-iotdb"));
    }

    var things = iotdb.things();
    var transporter = new transport.Transport(paramd, things);

    return callback(null, {
        store: paramd.store || "things",
        module: "iotdb-transport-iotdb",
        transport: transporter,
    });
};

var connect_null = function (uri, paramd, callback) {
    var transport;
    try {
        transport = require('iotdb-transport-null');
    } catch (x) {
        return callback(new Error("fs: do $ homestar install iotdb-transport-null"));
    }

    var transporter = new transport.Transport(paramd);

    return callback(null, {
        store: paramd.store || "things",
        module: "iotdb-transport-null",
        transport: transporter,
    });
};

var connect_recipes = function (uri, paramd, callback) {
    var iotdb_recipes;
    try {
        iotdb_recipes = require('iotdb-recipes');
    } catch (x) {
        return callback(new Error("fs: do $ homestar install iotdb-recipes"));
    }

    var urip = url.parse(uri);

    iotdb_recipes.load_recipes({
        cookbooks_path: urip.path || "cookbooks",
    });

    var transporter = new iotdb_recipes.Transport(paramd);

    return callback(null, {
        store: paramd.store || "recipes",
        module: "iotdb-transport-recipes",
        transport: transporter,
    });
};

var connect = function (uri, paramd, callback) {
    if (callback === undefined) {
        callback = paramd;
        paramd = {};
    }

    var urip = url.parse(uri);
    if (!urip.protocol || (urip.protocol === "file:")) {
        return connect_fs(uri, paramd, callback);
    } else if (urip.protocol === "http:") {
        return connect_rest(uri, paramd, callback);
    } else if (urip.protocol === "mqtt:") {
        return connect_mqtt(uri, paramd, callback);
    } else if (urip.protocol === "firebase:") {
        return connect_firebase(uri, paramd, callback);
    } else if (urip.protocol === "iotdb:") {
        return connect_iotdb(uri, paramd, callback);
    } else if (urip.protocol === "recipes:") {
        return connect_recipes(uri, paramd, callback);
    } else if (urip.protocol === "null:") {
        return connect_null(uri, paramd, callback);
    } else {
        return callback(new Error("cannot find a Transporter for this URL: " + uri));
    }
};

/**
 *  API
 */
exports.connect = connect;
