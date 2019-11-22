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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const core = __importStar(require("@actions/core"));
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = __importDefault(require("axios"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = core.getInput("token", { required: true });
        const game = core.getInput("game", { required: true });
        const mod = core.getInput("mod", { required: true });
        const file = core.getInput("path", { required: true });
        const version = core.getInput("version");
        const uri = `https://api.test.mod.io/v1/games/${encodeURIComponent(game)}/mods/${encodeURIComponent(mod)}/files`;
        core.debug(`URL: ${uri}`);
        const form = new form_data_1.default();
        form.append('filedata', fs_1.default.createReadStream(path_1.default.resolve(file)));
        if (version) {
            form.append('version', version);
        }
        const response = yield axios_1.default.post(uri, form, {
            headers: Object.assign(Object.assign({}, form.getHeaders()), { Authorization: `Bearer ${token}` })
        });
        core.debug(`Response: ${JSON.stringify(response.data)}`);
    });
}
run();
