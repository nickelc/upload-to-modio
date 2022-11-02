<a href="https://mod.io"><img src="https://github.com/nickelc/upload-to-modio/raw/master/header.png" alt="mod.io" width="320"/></a>

# 📦🕹️ GitHub Action for uploading mods to [mod.io](https://mod.io)

**Name:** `nickelc/upload-to-modio`

**Requires:** `curl` v7.76+

## Usage

```yaml
on: push

jobs:
  build:
    runs-on: ubuntu-22.04

    steps:
      - name: Build mod file
        run: |
          echo "Hello Mod" > mod.txt
          zip modfile.zip mod.txt

      - uses: nickelc/upload-to-modio@v1
        with:
          token: ${{ secrets.MODIO_TOKEN }}
          game: 206
          mod: 1041
          path: modfile.zip
```

### Extract metadata for the upload

Using the [`jq`] command to extract `game id`, `mod id` and `version` from a json file.

[`jq`]: https://stedolan.github.io/jq/

```yaml
on: push

jobs:
  build:
    runs-on: ubuntu-22.04

    steps:
      - name: Build mod file
        run: |
          echo "Hello Mod" > mod.txt
          zip modfile.zip mod.txt

      - name: Extract metadata
        id: metadata
        run: |
          GAME_ID=$(jq '.game' metadata.json)
          MOD_ID=$(jq '.mod' metadata.json)
          VERSION=$(jq '.version' metadata.json)

          echo "GAME=$GAME_ID" >> $GITHUB_OUTPUT
          echo "MOD=$MOD_ID" >> $GITHUB_OUTPUT
          echo "VERSION=$VERSION_ID" >> $GITHUB_OUTPUT

      - uses: nickelc/upload-to-modio@v1
        with:
          token: ${{ secrets.MODIO_TOKEN }}
          game: ${{ steps.metadata.outputs.GAME }}
          mod: ${{ steps.metadata.outputs.MOD }}
          version: ${{ steps.metadata.outputs.VERSION }}
          path: modfile.zip
```

### Inputs

#### Required parameters

| Name             | Type     | Description                              |
|------------------|----------|------------------------------------------|
| `token`          | String   | The user's access token                  |
| `game`           | Number   | Unique id of the game                    |
| `mod`            | Number   | Unique id of the mod                     |
| `path`           | String   | Path to the file to upload               |

#### Optional parameters

| Name             | Type     | Description                              |
|------------------|----------|------------------------------------------|
| `test-env`       | Boolean  | Use the test environment                 |
| `version`        | String   | Version for the file                     |
| `changelog`      | String   | Changelog for the file                   |
| `changelog-path` | String   | Path to the changelog of the file        |
| `active`         | Boolean  | Label this upload as the current release |
| `filehash`       | String   | MD5 hash of the file                     |
| `metadata`       | String   | Metadata blob of the file                |
| `metadata-path`  | String   | Path to the metadata blob of the file    |

### Outputs

| Name             | Type     | Description                              |
|------------------|----------|------------------------------------------|
| `id`             | Number   | Unique id of the uploaded file           |
| `url`            | String   | Download URL for the file                |
| `filehash`       | String   | MD5 hash for the uploaded file           |
| `output`         | String   | File to output of the request            |
