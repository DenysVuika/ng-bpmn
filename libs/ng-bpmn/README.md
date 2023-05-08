# Angular BPMN

Standalone BPMN components for your Angular applications.

## Getting Started

Install the dependency:

```sh
npm i @DenysVuika/ng-bpmn
```

Update `angular.json` (or `project.json`) and setup additional styles:

```json
{
  "targets": {
    "build": {
      "options": {
        "styles": [
          "node_modules/@DenysVuika/ng-bpmn/assets/diagram-js.css",
          "node_modules/@DenysVuika/ng-bpmn/assets/bpmn-js.css",
          "node_modules/@DenysVuika/ng-bpmn/assets/bpmn-font/css/bpmn.css",
          "node_modules/@DenysVuika/ng-bpmn/assets/properties-panel.css",
          "node_modules/@DenysVuika/ng-bpmn/assets/element-templates.css",
          "node_modules/@DenysVuika/ng-bpmn/assets/diagram-js-minimap.css"
          "./src/styles.scss"
        ]
      }
    }
  }
}
```

## Basic Usage

```html
<ng-bpmn [url]="diagramUrl" />
```

![default](./docs/ng-bpmn-default.png)

## Properties Panel

```html
<ng-bpmn [url]="diagramUrl" [showProperties]="true" />
```

![properties panel](./docs/ng-bpmn-properties.png)

## Minimap

```html
<ng-bpmn [url]="diagramUrl" [showProperties]="true" [showMinimap]="true" />
```

![minimap](./docs/ng-bpmn-minimap.png)
