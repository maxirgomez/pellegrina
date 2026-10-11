import * as migration_20261011_191809_initial from './20261011_191809_initial';

export const migrations = [
  {
    up: migration_20261011_191809_initial.up,
    down: migration_20261011_191809_initial.down,
    name: '20261011_191809_initial'
  },
];
