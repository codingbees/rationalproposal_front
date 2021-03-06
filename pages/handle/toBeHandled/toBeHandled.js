let app = getApp()


Page({
  data: {
    getCheckItem:{},
    handlers:[],
    indexHandler:0,
    no:'',
    img:[],
    src: 'http://110.186.68.166:18901/rationalproposal/',
    fileqty : 0,
    filename:'',
    fileupdateqty: 0,
    showSuspendPOPUp:false,
    
    buttons5: [
      { text: '取消' },
      { text: '确定', extClass: 'buttonBold' },
    ],
  },
  handlerChange(e) {
    this.setData({
      indexHandler: e.detail.value,
    });
  },
  onLoad(query) {
    console.log(query)
    this.setData({
      no: query.rp_no,
    });
    dd.httpRequest({
      url: app.globalData.serverUrl+'/check/getHandleItem',
      method: 'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data: {rp_no : query.rp_no},
      dataType: 'json',
      success: res => {
        console.log('res is')
        console.log(res)
        this.setData({getCheckItem : res.data.getCheckItem});
        this.setData({img : res.data.img});
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
      title: '处理建议'
    });
  },
  previewImage(e){
    console.log("e in preview is ")
    console.log(e.currentTarget.dataset.img)
    my.previewImage({
      current: 2,
      urls: [
        this.data.src+e.currentTarget.dataset.img
      ],
    });
  },
  selectDate(){
    dd.datePicker({
      format: 'yyyy-MM-dd',
      success: (res) => {
        this.setData({acturalFinishDate : res.date})
      },
    });
  },
  selectFile(){
    var _this = this;
    dd.chooseImage({
      sourceType: ['camera', 'album'],
      count: 9,
      success: res => {
        console.log("chooseImage res is:")
        console.log(res)
        var paths = new Array();
        for(let i = 0;i <res.filePaths.length;i++ ){
           paths[i] = (res.filePaths && res.filePaths[i]) || (res.apFilePaths && res.apFilePaths[i]);
           this.data.fileupdateqty++;
           this.setData({fileqty : this.data.fileupdateqty})
           dd.uploadFile({
          url: app.globalData.serverUrl+'/check/uploadFilehandle',
          fileType: 'image',
          fileName: 'file',
          filePath: paths[i],
          success: res => {
            let resp =JSON.parse(res.data);
            // this.setData({filename:resp.fileName});
            this.data.filename+=resp.fileName;
            console.log("file names are:")
            console.log(this.data.filename)
          },
          fail: function (res) {
            dd.alert({ title: `上传失败：${JSON.stringify(res)}` });
          },
        });
        }
      },
    });
  },
  toSuspend(){
    this.setData({
      showSuspendPOPUp:true
    })
  },
  confirmToSuspend(e){
    if(e.currentTarget.dataset.index === 1){
      dd.redirectTo({
        url:'/pages/handle/suspend/suspend?no='+ this.data.no
      })
      
    //   dd.redirectTo({
    //   url: '/pages/check/reject/reject?no=' + this.data.no
    // })
    }

    this.setData({
      showSuspendPOPUp: false,
    });
  },
  
  onSubmit: function(e) {
    console.log(e)
    e.detail.value.picture_after_improve = this.data.filename;
     var formdata = e.detail.value;
    if(formdata.description_after_improve == null || "" == formdata.description_after_improve){
      dd.showToast({content:'请填写改善完成情况描述！'})
      return false;
    }
    if(formdata.picture_after_improve == null || "" == formdata.picture_after_improve){
      dd.showToast({content:'请上传处理完成后的照片！'})
      return false;
    }
    if(formdata.actural_finish_date == null || "" == formdata.actural_finish_date){
      dd.showToast({content:'请选择完成日期！'})
      return false;
    }
    dd.httpRequest({
      url: app.globalData.serverUrl+'/check/submitHandle?rp_no='+this.data.no,
      method: 'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data:e.detail.value,
      dataType: 'json',
      success: function(res) {
        console.log("res in success")
        console.log(res)
        dd.showToast({
          type: 'success',
          content: "已成功提交",
          duration: 1000
        });
        // dd.redirectTo({
        //     url:'/pages/handle/handle'  
        // })
      },
      fail: function(res) {
        dd.alert({content: '发起失败，未知原因，请联系管理员'});
      },
      complete: function(res) {
        dd.navigateBack({
            delta: 2
          })
        }
    });
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
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


