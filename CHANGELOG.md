# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.7] - 2020-09-30

### Fixed

- Fixed the silly bug introduced by switching back to plain ol date objects, and gettig rid of Luxon or Day.js

## [0.0.6] - 2020-09-30

Oops. After a short lived foray into using various date math libraries, and switching back to native libraries, this did't work either.

## [0.0.5] - 2020-09-28

Yes, there's a jump between them. None of them really worked. Best to pretend that never existed, really.

### Added

- Browser bundles, and minifed versions
- Add forward check, 24 hours, to avoid needing to makea request each time it's run
- Add Rollup into the mix to generate our differnt builds. If you know a nice way to single cross platform, small bundle - please help out 🙏

## [0.0.1]

### Added

- Add initial gridintensity object for querying in the DOM, and serverside in Node.
