'use strict';
import * as tf from '@tensorflow/tfjs';

let celToFerData = [];
let ferToCelData = [];

for (let i = -500; i < 5000; i++) {
    celToFerData.push({
        c: i,
        f: (i * 1.8) + 32
    });
}
for (let i = -500; i < 5000; i++) {
    ferToCelData.push({
        c: (i - 32) * 0.5556,
        f: i,
    });
}

console.log('boom! test data', celToFerData, ferToCelData);

// configure the model
const config = {
    epochs: 5000,
    loss: 'meanSquaredError',
    optimizer: tf.train.adam(0.1)
}
const model = tf.sequential();
model.add(tf.layers.dense({
    inputShape: [1],
    activation: 'sigmoid',
    units: 2
}));
model.add(tf.layers.dense({
    inputShape: [2],
    activation: 'sigmoid',
    units: 1
}));
model.compile({
    loss: config.loss,
    optimizer: config.optimizer
});


// group training data with expected result
const training = {
    inputs: [],
    labels: []
};
for (let entry of celToFerData) {
    training.inputs.push([entry.c]);
    training.labels.push([entry.f]);
}

// train && predict the things!
model.fit(
    tf.tensor(training.inputs),
    tf.tensor(training.labels),
    {
        epochs: config.epochs
    }).then((res) => {
        console.log("done!", res);
        const prediction = model.predict(tf.tensor([40]));
        const predictionPromise = prediction.data();

        predictionPromise.then((result) => {
            console.log(result);
        });
    });
