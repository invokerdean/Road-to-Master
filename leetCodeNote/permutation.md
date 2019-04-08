# 全排列
> 全排列的含义就是一个序列所有的排序可能性，那么我们现在做这样的一个假设，假设给定的一些序列中第一位都不相同，那么就可以认定说这些序列一定不是同一个序列，这是一个很显然的问题。有了上面的这一条结论，我们就可以同理得到如果在第一位相同，可是第二位不同，那么在这些序列中也一定都不是同一个序列，这是由上一条结论可以获得的。

> 我们获得了在第一个位置上的所有情况之后，抽去序列T中的第一个位置，那么对于剩下的序列可以看成是一个全新的序列T1，序列T1可以认为是与之前的序列毫无关联了。同样的，我们可以对这个T1进行与T相同的操作，直到T中只一个元素为止。这样我们就获得了所有的可能性。所以很显然，这是一个递归算法。
#### 1.无重复元素
```C++
class Solution {
public:
    vector<vector<int> > permute(vector<int> &num) {
	    vector<vector<int> > result;
	    
	    permuteRecursive(num, 0, result);
	    return result;
    }
    
    // permute num[begin..end]
    // invariant: num[0..begin-1] have been fixed/permuted
	void permuteRecursive(vector<int> &num, int begin, vector<vector<int> > &result)	{
		if (begin >= num.size()) {
		    // one permutation instance
		    result.push_back(num);
		    return;
		}
		
		for (int i = begin; i < num.size(); i++) {
		    swap(num[begin], num[i]);
		    permuteRecursive(num, begin + 1, result);
		    // reset
		    swap(num[begin], num[i]);
		}
    }
};
```
https://blog.csdn.net/lemon_tree12138/article/details/50986990
