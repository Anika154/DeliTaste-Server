const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://delitastenew:dd3Nb7MgDpzQW50w@cluster0.urlm5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        console.log("hitting d");
        const database = client.db('delitaste');
        const offerCollection = database.collection('offer');
        const orderCollection = database.collection('order');

        //GET API for offer
        app.get('/offer',async(req,res)=>{
            console.log('called offer',req.query.id);

            if(req.query.id){
                const id = req.query.id;
                const cursor = await offerCollection.findOne({_id: ObjectId(id)});
                res.send(cursor);
            }
            else{
                const cursor = offerCollection.find({});
                const offer = await cursor.toArray();
                res.send(offer);
    
            }
        });

        //GET API for order
        app.get('/order',async(req,res)=>{
            if (req.query.email) {
                const email = req.query.email;
                const cursor = orderCollection.find({email: email});
                const order = await cursor.toArray();
                res.send(order);
            }
            else{
                const cursor = orderCollection.find({});
                const order = await cursor.toArray();
                res.send(order);
            }
            
        });

        //GET single offer
        app.get('/offer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const offer = await offerCollection.findOne(query);
            res.json(offer);
        });

        //Delete API
        app.delete('/order', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);

        });

        //PUT API
        app.put('/order', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: "Approved"
                }
            }
            const result = await orderCollection.updateOne(query, updateDoc);
            res.json(result);
        });

        //POST API for offer
        app.post('/offer', async (req, res) => {
            const offer = req.body;
            console.log('hit the post api', offer);

            const result = await offerCollection.insertOne(offer);
            console.log(result);
            res.send(result)
        });

        app.post('/order', async (req, res) => {
            const order = req.body;
            console.log('hit the post api', order);

            const result = await orderCollection.insertOne(booking);
            console.log(result);
            res.send(result)
        });
    }
    finally {
        //await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running server')
});

app.listen(port, () => {
    console.log('Running hotel Server', port);
})
