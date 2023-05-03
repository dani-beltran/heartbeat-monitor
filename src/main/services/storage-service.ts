import { config } from '@ubio/framework';

export class StorageService {

    @config({ default: 60000 }) TIMEOUT!: number;

}
