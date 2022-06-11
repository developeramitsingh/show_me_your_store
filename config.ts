import * as fs from 'fs';
const yaml = require('js-yaml');
import * as _ from 'lodash';
import * as path from 'path';


const config: IConfig = {
  jwt: {
    jwtSecret: '',
    jwtSessionTimeout: '',
  },
  imageKit: {
    url: '',
  },
  algorithms: {
    RSA: ['RS256'],
    HMAC: ['HS256'],
  },
};

const initConfig = (): any => {
  /*
   * TODO
   * Merge default.yaml and the env.yaml
   */
  const env = process.env.NODE_ENV || 'development';
  const configFile = path.join(__dirname, 'config', 'environment', `${env}.yaml`);

  const envConfig = yaml.load(fs.readFileSync(configFile, { encoding: 'utf8', flag:'r' }));
  _.merge(config, envConfig);

  return config;
};


export default config;
export { initConfig };