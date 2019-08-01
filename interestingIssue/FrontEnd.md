## css
```
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
