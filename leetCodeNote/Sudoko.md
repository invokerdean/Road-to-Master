# 1.数独问题
> 每行每列每个九宫格需要有不重复的1-9

#### 36.验证已填部分是否符合规则
思路：
1. 建立三个二维9x9数组标记行列子九宫格的的1-9是否已经出现
2. 循环遍历输入的二维数组，对于每个字符元素，转换为1中对应数组的坐标，其中，子九宫格的坐标：i/3*3+j/3
3. 判断当前(i,j,k)的数字是否已经出现过，是则返回false，否则将三个标记数组中对应的坐标置为1
4.循环结束返回true
```C++
class Solution {
public:
    bool isValidSudoku(vector<vector<char>>& board) {
        int used1[9][9]={0},used2[9][9]={0},used3[9][9]={0};
        for(int i=0;i<board.size();i++){
            for(int j=0;j<board[i].size();j++){
                if(board[i][j]!='.'){
                    int num=board[i][j]-'0'-1,k=i/3*3+j/3;
                    if(used1[i][num]||used2[j][num]||used3[k][num]) return false;
                    used1[i][num]=used2[j][num]=used3[k][num]=1;
                }
            }
        }
        return true;
    }
};
```
