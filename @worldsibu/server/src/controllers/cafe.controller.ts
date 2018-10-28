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


/** Get all the cafes! */
router.get('/', async (req: Request, res: Response) => {
  console.log('get');
  const channel = Helper.channel;
  const cc = Helper.cafeCC;
  // _cafe is equivalent to the name of your chaincode
  // it gets generated on the world state
  const dbName = `${channel}_${cc}`;
  const viewUrl = '_design/cafe/_view/all';

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

/** Update cafe category. */
router.post('/:id/upgrade', async (req: Request, res: Response) => {
  console.log('UPGRADE!!!');
  let { id } = req.params;
  let { category } = req.body;

  const fId = id || crypto.randomBytes(16).toString('hex');

  try {
    let cntrl = await CafeController.init();
    await cntrl.assignCategory(id, category, Date.now());

    const updatedCafe = await Models.formatCafe(await Models.Cafe.getOne(fId));

    res.send(updatedCafe);

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

/** Transfer the holder of the cafe in the value chain. */
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

// /** Insert one cafe. */
// router.post('/', async (req: Request, res: Response) => {
//   let { id, name } = req.body;

//   const fId = id || crypto.randomBytes(16).toString('hex');

//   try {
//     let cntrl = await DrugController.init();
//     await cntrl.create(id, name, Date.now());

//     const updatedDrug = await Models.formatDrug(await Models.Drug.getOne(fId));

//     res.send(updatedDrug);

//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err);
//   }
// });

export const CafeCtrl: Router = router;
