import * as util from "./util";
import * as core from "@actions/core";
import FormData from "form-data";
import axios from "axios";

async function run() {
  try {
    const config = util.config();

    const uri = util.url(config);
    core.debug(`URL: ${uri}`);

    const form = new FormData();
    form.append("filedata", util.file(config));

    if (config.filehash) {
      form.append("filehash", config.filehash);
    }

    if (config.active) {
      form.append("active", "true");
    }

    if (config.version) {
      form.append("version", config.version);
    }

    const changelog = util.changelog(config);
    if (changelog) {
      form.append("changelog", changelog);
    }

    const md = util.metadata(config);
    if (md) {
      form.append("metadata_blob", md);
    }

    const response = await axios.post(uri, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${config.token}`
      }
    });

    console.log(`🎉 File ready at ${response.data.download.binary_url}`);
    core.setOutput("id", response.data.id);
    core.setOutput("url", response.data.download.binary_url);

    core.debug(`Response: ${JSON.stringify(response.data)}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
