const casual = require('casual');
const { Owner, Pet, Sensor, Measure } = require('./model');
const { randomSensorData, delay } = require('./helpers');
const moment = require('moment');
const { insertQuery, getClient } = require('./db');

const INTERVAL = 1000;
const BUFFER_INTERVAL = 5000;

async function main() {
    // Create a session and connect to the database
    const client = getClient();
    // Generate random owner, pet and sensors
    const owner = new Owner();
    const pet = new Pet(owner);
    const sensors = new Array(casual.integer(1, 4))
        .fill()
        .map(() => new Sensor(pet));
    await saveData(client, owner, pet, sensors);
    // Generate random measurements
    await runSensorData(client, sensors);
    return client;
}

async function runSensorData(client, sensors) {
    while (true) {
        const measures = [];
        const last = moment();
        while (moment().diff(last) < BUFFER_INTERVAL) {
            await delay(INTERVAL);
            measures.push(
                ...sensors.map((sensor) => {
                    const measure = new Measure(
                        sensor.sensor_id,
                        Date.now(),
                        randomSensorData(sensor)
                    );
                    console.log(
                        `New measure: 
                         sensor_id: ${measure.sensor_id} 
                         type: ${sensor.type} 
                         value: ${measure.value}`
                    );
                    return measure;
                })
            );
        }

        console.log('Pushing data');

        const batch = measures.map((measure) => ({
            query: insertQuery(Measure),
            params: measure,
        }));

        await client.batch(batch, { prepare: true });
    }
}

async function saveData(client, owner, pet, sensors) {
    await client.execute(insertQuery(Owner), owner, { prepare: true });
    console.log(`New owner # ${owner.owner_id}`);

    await client.execute(insertQuery(Pet), pet, { prepare: true });
    console.log(`New pet # ${pet.pet_id}`);

    for (let sensor of sensors) {
        await client.execute(insertQuery(Sensor), sensor, { prepare: true });
        console.log(`New sensor # ${sensor.sensor_id}`);
    }
}

main().then((client) => client.shutdown());
