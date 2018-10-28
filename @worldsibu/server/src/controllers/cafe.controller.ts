import * as crypto from 'crypto';
import { Router, Request, Response } from 'express';

import { Helper, Cafe, Models, CafeController, Participant, ParticipantController } from '../utils';

const router: Router = Router();

ParticipantController.init();

/** Get all the users */
// router.get('/users', async (req: Request, res: Response) => {
//   try {
//     res.send(await Models.getAllParticipants());
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err);
//   }
// });


/** Get all the cafe orders */
router.get('/', async (req: Request, res: Response) => {
  console.log('get');
  const channel = Helper.channel;
  const cc = Helper.cafeCC;
  // _drug is equivalent to the name of your chaincode
  // it gets generated on the world state
  const dbName = `${channel}_${cc}`;
  const viewUrl = '_design/drugs/_view/all';

  const queryOptions = { startKey: [''], endKey: [''] };

  try {
    const result = <Cafe[]>(await Models.Cafe.query(Models.Cafe, dbName, viewUrl, queryOptions));

    res.send(await Promise.all(result.map(Models.formatCafe)));
  } catch (err) {
    console.log(err);
    if (err.code === 'EDOCMISSING') {
      res.send([]);
    } else {
      res.status(500).send(err);
    }
  }

});

router.post('/', async (req: Request, res: Response) => {
  let { id, productorId, beneficioId, fanegas, performance, category } = req.body;

  // These fields will be edited by the Beneficio
  category = category || 'Convencional';
  performance = performance || 0;

  const fId = id || crypto.randomBytes(16).toString('hex');

  try {
    let cntrl = await CafeController.init();
    //await cntrl.create(id, productorId, fanegas, performance, category, Date.now());
    await cntrl.create('123', 'p1', 'b1', 10, 0, 'Convenctional', Date.now());
    res.send({ok:true, id: fId, body:req.body})

    // const updatedCafe = await Models.formatCafe(await Models.Cafe.getOne(fId));

    // res.send(updatedCafe);

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// router.get('/users', (req: Request, res: Response) => {
//   const list = [
//     { org: 'org1', user: 'user1', name: 'Manufacturer Acme', },
//     { org: 'org1', user: 'user2', name: 'Manufacturer W. White' },
//     { org: 'org1', user: 'user3', name: 'Manufacturer Gus' },
//     { org: 'org2', user: 'user1', name: 'Springfield General Hospital' },
//     { org: 'org2', user: 'user2', name: 'Arkham Asylum' },
//     { org: 'org2', user: 'user3', name: 'Mercy Hospital' }];

//   res.send(Users.GetUsers(list));
// });

/** Transfer the holder of the drug in the value chain. */
// router.post('/:id/transfer/', async (req: Request, res: Response) => {
//   let { id } = req.params;
//   let { to, reportHash, reportUrl } = req.body;

//   try {
//     let cntrl = await DrugController.init();
//     await cntrl.transfer(id, to, reportHash, reportUrl, Date.now());

//     const updatedDrug = await Models.formatDrug(await Models.Drug.getOne(id));
//     res.send(updatedDrug);

//   } catch (err) {
//     console.log('err');
//     console.log(err);
//     res.status(500).send(err);
//   }
// });

// router.post('/:id/increment/', async (req: Request, res: Response) => {
//   let { id } = req.params;

//   try {
//     let cntrl = await DrugController.init();
//     console.log({ incrementEndpoint: id });
//     await cntrl.increment(id, Date.now());
//     console.log({ incrementEndpoint: id });

//     const updatedDrug = await Models.formatDrug(await Models.Drug.getOne(id));
//     res.send(updatedDrug);

//   } catch (err) {
//     console.log('err');
//     console.log(err);
//     res.status(500).send(err);
//   }
// });

export const CafeCtrl: Router = router;
