import 'jest-preset-angular/setup-jest';

jest.mock('bpmn-js/lib/Modeler', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {
        on: jest.fn(),
        attachTo: jest.fn(),
        destroy: jest.fn()
      };
    })
  };
});

jest.mock('bpmn-js-properties-panel', () => {
  return {
    default: jest.fn()
  };
});

jest.mock('@bpmn-io/add-exporter', () => {
  return {
    default: jest.fn()
  };
});

jest.mock('dmn-js/lib/Modeler', () => {
  return {
    default: jest.fn()
  };
});

jest.mock('dmn-js-properties-panel', () => {
  return {
    default: jest.fn()
  };
});
