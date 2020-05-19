<a href="https://mod.io"><img src="https://github.com/nickelc/upload-to-modio/raw/master/header.png" alt="mod.io" width="320"/></a>

# 📦🕹️ GitHub Action for uploading mods to [mod.io](https://mod.io)

**Name:** `nickelc/upload-to-modio`

## Usage

```yaml
on: push

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - run: |
          echo "Hello Mod" > mod.txt
          zip modfile.zip mod.txt

      - uses: nickelc/upload-to-modio@v1
        with:
          token: ${{ secrets.MODIO_TOKEN }}
          game: 206
          mod: 1041
          path: modfile.zip
```

### Inputs

#### Required parameters

| Name             | Type     | Description                                                     |
|------------------|----------|-----------------------------------------------------------------|
| `token`          | String   | The user's access token                                         |
| `game`           | Number   | Unique id of the game                                           |
| `mod`            | Number   | Unique id of the mod                                            |
| `path`           | String   | Path to the file to upload                                      |

#### Optional parameters

| Name             | Type     | Description                                                     |
|------------------|----------|-----------------------------------------------------------------|
| `test-env`       | Boolean  | Use the test environment (Default: `false`)                     |
| `version`        | String   | Version for the file                                            |
| `changelog`      | String   | Changelog for the file                                          |
| `changelog-path` | String   | Path to the changelog of the file                               |
| `active`         | Boolean  | Label this upload as the current release (Default: `true`)      |
| `filehash`       | String   | MD5 hash of the file                                            |
| `metadata`       | String   | Metadata blob of the file                                       |
| `metadata-path`  | String   | Path to the metadata blob of the file                           |

### Outputs

| Name             | Type     | Description                                                     |
|------------------|----------|-----------------------------------------------------------------|
| `id`             | Number   | Unique id of the uploaded file                                  |
| `url`            | String   | Download URL for the file                                       |
