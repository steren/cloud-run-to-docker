export default function generateDockerCommand(serviceConfig) {
  // Extract the image name and tag from the service configuration
  const imageName = serviceConfig.spec.template.spec.containers[0].image;
  const imageTag = imageName.split(':')[1];
  const imageRepo = imageName.split(':')[0];

  // Extract the environment variables from the service configuration
  const envVars = serviceConfig.spec.template.spec.containers[0].env || [];

  // Inject new environment variables for K_SERVICE, K_REVISION, and PORT
  envVars.push({ name: 'K_SERVICE', value: 'dev' });
  envVars.push({ name: 'K_REVISION', value: 'dev-001' });

  const containerPort = serviceConfig.spec.template.spec.containers[0].ports?.[0]?.containerPort || '8080';
  envVars.push({ name: 'PORT', value: containerPort });

  // Extract the container command and arguments from the service configuration
  const containerCommand = serviceConfig.spec.template.spec.containers[0].command;
  const containerArgs = serviceConfig.spec.template.spec.containers[0].args;

  // Extract the CPU and memory limits from the service configuration
  const cpuLimit = serviceConfig.spec.template.spec.containers[0].resources?.limits?.cpu;
  const memoryLimit = serviceConfig.spec.template.spec.containers[0].resources?.limits?.memory;

  // Generate the docker command to run the service locally with the environment variables, container command/args, and resource limits
  let dockerCommand = `docker run -p ${containerPort}:${containerPort}`;

  // Add the CPU and memory limits to the docker command
  if (cpuLimit) {
    dockerCommand += ` --cpus=${cpuLimit}`;
  }
  if (memoryLimit) {
    dockerCommand += ` --memory=${memoryLimit}`;
  }

  // Add each environment variable to the docker command
  envVars.forEach(envVar => {
    dockerCommand += ` -e ${envVar.name}=${envVar.value}`;
  });

  // Add the container command and arguments to the docker command
  if (containerCommand) {
    dockerCommand += ` --entrypoint="${containerCommand}"`;
    if (containerArgs) {
      dockerCommand += ` ${containerArgs.join(' ')}`;
    }
  }

  dockerCommand += ` ${imageName}`;

  return dockerCommand;
};
