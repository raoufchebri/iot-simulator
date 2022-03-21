const casual = require('casual');

function randomSensorData(sensor) {
    switch (sensor.type) {
        case 'Temperature':
            return 101 + casual.integer(0, 10);
        case 'Pulse':
            return 101 + casual.integer(0, 40);
        case 'Location':
            return 35 + casual.integer(0, 5);
        case 'Respisation':
            return 10 * casual.random;
    }
}

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = { randomSensorData, delay };
