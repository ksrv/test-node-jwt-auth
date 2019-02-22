export default {
  schema: {
    title: 'Вход',
    properties: {
      email: {
        type: 'string',
      },
      password: {
        type: 'string'
      },
    },
    required: [ 'email', 'password' ]
  },
  ui: {
    email: {
      widget: 'BInput',
      inputType: 'email'
    },
    password: {
      widget: 'BInput',
      inputType: 'password'
    }
  },
  model: {
    email: '',
    password: '',
  }
};