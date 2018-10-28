import * as yup from 'yup';

export interface Report {
  action: string;
  from: string;
  to: string;
}

export const Report = yup.object<Report>().shape({
  action: yup.string().required(),
  from: yup.string().required(),
  to: yup.string().required()
});
