import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class ApiService {
  getDateTime(): object {
    const datetime = moment().format('DD/MM/YYYY HH:mm:ss');

    return { datetime };
  }
}
