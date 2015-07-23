/*
 *  connect.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-07-22
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

var url = require('url');
var fs = require('fs');

var connect_fs = function(uri, paramd, callback) {
    try {
        var transport = require('iotdb-transport-fs');
    } catch (x) {
        return callback(new Error("fs: do $ homestar install iotdb-transport-fs"));
    }

    var urip = url.parse(uri);
    fs.stat(urip.path, function(error, stats) {
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
            store: "things",
            module: "iotdb-transport-fs",
            transport: transporter,
        });
    });

};

var connect_rest = function(uri, paramd, callback) {
    return callback(new Error("rest: not implemented"));
};

var connect_mqtt = function(uri, paramd, callback) {
    return callback(new Error("mqtt: not implemented"));
};

var connect_firebase = function(uri, paramd, callback) {
    return callback(new Error("firebase: not implemented"));
};

var connect = function(uri, paramd, callback) {
    if (callback === undefined) {
        callback = paramd;
        paramd = {};
    }

    var urip = url.parse(uri);
    if (!urip.scheme || (urip.scheme === "file")) {
        return connect_fs(uri, paramd, callback);
    } else if (urip.scheme === "http") {
        return connect_rest(uri, paramd, callback);
    } else if (urip.scheme === "mqtt") {
        return connect_mqtt(uri, paramd, callback);
    } else if (urip.scheme === "firebase") {
        return connect_firebase(uri, paramd, callback);
    } else {
        return callback(new Error("cannot find a Transporter for this URL: " + uri));
    }
};

/**
 *  API
 */
exports.connect = connect;
