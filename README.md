# wechat-user

微信用户, 用于储存关键微信用户数据

## Features
- 微信用户信息登记

## 服务说明

- 服务基于[`jm-server`](https://github.com/jm-root/server/tree/master/packages/jm-server)框架建立
- 数据库存储方式支持mongodb和mysql, 可根据db配置参数决定采用方式
- 服务依赖
    - [`user`](https://github.com/jm-root/user)(用户账号系统)

## 构建运行
````
// 安装依赖包
lerna bootstrap
// 项目启动
npm run start
````

## 部署

采用docker部署，容器默认监听80端口

docker镜像: `jamma/wechat-user`

环境变量见后面的[环境变量](#环境变量)说明
````
docker run -d name wechat-user jamma/wechat-user
````

## 环境变量

### jm-server

基本配置 请参考 [jm-server](https://github.com/jm-root/server/tree/master/packages/jm-server)

| 配置项         | 默认值          | 描述 |
| :---           | :---:          | :--- |
|db              |                | 必填, 数据库连接地址, 如：mysql://xxx或mongodb://xxx |
|force_unionid   | 0              | 是否强制获取unionid, 默认0：不强制 1：强制 |
|gateway         |"http://gateway"| Gateway服务器Uri| 
|service_name    |"wechat-user"   | 链路追踪登记的服务名称 |
|jaeger          |                | 选填, 链路跟踪, 默认不开启, 如配置了链路地址将开启|

