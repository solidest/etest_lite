const cfg = {
    headers: [{
        text: '备注',
        value: 'memo',
      }, {
        text: '创建时间',
        value: 'screated'
      },
      {
        text: '修改时间',
        value: 'supdated'
      },
      {
        text: '用例总数',
        value: 'scount'
      },
      {
        text: '执行结果',
        value: 'sresult'
      },
    ],
    sort_keys:  [{
        text: '修改时间',
        value: 'updated'
      },
      {
        text: '名称',
        value: 'name'
      },
      {
        text: '创建时间',
        value: 'created'
      },
      {
        text: '用例总数',
        value: 'count'
      },
      {
        text: '执行结果',
        value: 'result'
      },
    ],
    version_map: {
      '0.1.13': '2020.07',
      '1.0.1': '2020.12'
    },
}
export default cfg