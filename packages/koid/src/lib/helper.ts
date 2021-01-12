/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
import { ConfigDc, ConfigId, Options } from './types'


export function parseConfig(config?: ConfigDc | ConfigId): Options {
  /* istanbul ignore else */
  if (typeof config === 'undefined') {
    return genConfigRandom()
  }
  return 'dataCenter' in config
    ? parseConfigDc(config)
    : parseConfigId(config)
}

/**
 * Generate random id
 */
export function genConfigRandom(): Options {
  const id = Date.now() & 0x3FF
  const config = parseConfigId({ id })
  return config
}


function parseConfigDc(config: ConfigDc): Options {
  const dataCenter = config.dataCenter & 0x1F
  const worker = config.worker & 0x1F

  const opts = {
    genId: (dataCenter << 5 | worker) << 12,
    epoch: typeof config.epoch === 'number' ? config.epoch : 0,
  }

  return opts
}

function parseConfigId(config: ConfigId): Options {
  const opts = {
    genId: (config.id & 0x3FF) << 12,
    epoch: typeof config.epoch === 'number' ? config.epoch : 0,
  }

  return opts
}
