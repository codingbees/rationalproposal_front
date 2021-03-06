let app = getApp();

Page({
  data: {
    u_info: {},
    corpId: '',
    authCode: '',
    userId: '',
    userName: '',
    avatar: '',
    hideList: true,
    list5: [
      {
        // "icon": "http://192.168.18.126:18080/icons/generalp.png",
        "icon": "./img/generalp.png",
        "text": "新发起"
      },
      {
        "icon": "./img/asdb.png",
        "text": "待我审核"
      },
      {
        "icon": "./img/ap.png",
        "text": "待我处理"
      }, {
        "icon": "./img/mb.png",
        "text": "我发起的"
      },
      {
        "icon": "./img/sstaticp.png",
        "text": "建议排名"
      },
      {
        "icon": "./img/scoresb.png",
        "text": "积分兑换"
      },
      {
        "icon": "./img/auditp2.png",
        "text": "精益审核"
      },
      {
        "icon": "./img/excellentb.png",
        "text": "优秀建议"
      },
      {
        "icon": "./img/difip.png",
        "text": "建议征集"
      },
      {
        "icon": "./img/chartb.png",
        "text": "KPI"
      }
    ],
  },
  onItemClick: function (ev) {
    //console.log(ev);
    if (ev.detail.index == 0) {
      dd.navigateTo({
        url: '/pages/raiseProposal/raiseProposal'
      })
    } else if (ev.detail.index == 1) {
      dd.navigateTo({
        url: '/pages/check/check'
      })
    } else if (ev.detail.index == 2) {
      dd.navigateTo({
        url: '/pages/handle/handle'
      })
    } else if (ev.detail.index == 3) {
      dd.navigateTo({
        url: '/pages/mylist/mylist'
      })
    } else if (ev.detail.index == 4) {
      dd.navigateTo({
        url: '/pages/ranking/ranking'
      })
    } else if (ev.detail.index == 5) {
      dd.navigateTo({
        url: '/pages/scores/scores'
      })
    } else if (ev.detail.index == 6) {
      dd.navigateTo({
        url: '/pages/doubleAudit/doubleAudit'
      })
    } else if (ev.detail.index == 7) {
      dd.navigateTo({
        url: '/pages/excellent/excellent'
      })
    } else if (ev.detail.index == 8) {
      dd.navigateTo({
        url: '/pages/difficult/difficult'
      })
    } else if (ev.detail.index == 9) {
      dd.navigateTo({
        url: '/pages/kpi/kpi'
      })
    }
  },
 
  getLeanManager(jobnumber) {
    return new Promise((resolve, reject) => {
      dd.httpRequest({
        url: app.globalData.serverUrl + '/checkIsLeader',
        method: 'POST',
        data: {
          jobnumber: jobnumber
        },
        dataType: 'json',
        success: res => {
          resolve(res.data)
        },
        fail: (res) => {
          reject(JSON.parse(res))
        }
      });
    })
  },
  login(authCode) {
    dd.httpRequest({
      url: app.globalData.serverUrl + '/login',
      method: 'POST',
      data: {
        authCode
      },
      dataType: 'json',
      success: (res) => {
        let u_info = JSON.parse(res.data.result.userinfo)
        this.setData({
          u_info
        })
        this.getLeanManager(u_info.jobnumber).then(res1 => {

          dd.setStorage({
            key: 'leanManagerList',
            data: res1
          })
        }).catch(err => {
          // dd.alert("登录失败，请检查您的网络或将钉钉升级到最新版本");
          dd.alert({
            title: '获取数据失败',
            content: "请检查您的网络或将钉钉升级到最新版本后重试",
          });
        })

        dd.setStorage({
          key: 'userInfo',
          data: JSON.parse(res.data.result.userinfo)
        })
      },
      fail: (res) => {
        console.log('httpfailed----', res)
        dd.alert({
          title: '获取数据失败',
          content: "请检查您的网络或将钉钉升级到最新版本后重试",
        });
        // dd.alert(res.data)
      },
      complete: (res) => {
        dd.hideLoading();
      }

    });
  },
  onLoad() {
    this.setData({
      corpId: app.globalData.corpId
    });

    dd.showLoading({
      content: '登录中...'
    });
    dd.getAuthCode({
      success: (res) => {
        // console.log("res from getAuthCode is:")
        // console.log(res);
        this.setData({
          authCode: res.authCode
        })

        this.login(res.authCode)
      },

      fail: (err) => {
        // console.log(err)
       dd.alert({
          title: '登录失败',
          content: "请检查您的网络或将钉钉升级到最新版本后重试",
        });
      }
    })


  }
})