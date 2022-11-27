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
        message: 'composable名を入力'
      }
    ]

    return inquirer.prompt(questions).then(answers => {
      const includeComposable = '/includes/composable'
      return { ...answers, includeComposable }
    })
  }
}
