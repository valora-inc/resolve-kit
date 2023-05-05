# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.1.0](https://github.com/valora-inc/resolve-kit/compare/v2.0.1...v2.1.0) (2023-05-05)


### Features

* add masa resolver ([#178](https://github.com/valora-inc/resolve-kit/issues/178)) ([5b4608f](https://github.com/valora-inc/resolve-kit/commit/5b4608fce611af6f03b0f81bf0dca4d5126201a4))


### Bug Fixes

* **deps:** update celo packages to v4 ([#181](https://github.com/valora-inc/resolve-kit/issues/181)) ([7c55a13](https://github.com/valora-inc/resolve-kit/commit/7c55a1382964e5eea10087298dda2780be0e1f94))
* **deps:** update dependency @masa-finance/masa-sdk to ^1.13.4 ([#185](https://github.com/valora-inc/resolve-kit/issues/185)) ([de20720](https://github.com/valora-inc/resolve-kit/commit/de207204b9f767bdf0293b7d9d6864090c79e879))
* **deps:** update dependency @masa-finance/masa-sdk to ^1.14.0 ([#186](https://github.com/valora-inc/resolve-kit/issues/186)) ([0114e2f](https://github.com/valora-inc/resolve-kit/commit/0114e2fc986c26ac463985fb1454d4608d78b916))
* **deps:** update dependency @masa-finance/masa-sdk to ^1.14.2 ([#187](https://github.com/valora-inc/resolve-kit/issues/187)) ([1d3ee17](https://github.com/valora-inc/resolve-kit/commit/1d3ee172d6f5f5ba986d28f5febba9cb14c599bb))
* **deps:** update dependency @masa-finance/masa-sdk to ^1.15.1 ([#190](https://github.com/valora-inc/resolve-kit/issues/190)) ([b83b007](https://github.com/valora-inc/resolve-kit/commit/b83b007294581507a9c5783612e76724a0d86e85))

### [2.0.1](https://github.com/valora-inc/resolve-kit/compare/v2.0.0...v2.0.1) (2023-03-24)


### Bug Fixes

* include ABI files in dist ([#174](https://github.com/valora-inc/resolve-kit/issues/174)) ([75f8b24](https://github.com/valora-inc/resolve-kit/commit/75f8b243c874c3fbe3157ab4d1ca0b0066529520))

## [2.0.0](https://github.com/valora-inc/resolve-kit/compare/v1.0.3...v2.0.0) (2023-03-24)


### ⚠ BREAKING CHANGES

* exported resolver name change

Co-authored-by: Jean Regisser <jean.regisser@gmail.com>

### Features

* add an asv2 resolver ([#143](https://github.com/valora-inc/resolve-kit/issues/143)) ([1b35726](https://github.com/valora-inc/resolve-kit/commit/1b357267915c36fb0215bcd08d69ab4cf37e2ef3))
* add issuer names to resolution results ([#172](https://github.com/valora-inc/resolve-kit/issues/172)) ([95654d7](https://github.com/valora-inc/resolve-kit/commit/95654d78eb64ac0233b5a627e188e707bb69df00))


### Bug Fixes

* **deps:** update celo packages to ^3.1.0 ([#149](https://github.com/valora-inc/resolve-kit/issues/149)) ([21be7b2](https://github.com/valora-inc/resolve-kit/commit/21be7b2645f0f4b2aae44aa947068ae7151560ac))
* **deps:** update celo packages to ^3.2.0 ([#158](https://github.com/valora-inc/resolve-kit/issues/158)) ([78e940b](https://github.com/valora-inc/resolve-kit/commit/78e940bf32fae37a06003d2c3e7106f04f6d3b54))
* **deps:** update celo packages to v3 ([#132](https://github.com/valora-inc/resolve-kit/issues/132)) ([e25c86c](https://github.com/valora-inc/resolve-kit/commit/e25c86c8ffd7ac312c4834d4d2c3c1627e9e483c))
* **deps:** update dependency @ensdomains/ensjs to ^2.1.0 ([#126](https://github.com/valora-inc/resolve-kit/issues/126)) ([bf45b8c](https://github.com/valora-inc/resolve-kit/commit/bf45b8ccc66ed5e585d4a53b5865d26f8d5b4248))
* **deps:** update dependency ethers to ^5.7.2 ([#127](https://github.com/valora-inc/resolve-kit/issues/127)) ([b28598f](https://github.com/valora-inc/resolve-kit/commit/b28598f24107ee6ae58fbcf0735069df6220854a))


* rename ResolveCelo to ResolveSocialConnect ([#173](https://github.com/valora-inc/resolve-kit/issues/173)) ([c89b1c9](https://github.com/valora-inc/resolve-kit/commit/c89b1c99e25cac7daeda461560f83846c392a1e3))

### [1.0.3](https://github.com/valora-inc/resolve-kit/compare/v1.0.1...v1.0.3) (2022-02-09)

### [1.0.2](https://github.com/valora-inc/resolve-kit/compare/v1.0.1...v1.0.2) (2022-02-09)

### [1.0.1](https://github.com/valora-inc/resolve-kit/compare/v0.1.0...v1.0.1) (2022-02-09)

## 0.1.0 (2022-02-09)


### ⚠ BREAKING CHANGES

* because it changes the parameters for constructing the nomspace
resolution.

### Features

* Improving nom space resolver + adding kind enum ([#9](https://github.com/valora-inc/resolve-kit/issues/9)) ([f84005e](https://github.com/valora-inc/resolve-kit/commit/f84005ea0b522fb6ae40e10ab53d07cf8ef823ef))
* Initial skeleton ([#1](https://github.com/valora-inc/resolve-kit/issues/1)) ([c705863](https://github.com/valora-inc/resolve-kit/commit/c7058637115c80336bf1c80509d56f61c6a1c7c5))
* nomspace resolutions ([#2](https://github.com/valora-inc/resolve-kit/issues/2)) ([e959ca9](https://github.com/valora-inc/resolve-kit/commit/e959ca9ab728ccdfa486e1038145502ef34aeaa1))


### Bug Fixes

* use the recommended approach for nomspace resolution ([#23](https://github.com/valora-inc/resolve-kit/issues/23)) ([5500e28](https://github.com/valora-inc/resolve-kit/commit/5500e28ca0323cee29ee589b4ca25131a7126bd8))
