import * as migration_20260914_043653_initial from './20260914_043653_initial';
import * as migration_20260914_044342_home_modules from './20260914_044342_home_modules';

export const migrations = [
  {
    up: migration_20260914_043653_initial.up,
    down: migration_20260914_043653_initial.down,
    name: '20260914_043653_initial',
  },
  {
    up: migration_20260914_044342_home_modules.up,
    down: migration_20260914_044342_home_modules.down,
    name: '20260914_044342_home_modules'
  },
];
