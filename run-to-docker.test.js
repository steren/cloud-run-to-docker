import { test } from 'node:test';
import { equal } from 'assert';
import generateDockerCommand from './run-to-docker.js';

test('generateDockerCommand should return expected Docker command', (t) => {
  const serviceConfig = {
    apiVersion: 'serving.knative.dev/v1',
    kind: 'Service',
    metadata: {
      name: 'my-service',
      namespace: 'default',
    },
    spec: {
      template: {
        spec: {
          containers: [
            {
              image: 'gcr.io/my-project/my-image',
              ports: [
                {
                  containerPort: 8080,
                },
              ],
              resources: {
                limits: {
                  cpu: '100m',
                  memory: '256Mi',
                },
              },
              env: [
                {
                  name: 'MY_ENV_VAR',
                  value: 'my-value',
                },
              ],
              command: ['node', 'app.js'],
              args: ['--arg1', 'value1'],
            },
          ],
        },
      },
    },
  };

  const expectedDockerCommand = `docker run -p 8080:8080 --cpus=100m --memory=256Mi -e MY_ENV_VAR=my-value -e K_SERVICE=dev -e K_REVISION=dev-001 -e PORT=8080 --entrypoint="node,app.js" --arg1 value1 gcr.io/my-project/my-image`;

  const actualDockerCommand = generateDockerCommand(serviceConfig);

  equal(actualDockerCommand, expectedDockerCommand);
});
