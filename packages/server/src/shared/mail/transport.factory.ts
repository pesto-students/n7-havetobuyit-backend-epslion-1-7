import { Mandrill } from 'mandrill-api';
import { MandrillProductionApiKey } from '../../shared/config/constants';
import { TRANSPORTER } from './constants';

export const transportFactory = {
  provide: TRANSPORTER,
  useFactory: () => {
    return new Mandrill(MandrillProductionApiKey);
  },
};
