/*
 *  transporter.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-03-21
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

var iotdb = require('iotdb');
var _ = iotdb._;
var errors = require("./errors");

var join = require('url-join');

var logger = iotdb.logger({
    name: 'iotdb-transport',
    module: 'helpers',
});

/* --- helper functions --- */
/**
 *  Make one Transport control another.
 *
 *  @param {Transport} master_transport
 *
 *  @param {Transport} slave_transport
 *
 *  @param {dictionary|undefined} paramd
 *  Optional parameters
 *
 *  @param {boolean} paramd.verbose
 *
 *  @param {array} paramd.bands
 *  List of bands to operate on. By default
 *  <code>"istate", "ostate", "model", "meta"</code>.
 *  All subsequent paramd.* values, except as noted:
 *  if <code>true</code> will become this value.
 *
 *  @param {boolean|array} paramd.update
 *  Whenever primary_transport is updated on these bands,
 *  update secondary_transport.
 *  By default <code>true</code>.
 *
 *  @param {boolean|array} paramd.updated
 *  Whenever secondary_transport is updated on these bands,
 *  update primary_transport.
 *  By default <code>false</code>.
 *  If you set this to true (or some bands), the secondary_transport
 *  can update the primary_transport which is
 *  awesome and scary, just like your mom.
 *
 *  @param {boolean|array} paramd.get
 *  Calls to get on secondary_transport (on the bands) will
 *  actually be calling the primary_transport
 *  By default <code>true</code>.
 *
 *  @param {boolean} paramd.list
 *  Calls to list on secondary_transport will
 *  actually be calling the primary_transport. Note
 *  that this is band independent!
 *  By default <code>true</code>.
 *
 *  @param {boolean|array} paramd.copy
 *  All Records from the primary_transport (on
 *  the bands) will be copied to the 
 *  secondary_transport.
 *  By default <code>true</code>.
 */
var bind = function (primary_transport, secondary_transport, paramd) {
    var bi;
    var band;

    paramd = _.defaults(paramd, {
        verbose: false,
        bands: ["istate", "ostate", "model", "meta"],
        user: null,
        update: true,
        updated: false, // N.B.
        get: true,
        list: true,
        added: true,
        copy: true,
    });

    var _go = function (value) {
        return value !== [];
    };

    var _normalize = function (key) {
        var value = paramd[key];
        if (value === true) {
            paramd[key] = paramd.bands;
        } else if (value === false) {
            paramd[key] = [];
        } else if (!_.is.Array(value)) {
            throw new Error("bad value - expected Array or Boolean: key=" + key + " value=" + value);
        }
    };

    _normalize("update");
    _normalize("updated");
    _normalize("get");
    _normalize("list");
    _normalize("added");
    _normalize("copy");

    // updates to the src update the dst
    if (_go(paramd.update)) {
        primary_transport.updated({
            user: paramd.user,
        }, function (ud) {
            if (paramd.update.indexOf(ud.band) === -1) {
                return;
            }

            secondary_transport.put(ud, _.noop);
        });
    }

    // updates to the dst update the src - note no user!
    if (_go(paramd.updated)) {
        secondary_transport.updated({
            user: paramd.user,
        }, function (ud) {
            if (paramd.updated.indexOf(ud.band) === -1) {
                return;
            }

            primary_transport.put(ud, _.noop);
        });
    }

    // …
    if (_go(paramd.get)) {
        var _secondary_get = secondary_transport.get;

        secondary_transport.get = function (gd, callback) {
            if (paramd.get.indexOf(gd.band) === -1) {
                callback({
                    id: gd.id,
                    band: gd.band,
                    user: gd.user,
                    value: null,
                    error: new errors.NotFound(),
                });
            } else {
                return primary_transport.get(gd, callback);
            }
        };
    }

    // …
    if (_go(paramd.list)) {
        secondary_transport.bands = function () {
            primary_transport.bands.apply(primary_transport, Array.prototype.slice.call(arguments));
        };

        secondary_transport.list = function (paramd, callback) {
            primary_transport.list(paramd, function (resultd) {
                callback(resultd);
            });
        };
    }

    // …
    if (_go(paramd.added)) {
        secondary_transport.added = function () {
            primary_transport.added(primary_transport, Array.prototype.slice.call(arguments));
        };
    }

    // copy
    if (_go(paramd.copy)) {
        var copy_callback = function (d) {
            if ((d.value === undefined) || (d.value === null)) {
                return;
            }

            secondary_transport.put(d, _.noop);
        };

        var list_callback = function (d) {
            if (d.end) {
                return;
            }

            for (bi in paramd.copy) {
                var copy_band = paramd.copy[bi];

                primary_transport.get({
                    id: d.id,
                    band: copy_band,
                    user: d.user,
                }, copy_callback);
            }
        };

        primary_transport.added({
            user: paramd.user,
        }, list_callback);

        primary_transport.list({
            user: paramd.user,
        }, list_callback);
    }
};

/**
 */
var channel = function (paramd, id, band) {
    if (!_.is.Dictionary(paramd)) {
        throw new Error("channel: 'paramd' must be a Dictionary");
    }
    if (id && !_.is.String(id)) {
        throw new Error("channel: 'id' must be a String or undefined");
    }
    if (band && !_.is.String(band)) {
        throw new Error("channel: 'band' must be a String or undefined");
    }

    paramd = _.defaults(paramd, {
        prefix: "",
        encode: function (s) {
            return s;
        },
    });

    var channel = paramd.prefix;
    if (id) {
        channel = join(channel, paramd.encode(id));

        if (band && !paramd.flat_band) {
            channel = join(channel, paramd.encode(band));
        }
    }

    return channel;
};

/**
 */
var unchannel = function (paramd, path) {
    if (!_.is.Dictionary(paramd)) {
        throw new Error("unchannel: 'paramd' must be a Dictionary");
    }
    if (!_.is.String(path)) {
        throw new Error("unchannel: 'path' must be a String");
    }

    paramd = _.defaults(paramd, {
        prefix: "",
        decode: function (s) {
            return s;
        },
        dot_id: false,
        dot_band: false,
    });

    var subpath = path.substring(paramd.prefix.length);
    subpath = subpath.replace(/^\/*/, '');
    subpath = subpath.replace(/\/*$/, '');
    subpath = subpath.replace(/\/+/g, '/');

    var parts = subpath.split("/");
    parts = _.map(parts, paramd.decode);

    var id;
    if (parts.length === 1) {
        id = parts[0];
        if (!paramd.dot_id && id.match(/^[.]/)) {
            return;
        }

        if (paramd.flat_band) {
            return [id, paramd.flat_band, ];
        } else {
            return [id, ".", ];
        }
    } else if (parts.length === 2) {
        id = parts[0];
        if (!paramd.dot_id && id.match(/^[.]/)) {
            return;
        }

        var band = parts[1];
        if (!paramd.dot_band, band.match(/^[.]/)) {
            return;
        }

        if (paramd.flat_band) {
            return [id, paramd.flat_band, ];
        } else {
            return [id, band, ];
        }
    } else {
        return;
    }
};

/**
 *  API
 */
exports.bind = bind;
exports.unchannel = unchannel;
exports.channel = channel;
