/*----------------------------------
   Dependencies
----------------------------------*/
require("dotenv").config()

const { PORT = 3000, MONGODB_URL } = process.env

const express = require("express")
const mongoose = require("mongoose")
const app = express()

const cors = require("cors")
const morgan= require("morgan")

////////////////////////////////
// Routes and Routers
///////////////////////////////
// test route
app.get("/", (req, res) => {
    res.send("hello world")
})


/*----------------------------------
Database connection
----------------------------------*/
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

mongoose.connection
.on("open", ()=>console.log("Connected to Mongo"))
.on("close", ()=>console.log("Disconnected from Mongo"))
  .on("error", (error) => console.log(error))


/*----------------------------------
   Models
----------------------------------*/
const PeopleSchema = new mongoose.Schema({
  name: String,
  image: String,
  title: String
})

const People = mongoose.model("People", PeopleSchema)
/*----------------------------------
   Middleware
----------------------------------*/
app.use(cors()) //prevent cors errors
app.use(morgan("dev")) //logging
app.use(express.json()) //parse json bodies

/*----------------------------------
   Routes and Routers
----------------------------------*/
//test route
app.get("/", (req, res) => {
  res.send("Hello World")
 } 
)

//index route
app.get("/people", async (req, res) => {
  try {
    res.json(await People.find({}))
  } catch (error) {
    res.status(400).json({error})
  }
})

// Create Route - post request to /people
// create a person from JSON body
app.post("/people", async (req, res) => {
    try {
        // create a new people
        res.json(await People.create(req.body))
    } catch (error){
        //send error
        res.status(400).json({error})
    }
})

//update route
app.put("/people/:id", async (req, res) => {
  try {
    res.json(
      await People.findByIdAndUpdate(req.params.id, req.body, {new:true})
    )
  } catch (error) {
    res.status(400).json({error})
  }
})

//Destroy Route

app.delete(`/people/:id`, async (req, res) => {
  try {
    res.json(
      await People.findByIdAndRemove(req.params.id)
    )
  } catch (error) {
    res.status(400).json({error})
    
  }
})


  ///////////////////////////////
//Server listener
////////////////////////////////
app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`)
  })