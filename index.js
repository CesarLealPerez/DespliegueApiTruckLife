const express = require('express')
const app = express()

// https://www.npmjs.com/package/cors
const cors = require('cors');
app.use(cors());

// https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// https://www.npmjs.com/package/multer
const multer  = require('multer');
const response = require('express');
const mimeParser = multer();

/*const MongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/talleres';
var collUsuarios, collTalleres;
MongoClient.connect(mongoURL)
		.then(
			client => {
        collUsuarios = client.db().collection('usuarios');
        collTalleres = client.db().collection('talleres');
        collOpiniones = client.db().collection('opiniones');
      }
		);
*/
var dbName;
if (process.env.NODE_ENV === 'production') {
  dbName = 'talleres';
} else {
  dbName = 'talleresTests';
}

    const MongoClient = require('mongodb').MongoClient;
    const mongoURL = `mongodb+srv://gatitos:96A1fhgRREapLSrn@motorlife.ximpv.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    var collUsuarios, collTalleres;
    MongoClient.connect(mongoURL, { useNewUrlParser: true })
		.then(
			client => {
        collUsuarios = client.db().collection('usuarios');
        collTalleres = client.db().collection('talleres');
        collOpiniones = client.db().collection('opiniones');
      }
		);


const port = process.env.PORT || 3000;

app.get('/', (req, res) => {  
  res.send('General');
  console.log('General');
})
   
app.post('/register/',mimeParser.none(), async (req,res)=>{ //registro de usuario, es post porque vas a crear los datos de un nuevo formulario de alta
  try {
    var nombre = req.body.nombre;
    var nick = req.body.nick;
    var localidad = req.body.localidad;
    var telefono = req.body.telefono;
    var email = req.body.email;
    var redesSociales = req.body.redesSociales;
    var miMarca = req.body.miMarca;
    var kilometros = req.body.kilometros;
    var resumen = req.body.resumen;
    var password = req.body.password;

    var doc = {
      nombre: nombre,
      nick: nick,
      localidad: localidad,
      telefono: telefono,
      email: email,
      redes: redesSociales,
      miMarca: miMarca,
      kilometros: kilometros,
      resumen: resumen,
      password: password,
    };

    var UserExistsAtMongo = await collUsuarios.findOne(
      {$or:[
        {nombre : req.body.nombre},
        {nick : req.body.nick},
        {telefono : req.body.telefono},
        {email : req.body.email},
      ]}
      )
    if(UserExistsAtMongo){
      console.log('Denegada la creacion del usuario');
      res.status(418).send(err);
    } else {

      collUsuarios.insertOne(doc)
      res.send('Ok')
      console.log('Usuario creado correctamente')
    }
  } catch (err) {
    res.status(418).send(err);
  };
  })

  app.post('/profesional/', mimeParser.none(),async (req,res)=>{
    
    try {

      var taller = req.body.taller;
      var marca = req.body.marca;
      var horario = req.body.horario;
      var especialidades = req.body.especialidades; // Mecanica, Electricidad, Chapa y pintura, A/A, etc. un desplegable
      var direccion = req.body.direccion;
      var telefono = req.body.telefono;
      var email = req.body.email;
      var redesSociales = req.body.redesSociales;
      var gps = req.body.gps;
      var urgencia = req.body.urgencia; //booleano si/no
      var grua = req.body.grua; //booleano si/no
      var password = req.body.password;

      var miTaller = {
        taller: taller,
        marca: marca,
        horario: horario,
        especialidades: especialidades,
        direccion: direccion,
        telefono: telefono,
        email: email,
        redes: redesSociales,
        gps: gps,
        urgencia: urgencia,
        grua: grua,
        password: password,
      };

  var UserExistsAtMongo = await collTalleres.findOne(
    {$or:[
      {taller : req.body.taller},
      {direccion : req.body.direccion},
      {telefono : req.body.telefono},
      {email : req.body.email},
    ]}
    )
  if(UserExistsAtMongo){
    console.log('Denegada la creacion del Taller');
    res.status(418).send(err);
  } else {

    collTalleres.insertOne(miTaller)
    res.send('Ok')
    console.log('Taller creado correctamente')
  }
} catch (err) {
  res.status(418).send(err);
};
})
  app.post('/update/',mimeParser.none(),(req,res)=>{//actualizar la db
  
    try {
      var nombre = req.body.nombre;
      var nick = req.body.nick;
      var localidad = req.body.localidad;
      var telefono = req.body.telefono;
      var email = req.body.email;
      var redesSociales = req.body.redesSociales;
      var miMarca = req.body.miMarca;
      var kilometros = req.body.kilometros;
      var resumen = req.body.resumen;
  
      var doc = {
        nombre: nombre,
        nick: nick,
        localidad: localidad,
        telefono: telefono,
        email: email,
        redes: redesSociales,
        miMarca: miMarca,
        kilometros: kilometros,
        resumen: resumen,
      };
  
      collUsuarios.updateOne({nick: req.body.nick},{$set:doc})
        .then(
          mongoRes => res.send('Ok')
        );
      console.log('Update')
  
  } catch (err) {
    res.send(err);
  };
})

app.post('/updateProfesional/',mimeParser.none(),(req,res)=>{       //actualizar la db de Talleres
  
  try {

    var taller = req.body.taller;
    var marca = req.body.marca;
    var horario = req.body.horario;
    var direccion = req.body.direccion;
    var especialidades = req.body.especialidades; 
    var telefono = req.body.telefono;
    var email = req.body.email;
    var redesSociales = req.body.redesSociales;
    var gps = req.body.gps;
    var urgencia = req.body.urgencia; 
    var grua = req.body.grua; 

    var miTaller = {
      taller: taller,
      marca: marca,
      horario: horario,
      especialidades: especialidades,
      direccion: direccion,
      telefono: telefono,
      email: email,
      redes: redesSociales,
      gps: gps,
      urgencia: urgencia,
      grua: grua,
    };


    collTalleres.updateOne({taller: req.body.taller},{$set:miTaller})
      .then(
        mongoRes => res.send('Ok')
      );
    console.log('Update Profesional')

} catch (err) {
  console.error(err)
  res.send(err);
};
})

app.post('/login/', mimeParser.none(), async (req,res) =>{  //identificacion de Usuario
  
  try{

    var usuario = req.body.usuario;

    var password = req.body.password;
      
    user = await collUsuarios.findOne({nick: usuario, password: password});


    if (user){
    
    res.status(200).send('Ok');
  
   }
  } catch (err) {
    res.status(400).send(err);
  };
})

app.post('/loginProfesional/', mimeParser.none(), async (req,res) =>{  //identificacion de Taller
  
  try{

    var taller = req.body.taller;

    var password = req.body.password;
      
    user = await collTalleres.findOne({taller: taller, password: password});

    if (user){
    
    res.status(200).send('Ok');
  
   }
  } catch (err) {
    res.status(400).send(err);
  };
})

app.get('/user/', async (req,res)=>{  //panel de control de usuario
    var nickBuscado = req.query.nickBuscado;
    var objeto = await collUsuarios.findOne({nick: nickBuscado});
    var json = JSON.stringify(objeto)
    res.send(json);
})

app.get('/userProfesional/', async (req,res)=>{  //panel de control de usuario
  // res.header('Access-Control-Allow-Origin', '*'); 
   var tallerBuscado = req.query.tallerBuscado;
     var objeto = await collTalleres.findOne({taller: tallerBuscado});
     var json = JSON.stringify(objeto)
     res.send(json);
 })

app.post('/post/', mimeParser.none(), async (req,res)=>{ //PUBLICAR opinion, es post porque va a añadir una opinion
  
  try {
    var nombre = req.body.nombre;
    var usuario = await collUsuarios.findOne({nombre: nombre});
    var taller = req.body.taller;
    var opinion = req.body.opinion;
    var valoracion = req.body.valoracion;
    
    var doc = {
      nombre: nombre,
      email: usuario.email,
      taller: taller,
      opinion: opinion,
      valoracion: valoracion,
    };

    collOpiniones.insertOne(doc)
      .then(
        mongoRes => res.send('Ok')
      );
    console.log('Post')

} catch (err) {
  res.send(err);
};
})

app.post('/delete/',(req,res)=>{ //ELIMINAR opinion, es post porque vas a eliminar esa opinion
 
  try {

    collOpiniones.remove({nick:req.body.nick},{taller:req.body.taller})
      .then(
        mongoRes => res.send('Borrada opinion')
      );

} catch (err) {
  res.send(err);
};
})

app.get('/leer/',mimeParser.none(), async (req,res)=>{ //LEER opinion publicada
 
  try {
   
    var taller = req.query.tallerBuscado;
    var objeto = await collOpiniones.find({taller:taller}).sort({_id:-1}).limit(5).toArray();
    var json = JSON.stringify(objeto);
    res.send(json);
  } catch (err) {
  res.send(err);
};
})

app.get('/leerTodo/',mimeParser.none(), async (req,res)=>{ //LEER opinion publicada
 
  try {
   
    var taller = req.query.tallerBuscado;
    var objeto = await collOpiniones.find({taller:taller}).sort({_id:-1}).toArray();
    var json = JSON.stringify(objeto);
    res.send(json);
  } catch (err) {
  res.send(err);
};
})

app.get('/puntosmapa/', async (req,res)=>{
  const findFilter = {};
  const findOptions = {
      projection: {
        taller: 1,
        marca: 1,
        horario: 1,
        especialidades: 1,
        direccion: 1,
        telefono: 1,
        email: 1,
        redes: 1,
        gps: 1,
        urgencia: 1,
        grua: 1,
      },
  };

  const talleres = await collTalleres.find(findFilter,findOptions).toArray();

  const talleresLatLng = talleres.map((taller)=>{
    taller.lat = taller.gps[1];
    taller.lng = taller.gps[0];
    return taller;
  })

  const json = JSON.stringify(talleresLatLng)

  res.send(json);

});

app.listen(port,()=>{
	
})

/*console.log(`Todo listo y escuchando en http://localhost:${port}/`);
	console.log('End points:');
  console.log('-> http://localhost:3000//');
  console.log('-> http://localhost:3000/register/');
  console.log('-> http://localhost:3000/profesional/');
  console.log('-> http://localhost:3000/update/');
  console.log('-> http://localhost:3000/updateProfesional/');
  console.log('-> http://localhost:3000/login/');
  console.log('-> http://localhost:3000/loginProfesional/')
  console.log('-> http://localhost:3000/user/')
  console.log('-> http://localhost:3000/userProfesional/')
  console.log('-> http://localhost:3000/post/');  
  console.log('-> http://localhost:3000/delete/');
  console.log('-> http://localhost:3000/leer/')
  console.log('-> http://localhost:3000/leerTodo/')
  console.log('-> http://localhost:3000/puntosmapa/')*/