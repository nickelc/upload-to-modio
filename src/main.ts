import * as core from '@actions/core';

async function run() {
    const game = core.getInput("game");
    const mod = core.getInput("mod");
    const path = core.getInput("path");

    console.log(`Game: ${game} Mod: ${mod} Path: ${path}`);
}

run();
