let app = getApp()


Page({
  data: {
    tagData: [],
    scores: [1, 2, 3, 4, 5],
    indexScore: 0,
    getCheckItem: [],
    handlers: [],
    indexHandler: 0,
    no: '',
    img: [],
    src: 'http://110.186.68.166:18901/rationalproposal/',
    handler_userid: '',
    handler_username: '',
    addScore: 0,
    handlersid: [],
    userjobnumber: '',
    userid: '',
    username: '',
    isShiftLeader: false,
    leanManagerId: '',
    leanManagerName: '',
    supervisorName:'',
    supervisorId:''

  },
  onShareAppMessage(e) {

    return {
      title: '合理化建议',
      desc: '合理化建议审核页面',
      path: '/pages/check/toBeChecked/toBeChecked'
    };
  },
  onPickerTap() {
    my.showActionSheet({
      title: '选择分值',
      items: scores,
      success: (res) => {

        this.setData({
          score: scores[res.index],
        });
      },
    });
  },
  previewImage(e) {

    my.previewImage({
      current: 2,
      urls: [
        this.data.src + e.currentTarget.dataset.img
      ],
    });
  },
  changename(e) {

    this.setData({
      handler_username: e.detail.value
    })
  },
  changeid(e) {

    this.setData({
      handler_userid: e.detail.value
    })
  },
  changescore(e) {

    this.setData({
      addScore: e.detail.value
    })
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
      url: app.globalData.serverUrl + '/check/getCheckItem',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      data: { no: query.no },
      dataType: 'json',
      success: res => {
        console.log(res)
        this.setData({ getCheckItem: res.data.getCheckItem });
        // console.log("imgs are")
        // console.log(res.data.img[0])
        this.setData({
          img: res.data.img,
          supervisorName: res.data.supervisor[0].leader_name,
          supervisorId: res.data.supervisor[0].leader_id
        });
      },
      fail: function (res) {
        dd.alert({ content: '发起失败，未知原因，请联系管理员' });
      }
    });
    dd.httpRequest({
      url: app.globalData.serverUrl + '/check/getHandlers',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      data: { no: query.no },
      dataType: 'json',
      success: res => {
        // console.log("get handlers")
        // console.log(res)
        this.setData({ handlers: res.data.handlers });
        this.setData({ handlersid: res.data.handlersid });
      },
      fail: function (res) {
        dd.alert({ content: '发起失败，未知原因，请联系管理员' });
      }
    });
    dd.getStorage({
      key: 'leanManager',
      success: res => {
        this.setData({
          isShiftLeader: res.data.isShiftLeader,
          leanManagerId: res.data.managerId,
          leanManagerName: res.data.managerName,
        })
      }
    })
    dd.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({ userid: res.data.userid });
        this.setData({ userjobnumber: res.data.jobnumber });
        this.setData({ partid: res.data.department });
        this.setData({ username: res.data.name });
        this.setData({ partname: res.data.departments });
      },
      fail: function (res) {
        dd.alert({ content: res.errorMessage })
      }
    });
    dd.setNavigationBar({
      title: '审核建议'
    });
  },
  selectDate() {
    dd.datePicker({
      format: 'yyyy-MM-dd',
      success: (res) => {
        this.setData({ commitDate: res.date })
      },
    });
  },
  scoreChange(e) {
    let _this = this;
    this.setData({
      indexScore: e.detail.value,
    });

  },
  onSubmit: function (e) {
    var formdata = e.detail.value;
    console.log("e in submit is")
    console.log(e)
    if (formdata.is_excellent) {
      formdata.is_excellent = 1
    } else { formdata.is_excellent = 0 }
    //如果页面选择升级至部门主管
    if (formdata.is_difficult) {
      formdata.auditor_username = this.data.supervisorName
      formdata.auditor_userid = this.data.supervisorId
      formdata.audit_opinion = undefined
      formdata.handler_userid = undefined
      formdata.handler_username = undefined
      formdata.scores = 0
      formdata.commit_finish_date = '1970-1-1'
      formdata.is_checked = 0
      formdata.is_excellent = 0
    } else {
      formdata.is_checked = 1
      if (formdata.addScore != null || "" != formdata.addScore) {
        var s = /^[0-9]+[0-9]*]*$/; //判断附加分是否为正整数
        if (!s.test(formdata.addScore)) {
          dd.showToast({ content: '附加分应为整数！' })
          return false;
        }
        formdata.addScore = this.data.addScore;
      }
      if (this.data.userjobnumber == 'FL00000178' || this.data.userjobnumber == this.data.leanManagerId) {
        if (formdata.handler_username == null || "" == formdata.handler_username || formdata.handler_userid == null || "" == formdata.handler_userid) {
          dd.showToast({ content: '请填写处理人信息！' })
          return false
        } else {
          formdata.handler_username = this.data.handler_username;
          formdata.handler_userid = this.data.handler_userid;
        }
      } else {
        formdata.handler_username = this.data.handlers[this.data.indexHandler];
        formdata.handler_userid = this.data.handlersid[this.data.indexHandler];
      }
      if (formdata.audit_opinion == null || "" == formdata.audit_opinion) {
        dd.showToast({ content: '请填写审核意见！' })
        return false;
      }
      if (formdata.commit_finish_date == null || "" == formdata.commit_finish_date) {
        dd.showToast({ content: '请选择完成日期！' })
        return false;
      }
    }
    formdata.scores = this.data.scores[this.data.indexScore];
    
    // if (e.detail.value.is_difficult) {
    //   e.detail.value.is_difficult = 1
    // } else { e.detail.value.is_difficult = 0 }

    formdata.is_difficult = 0

    


    dd.httpRequest({
      url: app.globalData.serverUrl + '/check/submitCheck?rp_no=' + this.data.no,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      data: formdata,
      dataType: 'json',
      success: function (res) {
        dd.showToast({
          type: 'success',
          content: "已成功提交",
          duration: 2000
        });

      },
      fail: function (res) {
        dd.alert({ content: '数据提交失败，未知原因，请联系管理员' });
      },
      complete: function (res) {
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
    console.log('form发生了submit事件，携带数据为：', formdata)
  },
  reject() {
    dd.redirectTo({
      url: '/pages/check/reject/reject?no=' + this.data.no
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


