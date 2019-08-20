## css
#### 1.
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
#### 2.height：100%
W3C的规范，百分比的高度在设定时需要根据这个元素的父元素容器的高度。所以，如果你把一个div的高度设定为height: 50%;，而它的父元素的高度是100px，那么，这个div的高度应该是50px。

> Web浏览器在计算有效宽度时会考虑浏览器窗口的打开宽度。如果你不给宽度设定任何缺省值，那浏览器会自动将页面内容平铺填满整个横向宽度。

但是高度的计算方式完全不一样。事实上，浏览器根本就不计算内容的高度，除非内容超出了视窗范围(导致滚动条出现)。或者你给整个页面设置一个绝对高度。否则，浏览器就会简单的让内容往下堆砌，页面的高度根本就无需考虑。
因为页面并没有缺省的高度值，所以，当你让一个元素的高度设定为百分比高度时，无法根据获取父元素的高度，也就无法计算自己的高度。换句话说，父元素的高度只是一个缺省值：height: auto;。当你要求浏览器根据这样一个缺省值来计算百分比高度时，只能得到undefined的结果。也就是一个null值，浏览器不会对这个值有任何的反应。
父元素没有设定固定高度，于是子元素的高度height: 100% 也不会起作用。你可以根据父元素的背景色来判断子元素的高度不是100%。
那么，如果想让一个元素的百分比高度height: 100%;起作用，你需要给这个元素的所有父元素的高度设定一个有效值。换句话说，你必须设定<body>和<html>的高度。


#### 3.bind事件触发
普通的view组件bindtap触发点在绑定的元素上，如果其包含子元素，则点击子元素不触发，大概是由于子元素覆盖在其上

picker组件的bindPickerChange事件触发为picker的全部子元素，因此应该用一层view来包裹其子元素，否则在子元素和父元素的间隙不触发
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
