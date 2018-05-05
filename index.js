#!/usr/bin/env node

'use strict';

const Jetty = require("jetty");
const Table = require('cli-table2');
const chalk = require('chalk');
const noble = require('noble');

const peripherals = [];

let throbberState = 0;
const fps = 10;
const throbberStates = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'.split('');
const throbberInterval = setInterval(() => {
	throbberState++;
	throbberState = throbberState % throbberStates.length;
	draw();
}, 1000/fps);

const jetty = new Jetty(process.stdout);
jetty.clear();

const table = new Table({
    head: [
    	'MAC',
    	'Name',
    	'# Services',
    	'Address type',
    ].map(title => {
	    return chalk.cyan(title);
    }),
    colWidths: [
	    20,
	    30,
    ]
});

noble
	.on('discover', onDiscover)
	.startScanning();
	
draw();

function onDiscover(peripheral) {
	const { id, address, advertisement, addressType } = peripheral;
	const { localName, txPowerLevel, manufacturerData, serviceUuids } = advertisement;
	
	table.push([
		address,
		localName,
		serviceUuids.length,
		addressType
	].map(item => {
		if( typeof item === 'undefined' ) return '-';
		return item;
	}));
	draw();
}

function draw() {
	jetty.clear();
	jetty.moveTo([0, 0]);
	jetty.text(throbberStates[throbberState] + ' ');
	jetty.text('Scanning for BLE Peripherals...\n');
	jetty.text( table.toString() );
	jetty.text('\n');
}