## 推荐方法
管理员身份运行PowerShell，执行以下cmd即可
```
Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force

npm install -g npm-windows-upgrade

npm-windows-upgrade
```
> Note: Do not run npm i -g npm. Instead use npm-windows-upgrade to update npm going forward. Also if you run the NodeJS installer, it will replace the node version.(fromStackOverFlow)

* Upgrades npm in-place, where node installed it.
* Easy updating, update to the latest by running npm-windows-upgrade -p -v latest.
* Does not modify the default path.
* Does not change the default global package location.
* Allows easy upgrades and downgrades.
* Officially recommended by the NPM team.
* A list of versions matched between NPM and NODE (https://nodejs.org/en/download/releases/) - but you will need to download NODE INSTALLER and run that to update node (https://nodejs.org/en/)
