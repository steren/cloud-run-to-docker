#!/usr/bin/env node

import generateDockerCommand from './run-to-docker.js';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

const serviceConfigFilePath = process.argv[2] || path.join(process.cwd(), 'service.yaml');

const serviceConfig = yaml.load(fs.readFileSync(serviceConfigFilePath, 'utf8'));
const dockerCommand = generateDockerCommand(serviceConfig);

console.log(dockerCommand);
