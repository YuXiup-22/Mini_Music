export default function (item,value) {
  const nodes=[]
        // 如果匹配
        // 匹配大小写一起，但是为什么？不是都转为大写了吗
        // 原因：返回的是大写的字符串，但是原字符串并没有改变，最后分割的还是原字符串
        // 而且，无论是否有大小写，只要转为大写匹配相同，那么原字符串含大小写也要分割
        // 例如：ab -- Ab  ==>  AB-->AB  所以，Ab也算匹配！
        if(item.toUpperCase().startsWith(value.toUpperCase())){
          const key1 = item.slice(0,value.length)
          const node1 ={
            name:"span",
            attrs:{ style:"color:#777"},
            children:[{
              type:'text',
              text:key1
            }]
          }
          // 将不同的node节点添加进去
          nodes.push(node1)
          const key2 = item.slice(value.length)
          const node2={
            name:'span',
            children:[{
              type:'text',
              text:key2
            }]
          }
          nodes.push(node2)
        }else{
          const node ={
            name:'span',
            children:[{
              type:'text',
              text:item
            }]
          }
          nodes.push(node)
        }
        return nodes
}