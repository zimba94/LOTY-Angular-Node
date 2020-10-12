import * as functions from 'firebase-functions';

import * as express from 'express';
import * as cors from 'cors'; 

//configuración para la base de datos en firebase////////
import * as admin from 'firebase-admin';

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lenguajes-cfc87.firebaseio.com"
});


const db = admin.firestore();

/////////////////////////////////////////////////////////

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//


export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.json("Hello Simba2!");
});


export const getLOTY = functions.https.onRequest(async(request, response) => {
    // const nombre = request.query.nombre ||"Simba";
    // response.json({
    //     nombre
    // });

    const lotyRef = db.collection('loty');
    const docSnap = await lotyRef.get();
    const lenguajes = docSnap.docs.map(doc => doc.data());

    response.json(lenguajes);


  });
  

  //Express

  const app = express();
  app.use(cors({origin: true}));

  app.get('/loty', async(req, res)=>{


    const lotyRef = db.collection('loty');
    const docSnap = await lotyRef.get();
    const lenguajes = docSnap.docs.map(doc => doc.data());
  
    res.json(lenguajes);

  });

//post para actualizar los votos

  app.post('/loty/:id', async(req, res)=>{

    const id = req.params.id;
    const lengRef = db.collection('loty').doc(id);
    const lengSnap = await lengRef.get();
    
    if (!lengSnap.exists) {
      res.status(404).json({
        ok:false,
        mensaje: "No existe un lenguage con ese id: " + id
      });
    } else {
      const antes = lengSnap.data() || {votes:0};
      await lengRef.update({
        votes: antes.votes + 1
      });

      res.json({
        ok:true,
        mensaje: `Gracias por tu voto a ${antes.name}`
      });
    }

  });


  //exports.api = functions.https.onRequest(app);

  export const api = functions.https.onRequest(app);