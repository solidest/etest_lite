
## ETestDev 0.1.13
- 修复多个连接拓扑无法执行的问题
- 复选框控件绑定值固定为`true或false`，开关控件绑定值固定为`0或1`

## ETestDev 0.1.11
- 新增ETL文件快速复制新文件功能
- 新增从Dev导出单个ETL文件，可以在VSCode中使用

## ETestDev 0.1.9
- 异步库新增3个用户自定义事件相关API，`on off emit`
    - 使用说明参见在线手册
- 工具箱模块下新增功能：状态机生成器
    - 编写yaml格式配置文件，可自动生成状态图和执行代码
    - 配置文件格式为对象数组，每个对象必须设置三个属性`state when then`
    - `state`为状态转换的文字描述，以空格间隔多个状态
    - `when`为触发状态转变的事件名称
    - `then`为事件触发后所需执行的任务函数，多个函数以空格隔开
    - 测试程序启动事件为`$entry`
    - 超时定时器也是任务之一，
        - `T1@2000` 启动名称为T1的2秒超时定时器
        - `T1@` 关闭T1定时器
        - T1定时器超时后会自动触发事件 `timeout.T1`

## ETestDev设计器 0.1.7
- 新增通信协议测试功能
    - 需测试的协议必须通过错误检查，否则有错误提示
    - 单个协议编写完整，即可运行测试

## ETestDev设计器 0.1.5
- 工具箱模块中新增数据格式转换工具，支持以下数据类型
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
