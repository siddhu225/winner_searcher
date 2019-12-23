const express = require('express')
const path = require('path')
const hbs = require('hbs')
const app = express()
var _ = require('lodash');
const fs = require('fs');

// Define paths for Express config
console.log(__dirname);
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//loading JSON files
const prizes = JSON.parse((fs.readFileSync(__dirname + '/prize.json', 'utf8')).toString()).prizes;
const countries = (JSON.parse((fs.readFileSync(__dirname + '/country.json', 'utf8')).toString())).countries;
const laureates = (JSON.parse((fs.readFileSync(__dirname + '/laureate.json', 'utf8')).toString())).laureates;

// console.log(laureates);


app.get('', (req, res) => {
  res.render('index', {
      title: 'Search Winners',
      name: 'Sai Siddardha'
  })
})

// Task:
// The application should take winner name (partial, case-insensitive) as a parameter and render
// * Field (chemistry/physics etc) they won for,
// * Country of the winner,
// * The year they won the prize.
// * Whom all they shared the prize with (See prize.json) : Ex: 2019/chemistry : John Goodenough, M. Stanley Whittingham and Akira Yoshino

app.get('/winner',(req,res)=> {

  if(!req.query.name) {
    return res.send({
      error: 'You must provide an name!'
    })
  }
  try{
    let final_winner = {
      persons: [],
      names: []
    }
    let persons = [];

    //finding the persons with req.query.name we got from frontend
    persons = _.filter(laureates, (laureate) => {
      let name = _.toLower(laureate.firstname + laureate.surname);
      return name.includes(_.toLower(req.query.name));
    });
  
    if(persons.length > 0) { persons = persons[0] }; //If the same name found multiples times i am appending only the first one
  
    final_winner['persons'].push(persons); //appending to the final person
    let prize_1 = persons.prizes[0];
  
    //finding his associate mates who won with him
    let laureate = _.filter(prizes, (prize) => {
      return (prize_1.year == prize.year && prize_1.category === prize.category);
    });
  
    //As we want only names we are appending to the final winner
    let names = []
    _.forEach(laureate[0].laureates,(prize)=>{
      let name = prize.firstname + prize.surname;
      names.push(name);
    })
  
    final_winner['names'].push(names);
  
    res.status(200).send(final_winner);
  } catch(e) {
    res.status(500).send(e);
  }

})

app.listen(3000, () => {
  console.log('Server is up on port 3000.')
})