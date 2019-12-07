import {url, changelog, metadata} from '../src/util'
import * as assert from 'assert'

describe('util', () => {
  describe('url', () => {
    it('returns url to files endpoint', () => {
      assert.equal(
        'host/games/123/mods/345/files',
        url({
          host: 'host',
          token: 't',
          game: 123,
          mod: 345,
          file: 'file.txt'
        })
      )
    })
  })

  describe('changelog', () => {
    it('uses input changelog', () => {
      assert.equal(
        'no changes',
        changelog({
          host: 'host',
          token: 't',
          game: 123,
          mod: 345,
          file: 'file.txt',
          changelog: 'no changes'
        })
      )
    })

    it('use input changelog-path', () => {
      assert.equal(
        'some bug fixes',
        changelog({
          host: 'host',
          token: 't',
          game: 123,
          mod: 345,
          file: 'file.txt',
          changelogPath: '__tests__/data/changelog.txt'
        })
      )
    })

    it('use input changelog & changelog-path', () => {
      assert.equal(
        'changelog first',
        changelog({
          host: 'host',
          token: 't',
          game: 123,
          mod: 345,
          file: 'file.txt',
          changelog: 'changelog first',
          changelogPath: '__tests__/data/changelog.txt'
        })
      )
    })
  })

  describe('metadata', () => {
    it('uses input metadata', () => {
      assert.equal(
        'no meta',
        metadata({
          host: 'host',
          token: 't',
          game: 123,
          mod: 345,
          file: 'file.txt',
          metadata: 'no meta'
        })
      )
    })

    it('use input metadata-path', () => {
      assert.equal(
        'mode=easy',
        metadata({
          host: 'host',
          token: 't',
          game: 123,
          mod: 345,
          file: 'file.txt',
          metadataPath: '__tests__/data/metadata.txt'
        })
      )
    })

    it('use input metadata & metadata-path', () => {
      assert.equal(
        'metadata first',
        metadata({
          host: 'host',
          token: 't',
          game: 123,
          mod: 345,
          file: 'file.txt',
          metadata: 'metadata first',
          metadataPath: '__tests__/data/metadata.txt'
        })
      )
    })
  })
})
