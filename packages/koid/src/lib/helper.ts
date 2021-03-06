/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
import { Config, ConfigDc, ConfigNode, Options } from './types'


export function parseConfig(config?: Config): Options {
  /* istanbul ignore else */
  if (typeof config === 'undefined') {
    const dc = genConfigRandom()
    return parseConfigDc(dc)
  }

  if (typeof config.node === 'number') {
    const configNode: ConfigNode = {
      node: (config as ConfigNode).node,
      epoch: config.epoch,
    }
    return parseConfigNode(configNode)
  }
  else {
    const conf = config as ConfigDc
    const configDc: ConfigDc = {
      dataCenter: conf.dataCenter,
      worker: conf.worker,
      epoch: conf.epoch,
    }
    return parseConfigDc(configDc)
  }
}

/**
 * Generate random id
 */
export function genConfigRandom(): ConfigDc {
  const id = Date.now() & 0x3FF
  const config = parseConfigNode({ node: id })
  const ret: ConfigDc = {
    dataCenter: config.dataCenter,
    worker: config.worker,
    epoch: 0,
  }
  return ret
}


function parseConfigDc(config: ConfigDc): Options {
  const dataCenter = config.dataCenter & 0x1F
  const worker = config.worker & 0x1F
  const id = (dataCenter << 5 | worker) & 0x3FF

  const opts = {
    genId: id << 12,
    epoch: typeof config.epoch === 'number' ? config.epoch : 0,
    dataCenter,
    worker,
  }

  return opts
}

function parseConfigNode(config: ConfigNode): Options {
  const id = config.node & 0x3FF
  const dataCenter = id >> 5
  const worker = id & 0x1F

  const opts = {
    genId: id << 12,
    epoch: typeof config.epoch === 'number' ? config.epoch : 0,
    dataCenter,
    worker,
  }

  return opts
}


export function waitTillNextMillisecond(time: number, maxLoopTimes = 1024000): number {
  /* istanbul ignore next */
  if (maxLoopTimes <= 0) {
    return 0
  }

  for (let i = 0; i < Math.abs(maxLoopTimes); i += 1) {
    let now = Date.now()
    /* istanbul ignore next */
    if (now > time && i > 0) {
      return i
    }
    now = Number.MAX_SAFE_INTEGER * now
  }
  return 0
}
