
## ETestDev设计器 0.1.5
- 工具箱新增数据格式转换工具，支持以下数据类型
    - JSON
    - Excel
    - Yaml
    - JavaScript（代码执行结果）


## ETestDev设计器 0.1.3

- 新增执行模块ETestPlayer
    - 用例执行时，在独立的窗口中进行
    - 执行时，代码编辑窗口下方有详细的执行日志输出
- 监控面板设置中可以使用js代码函数
    - 使用方法: `!!js/function 'function () {...}'   # Function`

## ETestDev设计器 0.1.2

- 修复已知问题
- 所有编辑页面都加入操作快捷键
    - 复制、粘贴 ctrl+c ctrl+v
    - 删除、剪切 delete ctrl+x
    - 撤销、重做 ctrl+z ctrl+y
- 连接拓扑中的设备列表增加了颜色区分
- 项目库模块的页面标题中增加设计器版本号显示
- 数据文件存放位置改为系统默认的用户程序数据目录
    - windows系统 `C:\Users\user_name\AppData\Roaming\etest_dev\`
    - linux、mac系统 `/var/user_name/etest_dev/`
