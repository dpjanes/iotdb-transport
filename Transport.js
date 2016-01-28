/*
 *  Transport.js
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

var iotdb = require('iotdb');
var _ = iotdb._;

var join = require('url-join');

var logger = iotdb.logger({
    name: 'iotdb-transport',
    module: 'Transport',
});

var helpers = require('./helpers');

/* --- callbacks --- */
/**
 *  @param {dictionary} d
 *  @param {string|null} d.id
 *  The ID of the Record. 
 *
 *  @param {string|null} d.end
 *  When "true" no more records will be sent.
 *  When this is true, there _will not_
 *  be a "id" value
 *
 *  @callback Transport~list_callback
 */

/**
 *  @param {string} id
 *  The ID of the Record
 *
 *  @param {string} band
 *  The Band of the Record
 *
 *  @param {dictionary|undefined|null} value
 *  The Record.
 *  If undefined, the Record is likely 
 *  available (but you'll have to go get it)
 *  If null, the Record does not exist
 *
 *  @callback Transport~get_callback
 */

/* --- constructor --- */
/**
 *  Create a Transporter.
 *
 *  @param {dictionary|undefined} initd
 *  Optional parameters
 *
 *  @param {ThingArray} things
 *  Things to monitor
 *
 *  @constructor
 */
var Transport = function (initd) {
    var self = this;
};

Transport.prototype._isTransport = true;

/* --- pub/sub methods -- */
/**
 *  Publish changes, but don't pull any
 */
Transport.prototype.push_to = function (secondary, paramd) {
    var self = this;

    paramd = _.defaults(paramd, {
        updated: false,
    });

    return helpers.bind(self, secondary, paramd);
};

/**
 *  Pull changes
 */
Transport.prototype.pull_from = function (secondary, paramd) {
    throw new Error("no implemented (yet)");
};

/**
 *  Bind
 */
Transport.prototype.bind = function (secondary, paramd) {
    var self = this;

    paramd = _.defaults(paramd, {
        updated: false,
    });

    return helpers.bind(self, secondary, paramd);
};

/* --- helpers that don't need to be replicated in subclasses */
/**
 *  This will callback all the data on all the bands.
 *
 *  NOTE:
 *  callback is _new_ style, with ( error, d ) as the arguments
 */
Transport.prototype.all = function (paramd, callback) {
    var self = this;

    if (arguments.length === 0) {
        throw new Error("Transport.all: one or two arguments required");
    } else if (arguments.length === 1) {
        paramd = {};
        callback = arguments[0];
    }

    paramd = _.defaults(paramd, {
        user: null,
    });
    var bands = _.ld.list(paramd, "bands", ["meta", "model", "istate", "ostate"]);

    var _outer_count = 0;
    var _outer_increment = function () {
        _outer_count++;
    };
    var _outer_decrement = function () {
        if (--_outer_count !== 0) {
            return;
        }

        callback(null, null);
        callback = function () {};
    };
    var _outer_error = function (error) {
        _outer_count = 0;
        callback(error, null);
        callback = function () {};
    };

    _outer_increment();

    var _fetch_id = function (ld) {
        if (ld.end) {
            _outer_decrement();
        } else if (ld.error) {
            _outer_error(ld.error);
        } else {
            _outer_increment();

            var d = {};
            var _inner_count = 0;
            var _inner_increment = function () {
                _inner_count++;
            };
            var _inner_decrement = function () {
                if (--_inner_count !== 0) {
                    return;
                }

                if (_.is.Empty(d)) {
                    callback(new Error("not found", null));
                } else {
                    d.id = ld.id;
                    callback(null, d);
                }

                _outer_decrement();

                // HACK
                if (paramd.id) {
                    _outer_decrement();
                }
            };

            _inner_increment();
            bands.map(function (band) {
                _inner_increment();
                self.get({
                    id: ld.id,
                    band: band,
                    user: paramd.user,
                }, function (gd) {
                    if (gd.value) {
                        d[band] = gd.value;
                    }
                    _inner_decrement();
                });
            });
            _inner_decrement();
        }
    };

    if (paramd.id) {
        _fetch_id({
            id: paramd.id,
            user: paramd.user,
        });
    } else {
        self.list({
            user: paramd.user,
        }, _fetch_id);
    }
};

/**
 *  Copy from this transporter to the secondary
 */
Transport.prototype.copy_to = function (secondary, paramd, done) {
    var self = this;
    var noop = function () {};

    if (arguments.length === 0) {
        throw new Error("insufficient arguments");
    } else if (arguments.length === 1) {
        paramd = {};
        done = noop;
    } else if (arguments.length === 2) {
        if (_.is.Function(paramd)) {
            done = paramd;
            paramd = {};
        } else {
            done = noop;
        }
    }

    paramd = _.d.compose.shallow({}, paramd);

    self.all(function (error, d) {
        if (error) {
            done(error, null);
            done = noop;
        } else if (!d) {
            done(null, null);
            done = noop;
        } else {
            secondary.update(d);
        }
    });
};

/* --- methods --- */
/**
 *  List all the IDs associated with this Transport.
 *  <p>
 *  The callback is called one at a time with the
 *  dictionary containing the ID of the Record. 
 *  When there are no more records a dictionary with
 *  "end" being true will be sent
 *
 *  @param {dictionary|undefined} paramd
 *  Optional parameters
 *
 *  @param {Transport~list_callback} callback
 */
Transport.prototype.list = function (paramd, callback) {
    var self = this;

    throw new Error("Not Implemented");
};

Transport.prototype._validate_list = function (paramd, callback) {
    if (!_.is.Dictionary(paramd)) {
        throw new Error("list: 'paramd' must be a Dictionary");
    }
    if (!_.is.Function(callback)) {
        throw new Error("list: 'callback' must be a Function");
    }
};

/**
 *  Trigger the callback whenever a Record is added.
 *
 *  @param {dictionary|undefined} paramd
 *  Optional parameters
 *
 *  @param {Transport~list_callback} callback
 */
Transport.prototype.added = function (paramd, callback) {
    var self = this;

    throw new Error("Not Implemented");
};

Transport.prototype._validate_added = function (paramd, callback) {
    if (!_.is.Dictionary(paramd)) {
        throw new Error("added: 'paramd' must be a Dictionary");
    }
    if (!_.is.Function(callback)) {
        throw new Error("added: 'callback' must be a Function");
    }
};

/**
 *  Tell about an ID (particularly: does it exists, what bands are available)
 *
 *  @param {string} id
 *  The ID of the Record
 *
 *  @param {Transport~about_callback} callback
 */
Transport.prototype.about = function (paramd, callback) {
    var self = this;

    throw new Error("Not Implemented");
};

Transport.prototype._validate_about = function (paramd, callback) {
    if (!_.is.Dictionary(paramd)) {
        throw new Error("about: 'paramd' must be a Dictionary");
    }
    if (!_.is.Function(callback)) {
        throw new Error("about: 'callback' must be a Function");
    }
    if (!paramd.id) {
        throw new Error("about: 'paramd.id' is required");
    }
    if (!_.is.String(paramd.id)) {
        throw new Error("about: 'paramd.id' must be a string");
    }
};

/**
 *  Get an Record and callback.
 *
 *  @param {string} id
 *  The ID of the Record
 *
 *  @param {string|null} band
 *  The band of the Record. If null, a dictionary
 *  should be returned with information
 *  about the item. In particular, key "bands"
 *  with an array of available bands
 *
 *  @param {Transport~get_callback} callback
 */
Transport.prototype.get = function (paramd, callback) {
    var self = this;

    throw new Error("Not Implemented");
};

Transport.prototype._validate_get = function (paramd, callback) {
    if (!_.is.Dictionary(paramd)) {
        throw new Error("get: 'paramd' must be a Dictionary");
    }
    if (!_.is.Function(callback)) {
        throw new Error("get: 'callback' must be a Function");
    }
    if (!paramd.id) {
        throw new Error("get: 'paramd.id' is required");
    }
    if (!_.is.String(paramd.id)) {
        throw new Error("get: 'paramd.id' must be a string, not: " + paramd.id);
    }
    if (!paramd.band) {
        throw new Error("get: 'paramd.band' is required");
    }
    if (!_.is.String(paramd.band)) {
        throw new Error("get: 'paramd.band' must be a string, not: " + paramd.band);
    }
};

/**
 *  Update a record
 *  <p>
 *  NOT FINISHED
 *
 *  @param {string} id
 *  The ID of the Record
 *
 *  @param {string} band
 *  The Band of the Record
 *
 *  @param {dictionary|undefined|null} value
 *  The Record.
 *
 *  @param {Transport~get_callback|undefined} callback
 *  Optional callback
 */
Transport.prototype.update = function (paramd, callback) {
    var self = this;

    throw new Error("Not Implemented");
};

Transport.prototype._validate_update = function (paramd, callback) {
    if (!_.is.Dictionary(paramd)) {
        throw new Error("update: 'paramd' must be a Dictionary");
    }
    if (!_.is.Function(callback) && (callback !== undefined)) {
        throw new Error("update: 'callback' must be a Function or undefined");
    }
    if (!paramd.id) {
        throw new Error("update: 'paramd.id' is required");
    }
    if (!_.is.String(paramd.id)) {
        throw new Error("update: 'paramd.id' must be a string");
    }
    if (!paramd.band) {
        throw new Error("update: 'paramd.band' is required");
    }
    if (!_.is.String(paramd.band)) {
        throw new Error("update: 'paramd.band' must be a string");
    }
};

/**
 *  Callback when a Record is updated.
 *  <p>
 *  Probably could be made a hell of a lot more efficient
 *
 *  @param {string|undefined} id
 *  Optional. The ID of the Record
 *
 *  @param {string|undefined} band
 *  Optional. The Band of the Record (note band can't
 *  be defined with the id)
 *
 *  @param {Transport~get_callback} callback
 */
Transport.prototype.updated = function (paramd, callback) {
    var self = this;

    throw new Error("Not Implemented");
};

Transport.prototype._validate_updated = function (paramd, callback) {
    if (!_.is.Dictionary(paramd)) {
        throw new Error("updated: 'paramd' must be a Dictionary");
    }
    if (!_.is.Function(callback)) {
        throw new Error("updated: 'callback' must be a Function");
    }
    _.defaults(paramd, {
        id: null,
        band: null,
    });
};

/**
 *  Remove a Record. Note that all bands are removed
 *  <p>
 *  NOT IMPLEMENTED for IOTDB
 *
 *  @param {string} id
 *  The ID of the Record
 */
Transport.prototype.remove = function (paramd, callback) {
    var self = this;

    throw new Error("Not Implemented");
};

Transport.prototype._validate_remove = function (paramd, callback) {
    if (!_.is.Dictionary(paramd)) {
        throw new Error("remove: 'paramd' must be a Dictionary");
    }
    if (!_.is.Function(callback) && (callback !== undefined)) {
        throw new Error("remove: 'callback' must be a Function or undefined");
    }
    if (!paramd.id) {
        throw new Error("remove: 'paramd.id' is required");
    }
};


/**
 *  API
 */
exports.Transport = Transport;
