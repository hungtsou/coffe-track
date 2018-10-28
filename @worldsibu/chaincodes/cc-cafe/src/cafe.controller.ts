import * as yup from 'yup';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';

import { Cafe } from './cafe.model';
import { ReceiverModel } from './receiver.model';
import { Report } from './report.model';

@Controller('cafe')
export class CafeController extends ConvectorController {

  @Invokable()
  public async create(
    @Param(yup.string())
    id: string,
    @Param(yup.string())
    productorId: string,
    @Param(yup.string())
    beneficioId: string,
    @Param(yup.number())
    fanegas: number,
    @Param(yup.number())
    performance: number,
    @Param(yup.string())
    category: string,
    @Param(yup.number())
    created: number
  ) {
    const exists = await Cafe.getOne(id);

    if (exists.id === id) {
      throw new Error('There is already one cafe with that unique id');
    }

    let cafe = new Cafe(id);
    // Initialize the object!
    cafe.productorId = productorId;
    cafe.owner = productorId;
    if (fanegas) {
      cafe.fanegas = fanegas;
    }
    if (performance) {
      cafe.performance = performance;
    }
    // If not received default is 'Convencional'
    if (category) {
      cafe.category = category;
    }
    cafe.created = created;
    cafe.modified = created;
    cafe.modifiedBy = this.sender;

    await cafe.save();
  }

  @Invokable()
  public async transferToReceiver(
    @Param(yup.string())
    cafeId: string,
    @Param(yup.string())
    productorId: string,
    @Param(yup.string())
    receiverId: string,
    @Param(yup.number())
    modified: number
  ) {
    const cafe = await Cafe.getOne(cafeId);
    // const receiver = await ReceiverModel.getOne(receiverId);
    const receiver = {
      id: receiverId,
      beneficioId: 'user2',
      name: receiverId
    };
    if (cafe.productorId !== productorId) {
      // @TODO: Update error message
      throw new Error('The Coffee productor must be the same of the cafe in the value chain.');
    } else if (cafe.beneficioId) {
      // @TODO: Update error message
      throw new Error('The Coffee already has a "Beneficio" ID.');
    // } else if (!receiver) {
    //   // @TODO: Update error message
    //   throw new Error('The receiver ID was not found.');
    } else if (this.sender !== receiverId) {
      // @TODO: Update error message
      throw new Error('The current user is not able to transfer this Coffee to requested "Receiver".');
    }

    // Change the owner & beneficioId.
    cafe.beneficioId = receiver.beneficioId;
    cafe.owner = receiver.id;

    // Update as modified
    cafe.modifiedBy = this.sender;
    cafe.modified = modified;

    const report = {
      action: `Transfer Coffee from Productor ${productorId} to Receiver ${receiverId}`,
      from: productorId,
      to: receiver.name
    };

    if (cafe.reports) {
      cafe.reports.push(report);
    } else {
      cafe.reports = [report];
    }

    await cafe.save();
  }
  
  @Invokable()
  public async transferToBeneficio(
    @Param(yup.string())
    cafeId: string,
    @Param(yup.string())
    receiverId: string,
    @Param(yup.string())
    beneficioId: string,
    @Param(yup.number())
    modified: number
  ) {
    const cafe = await Cafe.getOne(cafeId);
    // @TODO: Search receiver and get beneficioId from it
    const receiver = {
      id: receiverId,
      beneficioId: 'user2',
      name: receiverId
    };
    if (this.sender !== receiverId) {
      // @TODO: Update error message
      throw new Error('The current owner is the only user capable of transferring the Coffee in the value chain.');
    } else if (cafe.beneficioId !== beneficioId || receiver.beneficioId !== beneficioId) {
      // @TODO: Update error message
      throw new Error('The current "Beneficio" must be the same in the value chain.');
    }

    // Change the owner & beneficioId.
    cafe.owner = beneficioId;

    // Update as modified
    cafe.modifiedBy = this.sender;
    cafe.modified = modified;

    const report = {
      action: 'Transfer Coffe to Receiver',
      from: receiverId,
      to: beneficioId
    };

    if (cafe.reports) {
      cafe.reports.push(report);
    } else {
      cafe.reports = [report];
    }

    await cafe.save();
  }

  @Invokable()
  public async transfer(
    @Param(yup.string())
    cafeId: string,
    @Param(yup.string())
    to: string,
    @Param(yup.number())
    modified: number
  ) {
    const cafe = await Cafe.getOne(cafeId);

    if (cafe.owner !== this.sender) {
      throw new Error('The current holder is the only user capable of transferring the Coffee in the value chain.');
    }

    // Change the holder.
    cafe.owner = to;

    // Attach the report url. Since the user is the only responsible for the attachment, we don't check anything.

    const report = {
      action: `Transfer Coffee from ${this.sender} to ${to}`,
      from: this.sender,
      to
    };

    if (cafe.reports) {
      cafe.reports.push(report);
    } else {
      cafe.reports = [report];
    }

    // Update as modified
    cafe.modifiedBy = this.sender;
    cafe.modified = modified;

    await cafe.save();
  }
}
