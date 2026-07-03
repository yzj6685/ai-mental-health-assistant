import eslintPluginVue from 'eslint-plugin-vue';

export default [
  ...eslintPluginVue.configs['flat/recommended'],
  {
    rules: {
      'vue/no-multiple-template-root': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-template-key': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/component-name-in-template-casing': 'off'
    }
  }
];