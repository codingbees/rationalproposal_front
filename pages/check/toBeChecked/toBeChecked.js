let app = getApp()


Page({
  data: {
    tagData:[],
    scores: [5,4,3,2,1],
    indexScore:0,
    // scores:5,
    getCheckItem:[],
    handlers:[],
    indexHandler:0,
    no:'',
    img:[],
    src: 'http://110.186.68.166:18901/rationalproposal/',
    handler_userid:'',
    handlersid:[]

  },
  onPickerTap() {
    my.showActionSheet({
      title: '选择分值',
      items: scores,
      success: (res) => {
        console.log(res)
        console.log(scores[res.index])
        this.setData({
          score: scores[res.index],
        });
      },
    });
  },
  handlerChange(e) {
    this.setData({
      indexHandler: e.detail.value,
    });
  },
  onLoad(query) {
    this.setData({
      no: query.no,
    });
    dd.httpRequest({
      url: app.globalData.serverUrl+'/check/getCheckItem',
      method: 'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data: {no : query.no},
      dataType: 'json',
      success: res => {
        console.log(res)
        this.setData({getCheckItem : res.data.getCheckItem});
        // console.log("imgs are")
        // console.log(res.data.img[0])
        this.setData({img : res.data.img});
      },
      fail: function(res) {
        dd.alert({content: '发起失败，未知原因，请联系管理员'});
      }
    });
    dd.httpRequest({
      url: app.globalData.serverUrl+'/check/getHandlers',
      method: 'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data: {no : query.no},
      dataType: 'json',
      success: res => {
        console.log("get handlers")
        console.log(res)
        this.setData({handlers : res.data.handlers});
        this.setData({handlersid : res.data.handlersid});
      },
      fail: function(res) {
        dd.alert({content: '发起失败，未知原因，请联系管理员'});
      }
    });
    dd.getStorage({
      key:'userInfo',
      success:(res) => {
        this.setData({userid : res.data.userid});
        this.setData({partid : res.data.department});
        this.setData({username : res.data.name});
        this.setData({partname : res.data.departments});
      },
      fail:function(res){
        dd.alert({content:res.errorMessage})
      }
    });
    dd.setNavigationBar({
      title: '审核建议'
    });
  },
  selectDate(){
    dd.datePicker({
      format: 'yyyy-MM-dd',
      success: (res) => {
        this.setData({commitDate : res.date})
      },
    });
  },
  scoreChange(e) {
    let _this = this;
    this.setData({
      indexScore: e.detail.value,
    });

  },
  onSubmit: function(e) {
    console.log("e in submit is")
    console.log(e)
    e.detail.value.handler_username = this.data.handlers[this.data.indexHandler];  
    e.detail.value.handler_userid = this.data.handlersid[this.data.indexHandler];
    e.detail.value.scores = this.data.scores[this.data.indexScore]; 

     var formdata = e.detail.value;
    if(formdata.audit_opinion == null || "" == formdata.audit_opinion){
      dd.showToast({content:'请填写审核意见！'})
      return false;
    }
    if(formdata.commit_finish_date == null || "" == formdata.commit_finish_date){
      dd.showToast({content:'请选择完成日期！'})
      return false;
    }
    dd.httpRequest({
      url: app.globalData.serverUrl+'/check/submitCheck?rp_no='+this.data.no,
      method: 'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data:e.detail.value,
      dataType: 'json',
      success: function(res) {
        dd.showToast({
          type: 'success',
          content: "已成功提交",
          duration: 2000
        });
        // dd.redirectTo({
        //     url:'/pages/check/check'  
        // })
        
      },
      fail: function(res) {
        dd.alert({content: '发起失败，未知原因，请联系管理员'});
      },
      complete: function(res) {
          // dd.redirectTo({
          //   url:'/pages/check/check'
          // })
          dd.showToast({
          type: 'success',
          content: "已成功提交",
          duration: 1000
        });
          dd.navigateBack({
            delta: 2
          })
        
      }
    });
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  reject(){
    dd.redirectTo({
            url:'/pages/check/reject/reject?no='+this.data.no
          })
  },
  imageError(e) {
    console.log('imageError加载错误', e.detail.errMsg);
  },
  onTap(e) {
    console.log('image 发生 tap 事件', e);
  },
  imageLoad(e) {
    console.log('image 加载成功', e);
  },
});


