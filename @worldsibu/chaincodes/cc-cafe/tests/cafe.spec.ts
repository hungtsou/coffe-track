// tslint:disable:no-unused-expression

import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import 'mocha';

import { Cafe } from '../src/cafe.model';
import { CafeControllerClient } from '../client';

describe('Cafe', () => {
  let cafeId: string;
  let adapter: MockControllerAdapter;
  let cafeCtrl: CafeControllerClient;

  // Mock certificate fingerprint
  const newUserCertificate = 'B6:0B:37:7C:DF:D2:7A:08:0B:98:BF:52:A4:2C:DC:4E:CC:70:91:BH';

  before(async () => {
    cafeId = uuid();
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    cafeCtrl = new CafeControllerClient(adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'CafeController',
        name: join(__dirname, '..')
      }
    ]);

  });

  it('should initialize a cafe', async () => {
    await cafeCtrl.create(cafeId, 'producer_1', 1, 1, Date.now());

    const cafe = await adapter.getById<Cafe>(cafeId);

    expect(cafe.owner).to.exist;
  });

  it('should transfer the asset adding the report', async () => {
    await cafeCtrl.transfer(cafeId,
      'b0523b8818dcc68ce96fb8abfc123b66',
      Date.now()
    );

    const cafe = await adapter.getById<Cafe>(cafeId);

    expect(cafe.owner).to.eq(newUserCertificate);
  });
});
