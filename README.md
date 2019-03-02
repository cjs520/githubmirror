# githubmirror

#### Description
github镜像
支持web访问及代码获取
支持golang go get语句

#### 示例
1. 可通过 https://github.trs.ai 进行访问， 在有的浏览器会收到安全警告，提醒说这是一个仿冒网站， 显然这的确是一个仿冒网站了， 我们仿冒的是gihub嘛， 因此可忽略直接访问，当然从技术角度看还是有必要解决一下。
2. go get github.trs.ai/xapanyun/githubmirror.git
3. git clone https://github.trs.ai/xapanyun/githubmirror.git

#### 注意
由于代码中使用了正则表达式的零宽断言预防，因此需要nodejs v9以上版本
