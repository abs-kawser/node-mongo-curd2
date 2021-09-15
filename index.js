const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


const password = "0IiBnv1eEvlKm9i7";
const uri = "mongodb+srv://Organicdb:0IiBnv1eEvlKm9i7@cluster0.n8dqd.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//html file send kora hoisa
app.get('/', (req, res) => {

  res.sendFile(__dirname + '/index.html');

})





client.connect(err => {
  let productCollection = client.db("organicdb").collection('Products');

  // red operation
  app.get('/Products', (req, res) => {
    productCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
        // console.log("data post");
      })
  })



  // create 
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
      .then(result => {
        console.log("data added successfully");
        res.send('success')
      });
  });

 
 //update product
 app.patch('/update/:id',(req, res)=> {
    productCollection.updateOne({_id:ObjectId(req.params.id)},
    {
        
      $set:{price: req.body.price ,quantity: req.body.quantity}
    })
    .then( result => {
      console.log(result);
    })
    
    
    
    
 });




  //delete 
  app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({ _id: ObjectId(req.params.id)})
      .then(result => {
        console.log(result);
      });
  });

 //single product add korar jonno
 app.get('/Products/:id', (req, res) => {
  productCollection.find({_id:ObjectId(req.params.id)})
  .toArray((err, documents) => {
    res.send(documents[0]);
  });
    });



});

app.listen(3000);