import config from 'config';
import knexLib from 'knex';

process.env.ALLOW_CONFIG_MUTATIONS = 1;

const clientConfigGetters = {
  mysql: () => config.get('mysql'),
  postgres: () => config.get('pg'),
  sqlite3: () => config.get('sqlite3')
};

const defaultClientNames = Object.keys(clientConfigGetters);

function getEnabledClientNames() {
  const envValue = process.env.TEST_DATABASES;
  if (!envValue) {
    return defaultClientNames;
  }

  return envValue
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
}

function getEnabledClients() {
  return getEnabledClientNames().map((clientName) => {
    const getConfig = clientConfigGetters[clientName];
    if (!getConfig) {
      throw new Error(`Unknown test database client: ${clientName}`);
    }

    return { client: clientName, knex: knexLib(getConfig()) };
  });
}

export { getEnabledClients };
