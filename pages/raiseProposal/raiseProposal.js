let app = getApp();

Page({
  data: {
    fileqty: 0,
    fileupdateqty: 0,
    happenDate: '',
    requestData: '',
    filename: '',
    leaderName: '',
    leaderId: '',
    userid: '',
    partid: '',
    partname: '',
    username: '',
    array: [],
    index: 0,
    arrayLine: [],
    indexLine: 0,
    arrayType: [],
    indexType: 0,
    arrayCheck: [],
    indexCheck: 0,
    arrayAuditorJobNo: [],
    arrayDep: [],
    indexDep: 0,
    modalOpened5: false,
    buttons5: [
      { text: '取消' },
      { text: '确定', extClass: 'buttonBold' },
    ],
    picNames:[],
    imgspath:'../../../../D:\\apache-tomcat-8.0.26\\webapps\\rationalproposal\\'
  },
  onLoad() {
    dd.getStorage({
      key: 'userInfo',
      success: (res) => {
        console.log("userInfo is")
        console.log(res)
        this.setData({ userid: res.data.jobnumber });
        this.setData({ partid: res.data.department });
        this.setData({ username: res.data.name });
        this.setData({ partname: res.data.departments });
        // this.setData({arrayDep : [res.data.departments]}); 获取用户所在的部门
        dd.httpRequest({
          url: app.globalData.serverUrl + '/getAuditor',
          method: 'POST',
          data: { userid: this.data.userid },
          dataType: 'json',
          success: res => {
            
            console.log("res in getAuditor")
            console.log(res)
            this.setData({ arrayCheck: res.data.arrayAuditor });
            console.log("res in arrayAuditorJobNo")
            console.log(res.data.arrayAuditorJobNo)
            this.setData({ arrayAuditorJobNo: res.data.arrayAuditorJobNo });
          },
          fail: function (res) {
            dd.alert({ content: '获取改善类型失败，请联系管理员' });
          }
        });
      },
      fail: function (res) {
        dd.alert({ content: res.errorMessage })
      }
    });
    dd.httpRequest({
      url: app.globalData.serverUrl + '/getDepartment',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      dataType: 'json',
      success: res => {
        console.log(res)
        this.setData({ arrayDep: res.data.arrayDep });
      },
      fail: function (res) {
        dd.alert({ content: '获取事业部信息失败，请联系管理员' });
      }
    });
    dd.httpRequest({
      url: app.globalData.serverUrl + '/getWorkshop',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      dataType: 'json',
      success: res => {
        console.log(res)
        this.setData({ array: res.data.array });
      },
      fail: function (res) {
        dd.alert({ content: '获取车间部信息失败，请联系管理员' });
      }
    });
    //获取产线名称
    dd.httpRequest({
      url: app.globalData.serverUrl + '/getLine',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      dataType: 'json',
      success: res => {
        console.log(res)
        this.setData({ arrayLine: res.data.arrayLine });
      },
      fail: function (res) {
        dd.alert({ content: '获取产线失败，请联系管理员' });
      }
    });
    //获取改善类型
    dd.httpRequest({
      url: app.globalData.serverUrl + '/getType',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      dataType: 'json',
      success: res => {
        this.setData({ arrayType: res.data.arrayType });
      },
      fail: function (res) {
        dd.alert({ content: '获取改善类型失败，请联系管理员' });
      }
    });

    dd.setNavigationBar({
      title: '发起建议'
    });
  },

  selectFile() {
    var _this = this;
    dd.chooseImage({
      sourceType: ['camera', 'album'],
      count: 9,
      success: res => {
        var paths = new Array();
        for (let i = 0; i < res.filePaths.length; i++) {
          paths[i] = (res.filePaths && res.filePaths[i]) || (res.apFilePaths && res.apFilePaths[i]);
          _this.data.fileupdateqty++;
          _this.setData({ fileqty: _this.data.fileupdateqty })
          dd.uploadFile({
            url: app.globalData.serverUrl + '/uploadFile',
            fileType: 'image',
            fileName: 'file',
            filePath: paths[i],
            success: res => {
            console.log(res)
              let resp = JSON.parse(res.data);
              _this.setData({

                filename : _this.data.filename+resp.fileName,        
              })

            },
            fail: function (res) {
              dd.alert({ title: `上传失败：${JSON.stringify(res)}` });
            },
          });
        }
      },
    });
  },

  onSubmit: function (e) {
    e.detail.value.department = this.data.arrayDep[this.data.indexDep];
    e.detail.value.workshop = this.data.array[this.data.index];
    e.detail.value.prodcutionLine = this.data.arrayLine[this.data.indexLine];
    e.detail.value.improve_type = this.data.arrayType[this.data.indexType];
    e.detail.value.picture_of_problem = this.data.filename;
    e.detail.value.auditor_username = this.data.arrayCheck[this.data.indexCheck];
    e.detail.value.auditor_userid = this.data.arrayAuditorJobNo[this.data.indexCheck];
    //2020-07-02 新增判断
    var formdata = e.detail.value;
    if (formdata.description == null || "" == formdata.description) {
      dd.showToast({ content: '请填写问题描述！' })
      return false;
    }
    if (formdata.proposal == null || "" == formdata.proposal) {
      dd.showToast({ content: '请填写改善建议！' })
      return false;
    }
    if (formdata.find_userid == null || "" == formdata.find_userid) {
      dd.showToast({ content: '未获取到您的员工信息，请尝试重新登录或升级钉钉至最新版！' })
      return false;
    }

    dd.httpRequest({
      url: app.globalData.serverUrl + '/submitProposal',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      data: e.detail.value,
      dataType: 'json',
      success: function (res) {
        dd.showToast({
          type: 'success',
          content: "合理化建议发起成功！",
          duration: 1100
        });
      },
      fail: function (res) {
        dd.alert({ content: '发起失败，请联系管理员' });
      },
      complete: function (res) {
        // dd.redirectTo({
        //  url: '/pages/index/index'
        // })
        // dd.navigateTo({
        //  url: '/pages/index/index'
        // })
        dd.navigateBack({
          delta: 2
        })
      }
    });
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  depChange(e) {
    let _this = this;
    this.setData({
      indexDep: e.detail.value,
    });
    dd.httpRequest({
      url: app.globalData.serverUrl + '/getWorkshop',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      data: { selectDep: _this.data.arrayDep[e.detail.value] },
      dataType: 'json',
      success: function (res) {
        
        _this.setData({ array: res.data.array });
        _this.setData({ arrayLine: res.data.arrayLine });
        console.log(_this.data.arrayAuditorJobNo[0])
        console.log(res.data.leanUserlist[0])
        if (_this.data.arrayAuditorJobNo[0] != res.data.leanUserlist[0].ding_user_id) {
          //onload时已定义若发起人是班长则审核人为精益管理员。此处若审核人为精益管理员，则不改审核人
          _this.setData({ arrayCheck: res.data.arrayAuditor });
          _this.setData({ arrayAuditorJobNo: res.data.arrayAuditorJobNo });
        }
      },
      fail: function (res) {
        dd.alert({ content: 'workshop change failed' });
      },
    });
  },
  workshopChange(e) {
    let _this = this;
    this.setData({
      index: e.detail.value,
    });
    dd.httpRequest({
      url: app.globalData.serverUrl + '/getLine',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      data: { selectws: _this.data.array[e.detail.value] },
      dataType: 'json',
      success: function (res) {
        console.log("res from getline")
        console.log(res)
        _this.setData({ arrayLine: res.data.arrayLine });
        console.log(_this.data.arrayAuditorJobNo[0])
        console.log(res.data.leanUserlist[0])
        if (_this.data.arrayAuditorJobNo[0] != res.data.leanUserlist[0].ding_user_id) {
          //onload时已定义若发起人是班长则审核人为何雯。此处若审核人为何雯，则不改审核人
          _this.setData({ arrayCheck: res.data.arrayAuditor });
          _this.setData({ arrayAuditorJobNo: res.data.arrayAuditorJobNo });
        }
      },
      fail: function (res) {
        dd.alert({ content: 'workshop change failed' });
      },
    });
  },
  lineChange(e) {
    this.setData({
      indexLine: e.detail.value,
    });
  },
  auditorChange(e) {
    this.setData({
      indexCheck: e.detail.value,
    });
  },
  typeChange(e) {
    this.setData({
      indexType: e.detail.value,
    });
  },
});
