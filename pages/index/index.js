const home = require('../../mock/home')

Page({
  data: {
    home
  },

  handleNavTap(event) {
    const { label } = event.currentTarget.dataset
    wx.showToast({
      title: `${label}建设中`,
      icon: 'none'
    })
  },

  handleMore(event) {
    const { title } = event.currentTarget.dataset
    wx.showToast({
      title: `${title}更多内容待接入`,
      icon: 'none'
    })
  }
})
