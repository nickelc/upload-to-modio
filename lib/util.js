"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const core_1 = require("@actions/core");
const PROD_ENV = "https://api.mod.io/v1";
const TEST_ENV = "https://api.test.mod.io/v1";
exports.config = () => {
    const test_env = core_1.getInput("test-env") === "true";
    const host = test_env ? TEST_ENV : PROD_ENV;
    const game = core_1.getInput("game", { required: true });
    const mod = core_1.getInput("mod", { required: true });
    if (isNaN(+game)) {
        throw new Error(`Invalid input value for 'game': ${game}`);
    }
    if (isNaN(+mod)) {
        throw new Error(`Invalid input value for 'mod': ${mod}`);
    }
    return {
        host: host,
        token: core_1.getInput("token", { required: true }),
        game: +game,
        mod: +mod,
        file: path_1.default.resolve(core_1.getInput("path", { required: true })),
        filehash: core_1.getInput("filehash"),
        active: core_1.getInput("active") === "true",
        version: core_1.getInput("version"),
        changelog: core_1.getInput("changelog"),
        changelog_path: core_1.getInput("changelog-path"),
        metadata: core_1.getInput("metadata"),
        metadata_path: core_1.getInput("metadata-path")
    };
};
exports.url = (config) => {
    return `${config.host}/games/${config.game}/mods/${config.mod}/files`;
};
exports.file = (config) => {
    const fd = fs_1.openSync(config.file, "r");
    return fs_1.createReadStream(config.file, { fd: fd });
};
exports.changelog = (config) => {
    return (config.changelog ||
        (config.changelog_path &&
            fs_1.readFileSync(config.changelog_path).toString("utf8")));
};
exports.metadata = (config) => {
    return (config.metadata ||
        (config.metadata_path &&
            fs_1.readFileSync(config.metadata_path).toString("utf8")));
};
