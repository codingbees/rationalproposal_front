let app = getApp()


Page({
  data: {
    selectedMonth: '',
    tabs: [],
    jobnumber:'',
    activeTab: 0,
    typeCapsule: true,
    typeHasSubTitle: false,
    hasPlus: false,
    currentMonth: '所有月份'
  },
  onLoad() {
    let date = new Date()
    let curMonth =  date.getMonth()+1
    let curYear = date.getFullYear()
    //this.setData({currentMonth : curYear+'-'+curMonth})
    console.log("curMonth is")
    console.log(curMonth)
    dd.httpRequest({
                    url: app.globalData.serverUrl+'/check/getRankingList',
                    method: 'POST',
                    dataType: 'json',
                    success: (res) => {
                      console.log('getRankingList res is:')
                      console.log('success----',res.data);
                    this.setData({tabs : res.data});
                    },
                    fail: (res) => {
                      console.log("httpRequestFail---",res)
                      dd.alert({content: JSON.stringify(res)});
                    },
                    complete: (res) => {
                        dd.hideLoading();
                    }
                });
  },
  handleTabClick({ index, tabsName }) {
    this.setData({
      [tabsName]: index
    });
  },
  handleTabChange({ index, tabsName }) {
    this.setData({
      [tabsName]: index,
    });
  },
  selectMonth(){
    dd.datePicker({
      format: 'yyyy-MM',
      success: (res) => {
        this.setData({currentMonth : res.date})
      },
    })
   
  },
  onSubmit(){
   dd.httpRequest({
                    url: app.globalData.serverUrl+'/check/getRankingList',
                    method: 'POST',
                    dataType: 'json',
                    data:{ selectedMonth : this.data.currentMonth},
                    success: (res) => {
                      console.log('getRankingList res on month change is:')
                      console.log('success----',res.data);
                    this.setData({tabs : res.data});
                    },
                    fail: (res) => {
                      console.log("httpRequestFail---",res)
                      dd.alert({content: JSON.stringify(res)});
                    },
                    complete: (res) => {
                        dd.hideLoading();
                    }
                });
  }
});
