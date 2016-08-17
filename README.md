# iotdb-transport
IOTDB Transport base.

<img src="https://raw.githubusercontent.com/dpjanes/iotdb-homestar/master/docs/HomeStar.png" align="right" />

# Introduction
## Overview

In the IOTDB "worldview", Things are modelled as a collection of JSON dictionaries, called **bands**.
If you have all the bands of a Thing, you have a complete representation of the Thing.

Typical bands are:

* **model** the semantic model that explains the **istate** and **ostate** bands
* **istate** the *input state*, that is the current state of a Thing
* **ostate** the *output state*, the state we want a Thing to transition to
* **meta** the Thing's metadata, e.g. its name, its manufacturer
* **connection** the Thing's connection status

A Transporter is a collection of all the band data for some group of Things.

## Why?

Transporters are designed to plug together like Legos, to move data around. 

The most important Transporter is the [IOTDB Transporter](https://github.com/dpjanes/iotdb-transport-iotdb),
which wraps up all the data from an IOTDB installation, e.g. all the Things
on reachable from a computer.

Here's something things you can do:

* tell a [MQTT Transporter](https://github.com/dpjanes/iotdb-transport-mqtt) to `monitor` a IOTDB Transporter, so that all changes to
  the IOTDB Transporter go to the MQTT transporter, and all requests
  sent to the MQTT Transporter update the IOTDB Transporter
* simlar for [CoAP Transporter](https://github.com/dpjanes/iotdb-transport-coap)
* tell a [Express Transporter](https://github.com/dpjanes/iotdb-transport-express) to `use` a IOTDB Transporter as a data source,
  such that an API is exported to IOTDB in a couple of lines of code

Our intention is to develop more Transporters for popular data stores.

# API

These APIs use [Reactive Extentsions](https://github.com/Reactive-Extensions/RxJS).

## Standard Methods

For these Standard Methods, all Transporters guarantee that every
time `onNext` is called, the payload will be a new shallow clone
of the argument `d`, with new / requested data layered on top.

So it's safe to pass in data using your own keys, and it's safe to
modify the results you get out (within the bounds of shallow clones).

### list(d)

Returns observable that will `onNext` every `thing.id`, then `onCompleted`.

### added(d)

Returns observable that will `onNext` every time a new `thing.id` is found.
`onCompleted` is normally never called.

### updated(d)

Returns observable that will `onNext` every time a change is seen.
`thing.id` and `thing.band` are delivered, `thing.value` may not be.
`onCompleted` is normally never called.

The results can be restricted by using `d.id`; or `d.id` and `d.band`

### put(d)

Update a Thing's band. `d.id`, `d.band` and `d.value` are all required.

After a successful update, `onNext` is called with a updated value, then `onCompleted`.

If the update fails, `onError` will be called with an appropriate error code.

**Special Case**:
if `d.silent` is `true`, normal errors will be silently ignored and just
`onCompleted` will be called. 
All Transporters are guaranteed to support this.

Normal errors are:

* timestamp errors: trying to update newer data with older data
* thing not found
* band not found

### get(d)

Get a Thing's band's value. `d.id`, `d.band` are required.
`thing.id`, `thing.band` and `thing.value` are delivered.

### bands(d)

Get the bands for a Thing. `d.id`

## Helper Methods

### all(d)

## Binding Methods

### use(source_transport, d)
### monitor(source_transport, d)

# Sample Code

Sample code can be found on GitHub in various concrete implementations of the Transporters.
The [Express Transporter](https://github.com/dpjanes/iotdb-transport-express) is a good place
to start.





