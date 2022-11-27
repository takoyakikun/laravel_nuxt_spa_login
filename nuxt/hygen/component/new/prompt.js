module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: 'input',
        name: 'directory',
        message: 'ディレクトリを入力'
      },
      {
        type: 'input',
        name: 'name',
        message: 'component名を入力'
      },
      {
        type: 'toggle',
        name: 'composable',
        message: 'composableを入れる',
        enabled: 'Yes',
        disabled: 'No'
      },
      {
        type: 'toggle',
        name: 'test',
        message: 'テストファイルを作成',
        enabled: 'Yes',
        disabled: 'No',
        initial: 'Yes'
      }
    ]

    return inquirer.prompt(questions).then(answers => {
      const includeVue = '/includes/vue'
      const includeComposable = '/includes/composable'
      const includeTest = '/includes/test'
      return { ...answers, includeVue, includeComposable, includeTest }
    })
  }
}
