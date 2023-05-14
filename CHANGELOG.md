# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- new `ModelingService` to handle frequently used modeling actions (i.e. export to SVG/XML, etc.)

### Changed

## [0.0.3] - 2023-05-13

### Added

- ng-dmn: support for DMN diagrams
- ng-cmmn: support for CMMN diagrams
- ng-bpmn: `autoOpenMinimap` property to automatically open the Minimap (requires `showMinimap` to be `true`)
- ng-bpmn: add custom diagram exporter metadata
- ng-bpmn: keyboard support, `hotkeys` property to enable default keyboard combinations (see component README for more details)
- ng-bpmn: `changed` event to track diagram changes and access the XML content (debounced)
- app: Improved demo application, using Angular Material components

### Changed

- ng-bpmn: make `url` a required input property
- ng-bpmn: embedded styles, remove the need to copy style assets

## [0.0.2] - 2023-05-09

### Added

- ng-bpmn: Minimap support
- ng-bpmn: Saving diagrams as XML and SVG

## [0.0.1] - 2023-05-08

### Added

- initial component release
