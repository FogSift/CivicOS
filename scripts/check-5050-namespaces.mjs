#!/usr/bin/env node

const baseUrl = process.env.CIVICOS_BASE_URL || 'http://localhost:5050';
const endpoints = [
  '/api/meta.json',
  '/api/realms/topology.json',
  '/api/apps/index.json',
];

const run = async () => {
  let failures = 0;

  for (const endpoint of endpoints) {
    const url = `${baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.status !== 200) {
        failures += 1;
        console.error(`[FAIL] ${endpoint} -> HTTP ${response.status}`);
      } else {
        console.log(`[OK]   ${endpoint} -> HTTP 200`);
      }
    } catch (error) {
      failures += 1;
      console.error(`[FAIL] ${endpoint} -> ${error.message}`);
    }
  }

  if (failures > 0) {
    console.error(`Namespace check failed (${failures} failing endpoint${failures === 1 ? '' : 's'}).`);
    process.exit(1);
  }

  console.log('All required namespaces are reachable through CivicOS on :5050.');
};

run();
