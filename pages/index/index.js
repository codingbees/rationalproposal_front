let app = getApp();

Page({
    data:{
        corpId: '',
        authCode:'',
        userId:'',
        userName:'',
        avatar:'',
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
            },{
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
            }
          ],
    },
    onItemClick: function(ev) {
      //console.log(ev);
      if(ev.detail.index==0){
        dd.navigateTo({
          url: '/pages/raiseProposal/raiseProposal'
              })
      }else if(ev.detail.index==1){
        dd.navigateTo({
          url: '/pages/check/check'
        })
      }else if(ev.detail.index==2){
       dd.navigateTo({
          url: '/pages/handle/handle'
        })
      }else if(ev.detail.index==3){
       dd.navigateTo({
          url: '/pages/mylist/mylist'
        })
      }else if(ev.detail.index == 4){
        dd.navigateTo({
          url: '/pages/ranking/ranking'
        })
      }else if(ev.detail.index == 5){
        dd.navigateTo({
          url: '/pages/scores/scores'
        })
      }
    },
    onLoad(){

        let _this = this;

        this.setData({
            corpId: app.globalData.corpId
        });
        
        dd.showLoading({
          content: '登录中...'
        });
        dd.getAuthCode({
            success:(res)=>{
              console.log("res from getAuthCode is:")
              console.log(res);
                this.setData({
                    authCode:res.authCode
                })
                dd.httpRequest({
                    url: app.globalData.serverUrl+'/login',
                    method: 'POST',
                    data: {
                        authCode: res.authCode
                    },
                    dataType: 'json',
                    success: (res) => {
                      console.log('httpsuccess----',res)
                      dd.setStorage({
                        key:'userInfo',
                        data:JSON.parse(res.data.result.userinfo)
                      })
                    },
                    fail: (res) => {
                      console.log('httpfailed----',res)
                      // dd.alert("登录失败，请检查您的网络或将钉钉升级到最新版本");
                      dd.alert(res.data)
                    },
                    complete: (res) => {
                        dd.hideLoading();
                    }
                    
                });
            },
            
            fail: (err)=>{
                console.log(err)
                dd.alert('获取用户信息失败，请检查您的网络或将钉钉升级到最新版本')
            }
        })
        
        
    }
})