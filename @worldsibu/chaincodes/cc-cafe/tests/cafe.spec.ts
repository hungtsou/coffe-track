// tslint:disable:no-unused-expression

import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import 'mocha';

import { Cafe } from '../src/cafe.model';
import { CafeControllerClient } from '../client';

describe('Cafe', () => {
  let drugId: string;
  let adapter: MockControllerAdapter;
  let drugCtrl: CafeControllerClient;

  // Mock certificate fingerprint
  const newUserCertificate = 'B6:0B:37:7C:DF:D2:7A:08:0B:98:BF:52:A4:2C:DC:4E:CC:70:91:BH';

  before(async () => {
    drugId = uuid();
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    drugCtrl = new CafeControllerClient(adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'CafeController',
        name: join(__dirname, '..')
      }
    ]);

  });

  it('should initialize a cafe', async () => {
    await drugCtrl.create(drugId, 'Acetaminofen 500mg', Date.now());

    const cafe = await adapter.getById<Cafe>(drugId);

    expect(cafe.owner).to.exist;
  });

  it('should transfer the asset adding the report', async () => {
    await drugCtrl.transfer(drugId, newUserCertificate,
      'b0523b8818dcc68ce96fb8abfc123b66',
      // tslint:disable-next-line:max-line-length
      'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjgwrm2zbHcAhUnTd8KHZpUDk0QjRx6BAgBEAU&url=https%3A%2F%2Fencolombia.com%2Fmedicina%2Fguiasmed%2Fu-toxicologicas%2Facetaminofen%2F&psig=AOvVaw0N8igaZN0tCtDy1i6ShYGr&ust=1532310902689381',
      Date.now()
    );

    const cafe = await adapter.getById<Cafe>(drugId);

    expect(cafe.owner).to.eq(newUserCertificate);
  });
});
