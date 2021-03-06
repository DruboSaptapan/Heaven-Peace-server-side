const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 7000;

// MiddleWare
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b5wnr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {

        /* Connect to database */
        await client.connect();
        const database = client.db("heavenPeace")
        const packagesCollection = database.collection("packages")
        const ordersCollection = database.collection("orders")

        /* Get Packages API */
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        /* Add Packages API */
        app.post('/packages', async (req, res) => {
            const package = req.body;
            const result = await packagesCollection.insertOne(package);
            res.json(result);
        })

        // Get Single Package
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await packagesCollection.findOne(query);
            res.json(package);
        })

        /* Add Orders API */
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })

        /* get Orders API */
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        /* get MyOrders API */
        app.post('/orders/email', async (req, res) => {
            const email = req.body.email;
            const query = { "email": email };
            const result = await ordersCollection.find(query).toArray();
            res.json(result);
        })

        /* update status */
        // app.post('/updateStatus', async(res, req) => {
        //     const id = req.body.id
        //     const status = req.body.status
        //     const filter = {_id: ObjectId(id)};
        //     const options = {upsert : true};
        //     const updateStatus = {
        //         $set: {
        //             "status" : status === "pending" ? "approve" : "pending"
        //         };
        //     };
        //     const result = await ordersCollection.updateOne(filter, updateStatus, options);
        //     res.json(result)
        // })
        
        /* delete Orders API */
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome to Heaven Peace server')
});


app.listen(port, () => {
    console.log(`I'm listening to ${port}`)
})