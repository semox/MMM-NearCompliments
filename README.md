# MMM-NearCompliments
This is an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It uses the USER_PRESENCE notification of [MMM-PIR-Sensor](https://github.com/semox/MMM-NearCompliments.git) to activate distance measurement of a [HC-SR04 sensor](https://tutorials-raspberrypi.de/entfernung-messen-mit-ultraschallsensor-hc-sr04/) to display the compliments module for a specified time when a measured distance is fallen below a specified distance. Inspired by https://github.com/thobach/MMM-Gestures and https://github.com/mochman/MMM-Swipe.

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/semox/MMM-NearCompliments.git`. A new folder will appear navigate into it.
2. Execute `npm install` to install the node dependencies.
3. Configure config/config.js with documentation below.
4. Reboot your Pi.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-NearCompliments',
		// position: 'bottom_left',
		config: {
			// See 'Configuration options' for more information.
		}
	}
]
````

## Configuration Options

The following properties can be configured:

<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>echoPin</code></td>
			<td>The echo pin your HC-SR04 is connected to.
			</td>
		</tr>
		<tr>
			<td><code>triggerPin</code></td>
			<td>The trigger pin your HC-SR04 is connected to.
			</td>
		</tr>
		<tr>
			<td><code>distance</code></td>
			<td>Specified distance in cm which measured distance has to be smaller to display compliments module.
				<br><b>Possible values:</b> <code>int</code>
                                <br><b>Default value:</b> <code>70</code>
			</td>
		</tr>
		<tr>
			<td><code>sensorTimeout</code></td>
			<td>Sensor timeout to ignore bad measurements.
  				<br><b>Possible values:</b> <code>int</code>
                                <br><b>Default value:</b> <code>5000</code>
			</td>
		</tr>
		<tr>
			<td><code>animationSpeed</code></td>
			<td>Animation speed in ms to display compliments module.
				<br><b>Possible values:</b> <code>int</code>
				<br><b>Default value:</b> <code>200</code>
			</td>
		</tr>
		<tr>
			<td><code>measuringInterval</code></td>
			<td>Measuring interval of two measured distances. Defined in ms.
				<br><b>Possible values:</b> <code>int</code>
				<br><b>Default value:</b> <code>500</code>
			</td>
		</tr>
		<tr>
			<td><code>delay</code></td>
			<td>Delay defined in seconds to show compliments module.
				<br><b>Possible values:</b> <code>int</code>
				<br><b>Default value:</b> <code>30</code>
			</td>
		</tr>
		<tr>
			<td><code>autoStart</code></td>
			<td>Auto start the distance measurment. Use only if MMM-PIR-Sensor is _not_ available.
				<br><b>Possible values:</b> <code>boolean</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>usePIR</code></td>
			<td>Should we use PIR sensor to activate only distance measurment when USER_PRESENCE notification is sent by MMM-PIR-Sensor?
				<br><b>Possible values:</b> <code>boolean</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
		<tr>
			<td><code>powerSavingDelay</code></td>
			<td>Power saving delay in seconds defined in MMM-PIR-Sensor. It gets overwritten by MMM-PIR-Sensore module and is only defined for backup purpose.
				<br><b>Possible values:</b> <code>int</code>
				<br><b>Default value:</b> <code>30</code>
			</td>
		</tr>
		<tr>
			<td><code>verbose</code></td>
			<td>Verbose mode to give more information in log.
				<br><b>Possible values:</b> <code>boolean</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
		<tr>
                        <td><code>calibrate</code></td>
                        <td>Calibration mode to display measured distance on magic mirror. Note: You have to define <code>position: 'bottom_left'</code> in config.js.
                                <br><b>Possible values:</b> <code>boolean</code>
                                <br><b>Default value:</b> <code>false</code>
                        </td>
                </tr>
	</tbody>
</table>


The MIT License (MIT)
=====================

Copyright © 2019 Sebastian Kirschner

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**
