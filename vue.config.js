module.exports = {
  configureWebpack: {
    resolve: {
      // extensions 配置后缀
      extensions:[],
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'
      }
    }
  }
};