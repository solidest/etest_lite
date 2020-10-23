
# workerdb模块
- workerdb模块在一个独立的webworker线程中提供数据库服务
- workerdb需要配合webpack的worker-plugin插件进行打包

# API说明
- 所有的api都仅支持被异步调用

## open(dbname, colls)
- 作用：打开数据库，默认使用indexeddb作为持久化方式，数据库名为null时持久化无效
- 输入参数：数据库名、集合名称组成的数组
- 返回值：无
- 举例：
```js 
open('man_db', ['log', 'log_appendix', 'manage', 'user'])
```

## close()
- 作用：关闭数据库
- 输入参数：无
- 返回值：无
- 举例：
```js 
close()
```

## destroy(dbname)
- 作用：删除整个数据库文件
- 输入参数：数据库名称
- 返回值：无
- 举例：
```js 
destroy('man_db')
```

## insert(coll, doc)
- 作用：在指定集合中插入文档，文档必须包含唯一的id属性
- 输入参数：集合名称字符串、文档对象
- 返回值：无
- 举例：
```js 
insert('log', {id: 'ix9u8', context: {....}})
```

## remove(coll, doc_id)
- 作用：从指定集合中删除文档
- 输入参数：集合名称字符串、文档id值
- 返回值：无
- 举例：
```js 
remove('log', 'ix9u8')
```

## update(coll, doc)
- 作用：更新指定集合中的一个文档，文档必须包含唯一的id属性
- 输入参数：集合名称字符串、文档对象
- 返回值：无
- 举例：
```js 
update('log', {id: 'ix9u8', context: {....}})
```

## get(coll, doc_id)
- 作用：从指定集合中查找一个文档
- 输入参数：集合名称字符串、文档id
- 返回值：文档对象
- 举例：
```js 
let doc = await get('log', 'ix9u8')
```

## find(coll, filter, sort, is_desc, limit)
- 作用：从指定集合中查找文档
- 输入参数：集合名称字符串、查询条件对象、排序属性名、是否降序排列、结果数上限，后三个参数可省略
- 返回值：查找结果文档数组
- 举例：
```js 
let doc_arr = await find('log', {'Age': {'$gte':30}}, 'Age', 100)
```