= 有任何问题,请直接联系 @chrisye =

{F681}

## Mac 下开发环境搭建
> 安装brew
```lang=bash
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

> 安装nvm
```lang=bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
```

* Add these lines to your ~/.bashrc, ~/.profile, or ~/.zshrc file to have it automatically sourced upon login:

```lang=bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
```

> 安装 graphicsmagick,用于webpack处理压缩图片
```lang=bash
$ brew install graphicsmagick
```

> 安装nodejs, 默认最新版本
```lang=bash
$ nvm install node
$ nvm alias default v6.2.1
$ node -v
$ v6.2.1
```

> 克隆代码到本地
```lang=bash
$ git clone http://cowork.vipabc.com/diffusion/DATAMAP/datamap.git
$ cd datamap
```

> 添加配置文件到config目录

* 添加 config/lead-servies.yml

```lang=html, name=lead-servies.yml
development:
  LoadSnapshotDetail: http://apistore.vipabc.com/mdStatistic/Lead/LoadSnapshotDetail
  LoadTopBanner: http://apistore.vipabc.com/mdStatistic/lead/LoadTopBanner
  LoadTopKeyWord: http://apistore.vipabc.com/mdStatistic/lead/LoadTopKeyWord
  LoadSnapshotDetailByType: http://apistore.vipabc.com/mdStatistic/lead/LoadSnapshotDetailByType
  GetSnapshotTotal: http://apistore.vipabc.com/mdStatistic/Lead/GetSnapshotTotal
  LoadStatWaterMark: http://apistore.vipabc.com/mdStatistic/lead/LoadStatWaterMark
  GetLeadsRankByCity: http://apistore.vipabc.com/MDProjectMapAPI/GetLeadsRankByCity
production:
  LoadSnapshotDetail: http://apistore.vipabc.com/mdStatistic/Lead/LoadSnapshotDetail
  LoadTopBanner: http://apistore.vipabc.com/mdStatistic/lead/LoadTopBanner
  LoadTopKeyWord: http://apistore.vipabc.com/mdStatistic/lead/LoadTopKeyWord
  LoadSnapshotDetailByType: http://apistore.vipabc.com/mdStatistic/lead/LoadSnapshotDetailByType
  GetSnapshotTotal: http://apistore.vipabc.com/mdStatistic/Lead/GetSnapshotTotal
  LoadStatWaterMark: http://apistore.vipabc.com/mdStatistic/lead/LoadStatWaterMark
  GetLeadsRankByCity: http://apistore.vipabc.com/MDProjectMapAPI/GetLeadsRankByCity
```

* 添加 config/server.yml

```lang=yaml, name=server.yml
development:
  port: 8000
  mdns:
    ad:
  passport:
    host: http://localhost
    loginUrl: /users/signin
    domain:
          - .vipabc.com
  cdn: /static/
  templates:
    cacheTemplate: false
    precompileTemplates: false
  minimize: true
  ssl: false
production:
  port: 8000
  mdns:
    ad:
  passport:
    host: http://localhost
    loginUrl: /users/signin
    domain:
          - .vipabc.com
  cacheTemplate: false
  cdn: /static/
  minimize: false
  precompileTemplates: false
  ssl: false
```

> 启动服务,访问 http://localhost:8000/index

```lang=bash
$ make
```