## css
```html
<text class="vPriceNow">
      <text>{{item.priceNow}}</text>
      <text>/斤</text>
</text>
```
vPriceNow处于绝对定位的模式
此时，3.46/斤能正确排布

```
<text class="vPriceNow">
      {{item.priceNow}}
      <text>/斤</text>
</text>
```
此时，3.46位于上部，/斤位于下部

## js
```JavaScript
data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        generalUserUrl: '/pages/generalUsers/generalUsers',
        lawyerDoctorUrl: '/pages/lawyersAndDoctors/lawyersAndDoctors',
        isLawyerOrDoctor: false, 
    },
  //事件处理函数
    bindViewTap: function() {
        let that=this;
        if(that.isLawyerOrDoctor){
            wx.navigateTo({
                url: that.data.lawyerDoctorUrl
            });
            this.isLawyerOrDoctor = !this.isLawyerOrDoctor;
        }else{
            wx.navigateTo({
                url: that.data.generalUserUrl
            });
            this.isLawyerOrDoctor = !this.isLawyerOrDoctor;
        }
        
    },
}
```
对于isLawyerOrDoctor，只需this即可调用，对于lawyerDoctorUrl和generalUserUrl，需要使用this.data.进行调用？？
