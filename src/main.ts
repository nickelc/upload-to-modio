import fs from 'fs';
import path from 'path';
import * as core from "@actions/core";
import FormData from 'form-data';
import axios from 'axios';

async function run() {
  const token = core.getInput("token", { required: true });
  const game = core.getInput("game", { required: true });
  const mod = core.getInput("mod", { required: true });
  const file = core.getInput("path", { required: true });

  const version = core.getInput("version");

  const uri = `https://api.test.mod.io/v1/games/${encodeURIComponent(
    game
  )}/mods/${encodeURIComponent(mod)}/files`;

  core.debug(`URL: ${uri}`);

  const form = new FormData();
  form.append('filedata', fs.createReadStream(path.resolve(file)));

  if (version) {
    form.append('version', version);
  }

  const response = await axios.post(uri, form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${token}`,
    }
  });
  core.debug(`Response: ${JSON.stringify(response.data)}`);
}

run();
