export default {
  schema: {
    title: 'Рубрика',
    properties: {
      name: {
        type: 'string',
      },
      description: {
        type: 'string'
      },
    },
    required: [ 'name' ]
  },
  ui: {
    name: {
      widget: 'BInput',
      inputType: 'text'
    },
    description: {
      widget: 'BTextarea',
    }
  },
  model: {
    name: '',
    description: '',
  }
}