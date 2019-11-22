import { openSync, createReadStream, readFileSync, ReadStream } from "fs";
import path from "path";
import { getInput } from "@actions/core";

const PROD_ENV = "https://api.mod.io/v1";
const TEST_ENV = "https://api.test.mod.io/v1";

export interface Config {
  host: string;
  token: string;
  game: number;
  mod: number;

  file: string;
  filehash?: string | boolean;
  active?: boolean;
  version?: string;
  changelog?: string;
  changelog_path?: string;
  metadata?: string;
  metadata_path?: string;
}

export const config = (): Config => {
  const test_env = getInput("test-env") === "true";
  const host = test_env ? TEST_ENV : PROD_ENV;

  const game = getInput("game", { required: true });
  const mod = getInput("mod", { required: true });

  if (isNaN(+game)) {
    throw new Error(`Invalid input value for 'game': ${game}`);
  }

  if (isNaN(+mod)) {
    throw new Error(`Invalid input value for 'mod': ${mod}`);
  }

  return {
    host: host,
    token: getInput("token", { required: true }),
    game: +game,
    mod: +mod,
    file: path.resolve(getInput("path", { required: true })),
    filehash: getInput("filehash"),
    active: getInput("active") === "true",
    version: getInput("version"),
    changelog: getInput("changelog"),
    changelog_path: getInput("changelog-path"),
    metadata: getInput("metadata"),
    metadata_path: getInput("metadata-path")
  };
};

export const url = (config: Config): string => {
  return `${config.host}/games/${config.game}/mods/${config.mod}/files`;
};

export const file = (config: Config): ReadStream => {
  const fd = openSync(config.file, "r");
  return createReadStream(config.file, { fd: fd });
};

export const changelog = (config: Config): string | ReadStream | undefined => {
  return (
    config.changelog ||
    (config.changelog_path &&
      readFileSync(config.changelog_path).toString("utf8"))
  );
};

export const metadata = (config: Config): string | object | undefined => {
  return (
    config.metadata ||
    (config.metadata_path &&
      readFileSync(config.metadata_path).toString("utf8"))
  );
};
