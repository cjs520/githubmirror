# githubmirror

#### Description
* github镜像
* 支持web访问及代码获取、推送
* 支持golang go get语句

通过对代码简单修改可替换为任意一个站点的镜像网站，例如一些重要的包管理网站甚至谷歌都是可以的。

#### 示例
1. 可通过 https://github.trs.ai 进行访问， 在有的浏览器会收到安全警告，提醒说这是一个仿冒网站， 我们的确是仿冒的gihub嘛， 因此可忽略警告继续访问，当然从技术角度看还是有必要解决一下。
2. go get github.trs.ai/xapanyun/githubmirror.git
3. git clone https://github.trs.ai/xapanyun/githubmirror.git

#### 注意
1. 由于代码中使用了正则表达式的零宽断言预防，因此需要nodejs v9以上版本
2. 由于众所周知的原因，建议将代码建议部署与国外服务器之上
