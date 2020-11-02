let app = getApp()

Page({
  data: {
    prize:[],
    modalOpened5:false,
    selectedItemNo: 0,
    buttons5: [
      { text: '取消' },
      { text: '确定', extClass: 'buttonBold' },
    ],
    selectScore:'',
    selectPrize:'',
    userid:'',
    username:''
  },
  onLoad() {
    dd.getStorage({
      key:'userInfo',
      success:(res) => {
        this.setData({userid : res.data.jobnumber});
        this.setData({username : res.data.name});
      },
      fail:function(res){
        dd.alert({content:res.errorMessage})
      }
    });
    dd.httpRequest({
                    url: app.globalData.serverUrl+'/check/getPrizeList',
                    method: 'POST',
                    dataType: 'json',
                    success: (res) => {
                      console.log('getPrizeList res is:')
                      console.log('success----',res);
                    this.setData({prize : res.data.PrizeList});
                    },
                    fail: (res) => {
                      console.log("httpRequestFail---",res)
                      dd.alert({content: JSON.stringify(res)});
                    },
                    // complete: (res) => {
                    //     dd.hideLoading();
                    // }
                });
  },
  toExchange(e) {
    console.log("event in dataattr is :")
    console.log(e)
    console.log("prize is")
    console.log(this.data.prize[e.currentTarget.dataset.attr-1].prize_name_cn)
    this.setData({
      modalOpened5:true,
      selectScore:this.data.prize[e.currentTarget.dataset.attr-1].cost_score,
      selectPrize:this.data.prize[e.currentTarget.dataset.attr-1].prize_name_cn,
      selectPrizeIndex:e.currentTarget.dataset.attr
  })
  },
 
  onButtonClick5(e) {
    // const { target: { dataset } } = e;
    if(e.currentTarget.dataset.index==1){
      console.log("主操作")
      console.log("this.data.username")
      console.log(this.data.username)
      console.log("this.data.selectPrize")
      console.log(this.data.selectPrize)
      

      dd.httpRequest({
                    url: app.globalData.serverUrl+'/check/toExchangePrize',
                    method: 'POST',
                    data:{
                      requestScore:this.data.selectScore,
                      requestUserId:this.data.userid,
                      requestUserName: this.data.username,
                      selectPrizeName:this.data.selectPrize,
                      selectPrizeIndex:this.data.selectPrizeIndex
                    },
                    dataType: 'json',
                    success: (res) => {
                      console.log('getPrizeList res is:')
                      console.log('success----',res);
                    this.setData({modalOpened5: false,});
                    if(res.data.code==0){
                        dd.alert({content: "申请失败。您的总积分为"+res.data.total+"分，已使用"+res.data.used+"分，剩余"+res.data.restscore+"分，需要"+res.data.score+"分，分值不足。"});
                    }else if(res.data.code==200){
                      dd.alert({content: "恭喜您！申请成功，获取奖品请联系你的班长或你所在车间的精益专员。\r 您的总积分为"+res.data.total+"分，已使用"+res.data.used+"分，本次使用"+res.data.score+"分，剩余"+res.data.restscore+"分。"});
                    }
                    },
                    fail: (res) => {
                      console.log("httpRequestFail---",res)
                      // dd.alert({content: JSON.stringify(res)});
                      dd.alert({content: "申请失败，请检查您的积分是否足够或联系管理员。"});
                      this.setData({modalOpened5: false,});
                    },
                    // complete: (res) => {
                    //     dd.hideLoading();
                    // }
                });
    }else{
       this.setData({
      modalOpened5: false,
    }); 
    }
    
    // my.alert({
    //   title: `点击了：${JSON.stringify(dataset)}`,
    //   buttonText: '关闭',
    // });
  },
 
});
