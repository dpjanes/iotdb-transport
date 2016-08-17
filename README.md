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

* tell a MQTT Transporter to `monitor` a IOTDB Transporter, so that all changes to
  the IOTDB Transporter go to the MQTT transporter, and all requests
  sent to the MQTT Transporter update the IOTDB Transporter
* simlar for CoAP Transporter
* tell a Express Transporter to `use` a IOTDB Transporter as a data source,
  such that an API is exported to IOTDB in a couple of lines of code

Our intention is to develop more Transporters for popular data stores.

# API
## Standard Methods
## Helper Methods
## Binding Methoss
