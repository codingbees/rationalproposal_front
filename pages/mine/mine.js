let app = getApp()

Page({
  data: {
    
    username:'',
    position:'',
    departments:'',
    myScores:[],
    myExchangeList:[],
    expand3rd:false,
    showMyMessage: false,
    showMyExchange: false,
  },
  onLoad(){
    dd.getStorage({
      key:'userInfo',
      success:(res) => {
        console.log("user info")
        console.log(res)
        // this.setData({thumb : res.data.avatar})
        this.setData({username : res.data.name})
        this.setData({position : res.data.position})
        this.setData({departments : res.data.departments})
      dd.httpRequest({
        url: app.globalData.serverUrl + '/check/getMyMessage',
        method: 'POST',
        data:{userid: res.data.jobnumber},
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        dataType: 'json',
        success: res => {
          console.log("res getMyMessage")
          console.log(res)
          this.setData({ myScores: res.data });
          this.setData({ myExchangeList : res.data.myExchangeList})
        },
        fail: function (res) {
          dd.alert({ content: 'check/getCheckList发起失败，未知原因，请联系管理员' });
          }
        });
      },
      fail:function(res){
        dd.alert({content:res.errorMessage})
      }
    });
  },
});
