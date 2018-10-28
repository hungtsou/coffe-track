import * as yup from 'yup';
import {
  ConvectorModel,
  ReadOnly,
  Required,
  Validate,
  Default
} from '@worldsibu/convector-core-model';
import { Report } from './report.model';

export class Cafe extends ConvectorModel<Cafe> {
  @ReadOnly()
  public readonly type = 'io.worldsibu.examples.cafe';

  @Validate(yup.string())
  /** Product Storage Receiver ID */
  public beneficioId: string;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  /** Product Creator ID */
  public productorId: string;

  @Required()
  @Validate(yup.string())
  /** Current user owning the cafe. */
  public owner: string;
  
  @Validate(yup.number())
  /** "Fanegas" A kind of coffee unit of measurement when full-grain is received. */
  public fanegas: number = 0;
  
  @Validate(yup.number())
  /** Performance . */
  public performance: number;
  
  @Validate(yup.string())
  /** Performance . */
  public category: string;

  @ReadOnly()
  @Required()
  @Validate(yup.number())
  /** Unmodifiable date of creation. Default will be the date when created the object. */
  public created: number;

  @Validate(yup.number())
  /** Date in which it was modified. */
  public modified: number;

  @Required()
  @Validate(yup.string())
  /** Last user that modified it. */
  public modifiedBy: string;

  @Validate(yup.array(Report))
  /** Current user owning the drug. */
  public reports: Array<Report>;
}
