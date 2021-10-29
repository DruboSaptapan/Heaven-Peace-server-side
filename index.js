const express = require('express');
const { MongoClient } = require("mongodb")
const objectId = require('mongodb').ObjectId;

const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b5wnr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('heaven_peace')
        const servicesCollection = database.collection('service');
        console.log('Successfully database connected.')

        // get api
        app.get('/service', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // get single service
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service.', id)
            const query = { _id: objectId(id) };
            const service = await servicesCollection.findOne(query)
            res.json(service);
        })

        // post api
        app.post('/service', async (req, res) => {
            const service = req.body;
            console.log('Hit the post api', service)

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })

        // DELETE API
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id:objectId(id) }
            const result = await servicesCollection.deleteOne(query)
            res.json(result)
        })
    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to heaven peace website server');
});

app.listen(port, () => {
    console.log(`I'm listening at ${port}`);
})