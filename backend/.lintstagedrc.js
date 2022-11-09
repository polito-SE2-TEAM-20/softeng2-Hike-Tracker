module.exports = {
  '*.ts': (filenames) =>
    filenames.length > 10 ? 'eslint "{src,apps,libs,test}/**/*.ts" --fix' : `eslint ${filenames.join(' ')} --fix`,
}