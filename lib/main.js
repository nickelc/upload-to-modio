"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = __importStar(require("./util"));
const core = __importStar(require("@actions/core"));
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = __importDefault(require("axios"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const config = util.config();
            const uri = util.url(config);
            core.debug(`URL: ${uri}`);
            const form = new form_data_1.default();
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
            const response = yield axios_1.default.post(uri, form, {
                headers: Object.assign(Object.assign({}, form.getHeaders()), { Authorization: `Bearer ${config.token}` })
            });
            console.log(`🎉 File ready at ${response.data.download.binary_url}`);
            core.setOutput("id", response.data.id);
            core.setOutput("url", response.data.download.binary_url);
            core.debug(`Response: ${JSON.stringify(response.data)}`);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
