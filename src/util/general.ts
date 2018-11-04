const ensureNecessaryEnvs = (mandatoryEnvs: string[]): void => {
  // Ensure required ENV vars are set
  let missingEnvs = mandatoryEnvs.filter(
    (env) => !(typeof process.env[env] !== 'undefined')
  );

  if (missingEnvs.length === 0) {
    return;
  }
  throw new Error(
    'Required ENV variables are not set: ' + missingEnvs.join(', ') + ''
  );
};

const randomInt = (low: number = 0, high: number = Number.MAX_SAFE_INTEGER) => {
  return Math.floor(Math.random() * (high - low) + low);
};

export { ensureNecessaryEnvs, randomInt };
