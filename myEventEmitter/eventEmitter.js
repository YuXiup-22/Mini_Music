// 思路：
//  1.设计一个类，通过类中：监听事件时将某事件注册到数组，触发事件在数组队列中寻找，
// 取消注册，找到相关事件删除，
class eventEmitter{
  constructor(){
    this.eventMap = {}
  }

  // 监听事件
  on(eventName,callback,isOnce){
    // 1.检查传入值是否符合要求
    if((typeof eventName)!=="string" ){
      // 抛出异常
      throw new Error("eventName的数据类型不是一个字符串!")
    }
    if((typeof callback)!=="function"){
      throw new Error("callback不是一个函数!")
    }
    // 2.当传入的值符合时
    // 2.1 将监听事件加入到eventMap中
    let handleAction = this.eventMap[eventName]
    if(!handleAction){
      handleAction = []
    }
    handleAction.push({
      callback,
      isOnce
    })
  }
  // 监听一次
  once(eventName,callback){
    return this.on(eventName,callback,true)
  }
  // 触发事件
  // emit(eventName,...argu){
  //   if((typeof eventName)!=="string" ){
  //     // 抛出异常
  //     throw new Error("eventName的数据类型不是一个字符串!")
  //   }
  //   // 在eventMap中找到对应的事件
  //   let handleActions = this.eventMap[eventName] || []
  //   // 触发所有的事件
  //   let len = handleActions.length
  //   for(let i = 0;i<len;i++){
  //     if(!handleActions[i]) continue

  //     // 取出事件的回调函数
  //     let {callback,isOnce} = handleActions[i]
  //     // 如果只监听一次，那么就在eventMap中删除该事件
  //     if(isOnce){
  //       this.eventMap.slice(i,1)
  //       // 没有监听内容，则删除掉
  //       if(this.eventMap.length===0){
  //         delete this.eventMap
  //       }
  //       // 记得一定要将索引和长度减1，删除掉以后，eventmap发生变化，索引不变，会导致跳过某项内容
  //       i--
  //       len--
  //     }
  //     // 执行回调函数
  //     argu = argu || []
  //     callback.apply(this,...argu)
  //   }
  // }
  emit(eventName, ...payload) {
    if (typeof eventName !== "string") {
      throw new TypeError("the event name must be string type")
    }
    // 在事件队列中找到被要求相应的方法
    const handlers = this.eventMap[eventName] || []
    handlers.forEach(handler => {
      handler.callback.apply(this, payload)
    })
    return this
  }


  // 取消事件监听 事件名和其回调函数
  off(eventName,callback){
    // 1.检查传入值是否符合要求
    if((typeof eventName)!=="string" ){
      // 抛出异常
      throw new Error("eventName的数据类型不是一个字符串!")
    }
    if((typeof callback)!=="function"){
      throw new Error("callback不是一个函数!")
    }
    // 2.拿到所有对应的事件内容
    let handleActions = this.eventMap[eventName]
    if(handleActions&&callback){
      let len = handleActions.length
      for(let i =0;i<len;i++){
        if(callback===handleActions[i].callback){
          // 删除
          handleActions.slice(i,1)
          len--
          i--
        }
      }
      // 如果删掉以后为空,在eventMap中去除该变量名的所有事件内容
      if(!handleActions){
        delete this.eventMap[eventName]
      }
    }
  }
}

export default eventEmitter