import {createReadStream, readFileSync, ReadStream} from 'fs'
import path from 'path'
import {getInput} from '@actions/core'

const PROD_ENV = 'https://api.mod.io/v1'
const TEST_ENV = 'https://api.test.mod.io/v1'

export interface Config {
  baseUrl: string
  token: string
  game: number
  mod: number

  file: string
  filehash?: string | boolean
  active?: boolean
  version?: string
  changelog?: string
  changelogPath?: string
  metadata?: string
  metadataPath?: string
}

export interface UrlConfig {
  baseUrl: string
  game: number
  mod: number
}

export const config = (): Config => {
  const testEnv = getInput('test-env') === 'true'
  const baseUrl = testEnv ? TEST_ENV : PROD_ENV

  const game = getInput('game', {required: true})
  const mod = getInput('mod', {required: true})

  if (isNaN(+game)) {
    throw new Error(`Invalid input value for 'game': ${game}`)
  }

  if (isNaN(+mod)) {
    throw new Error(`Invalid input value for 'mod': ${mod}`)
  }

  return {
    baseUrl,
    token: getInput('token', {required: true}),
    game: +game,
    mod: +mod,
    file: path.resolve(getInput('path', {required: true})),
    filehash: getInput('filehash'),
    active: getInput('active') === 'true',
    version: getInput('version'),
    changelog: getInput('changelog'),
    changelogPath: getInput('changelog-path'),
    metadata: getInput('metadata'),
    metadataPath: getInput('metadata-path')
  }
}

export const url = ({baseUrl, game, mod}: UrlConfig): string => {
  return `${baseUrl}/games/${game}/mods/${mod}/files`
}

export const file = (cfg: Config): ReadStream => {
  return createReadStream(cfg.file, {flags: 'r'})
}

export const changelog = (cfg: Config): string | ReadStream | undefined => {
  return (
    cfg.changelog ||
    (cfg.changelogPath && readFileSync(cfg.changelogPath).toString('utf8'))
  )
}

export const metadata = (cfg: Config): string | object | undefined => {
  return (
    cfg.metadata ||
    (cfg.metadataPath && readFileSync(cfg.metadataPath).toString('utf8'))
  )
}
