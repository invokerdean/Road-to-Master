## gosublime插件
>　官方文档更新install package后搜不到gosublime

1. 打开Sublime text3, 点击preference ---> browse packages, 右击gitBash here(需要提前装git)下载gosublime: https://margo.sh/GoSublime

2. 点击GoSublime 文件夹--->src--->新建一个文件夹margo

3. 打开margo.sh-->extension-example-->复制extension-example.go到margo 并改名为margo.go

4. gosublime重启后，点击菜单项Preferences ->package settings->GoSublime ->Settings - Uesrs，配置GOPATH，GOROOT　　　　在打开的窗口里输入如下内容，并保存{    "env": {        "GOPATH": "c:/go",        "GOROOT": "c:/GoWorkspace"    }}
