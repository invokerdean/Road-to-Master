# 易位构词
> 易位构词游戏的英文词汇是 anagram，这个词来源于有“反向”或“再次”的含义的希腊语字根ana-和有“书写”、“写下”的意思的词根grahpein。易位构词是一类文字游戏（更准确地说是一类“词语游戏”），是将组成一个词或短句的字母重新排列顺序，原文中所有字母的每次出现都被使用一次，这样构造出另外一些新的词或短句。

####
通俗的讲易位构词，就是对原单词的字母进行重新排列从而构词一个新词，它满足： 
1. 新词语的每个字母都是出自原词。 
2. 新词语单词长度跟原单词长度一样。 
3. 原单词的每个字母都在新单词里出现。 
4. 单词默认都是小写 
比如dog－->god就符合易位构词规则，而good—>god则不符合。

> 判断两个单词是否为anagram的方法
法一：使用哈希表：key为字符，value为出现的次数，若两个单词构成的hashmap相同，那么就是anagram。实现起来就是用一个单词构建hashmap，然后用另一个单词对前面的hashmap中的字符逐个去除，最后如果hashmap为空，则返回true。该方法的时间复杂度为O(m+n),m和n分别为另两个单词的长度，而空间复杂度为O(字符集的大小)。
法二：将两个单词排序，若排序后的结果相同，说明两个单词是anagram。该方法的时间复杂度取决于排序算法，一般排序算法时间复杂度为O(nlogn)，如果字符集足够小，也可以用线性排序算法。
总体而言，若判断两个单词是否为anagram，方法一要直接简单一些。


#### 49. Group Anagrams
思路：
只需要对每个字符串排序，然后建立hashmap，key为排序后的串，value为所有属于这个key类的字符串【灵活一点，可以用字符串数组的索引表示】，这样就可以进行简单的分类。若有n个字符串，字符串最大空间为k，那么该算法的时间复杂度为O(nklogk)，其中O(klogk)是对每个字符串进行排序（若用线性算法也可以提高），空间复杂度为O(nk),即hashmap的大小。

```javascript
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
        var resArr=[],
            resObject={},
            str,
            strSorted;
        for(var i=0;i<strs.length;i++){
            str=strs[i];
            strSorted=str.split("").sort().join("");
            if(resObject[strSorted]===undefined){
                resObject[strSorted]=[str];
            }else{
                resObject[strSorted].push(str);
            }
        }
        for(var j in resObject){
            resArr.push(resObject[j]);
        }
        return resArr;
};
```
