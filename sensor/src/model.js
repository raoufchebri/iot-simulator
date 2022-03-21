const casual = require('casual');

const SENSOR_TYPES = ['Temperature', 'Pulse', 'Location', 'Respisation'];

casual.define('owner', function () {
    return {
        owner_id: casual.uuid,
        name: casual.name,
        address: casual.address,
    };
});

casual.define('pet', function () {
    return {
        name: casual.name,
        pet_id: casual.uuid,
        age: casual.integer(1, 20),
        weight: casual.integer(5, 10),
    };
});

class Owner {
    constructor() {
        const { owner_id, address, name } = casual.owner;
        this.owner_id = owner_id;
        this.address = address;
        this.name = name;
    }
    static get tableName() {
        return 'owner';
    }

    static get columns() {
        return ['owner_id', 'address', 'name'];
    }
}

class Pet {
    constructor(owner) {
        this.owner_id = owner.owner_id;
        this.pet_id = casual.uuid;
        this.age = casual.integer(1, 100);
        this.weight = casual.integer(5, 10);
        this.address = owner.address;
        this.name = casual.name;
    }

    static get tableName() {
        return 'pet';
    }

    static get columns() {
        return ['owner_id', 'pet_id', 'age', 'weight', 'address', 'name'];
    }
}

class Sensor {
    constructor(pet) {
        this.pet_id = pet.pet_id;
        this.sensor_id = casual.uuid;
        this.type = casual.random_element(SENSOR_TYPES);
    }
    static get tableName() {
        return 'sensor';
    }

    static get columns() {
        return ['pet_id', 'sensor_id', 'type'];
    }
}

class Measure {
    constructor(sensor_id, ts, value) {
        this.sensor_id = sensor_id;
        this.ts = ts;
        this.value = value;
    }
    static get tableName() {
        return 'measurement';
    }

    static get columns() {
        return ['sensor_id', 'ts', 'value'];
    }
}

module.exports = { Owner, Pet, Sensor, Measure };
