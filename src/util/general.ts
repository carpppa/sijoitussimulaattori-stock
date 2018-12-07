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

const randomInt = (
  low: number = 0,
  high: number = Number.MAX_SAFE_INTEGER
): number => {
  return Math.floor(Math.random() * (high - low) + low);
};

const getOrThrow = <T>(prop: string, obj: { [key: string]: any }) => {
  if (prop in obj) return obj[prop] as T;
  throw new Error(`property ${prop} does not exist in the object`);
};

export { ensureNecessaryEnvs, randomInt, getOrThrow };
