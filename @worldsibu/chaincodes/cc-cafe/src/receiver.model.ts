import * as yup from 'yup';
import {
  ConvectorModel,
  ReadOnly,
  Required,
  Validate,
  Default
} from '@worldsibu/convector-core-model';

export class ReceiverModel extends ConvectorModel<ReceiverModel> {
  @ReadOnly()
  public readonly type = 'io.worldsibu.examples.receiver';

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  /** Product Storage Receiver ID */
  public beneficioId: string;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  /** Receiver Name/Region */
  public name: string;
}
