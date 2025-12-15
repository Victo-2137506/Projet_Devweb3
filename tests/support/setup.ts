import { beforeAll, afterAll } from 'vitest';
import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';

import app from '@src/server';
import MockOrm from '@src/repos/MockOrm';

/******************************************************************************
                                    Run
******************************************************************************/

let agent: TestAgent<Test>;

beforeAll(async () => {
  agent = supertest.agent(app);
  await MockOrm.cleanDb();
}, 30000); // Augmenter le timeout

afterAll(async () => {
  await MockOrm.cleanDb(); // Nettoyer après tous les tests
}, 30000);

/******************************************************************************
                                    Export
******************************************************************************/

export { agent };
