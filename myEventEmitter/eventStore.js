
import eventEmitter from './eventEmitter'

// 对状态和数据进行管理
class eventStore{
  constructor(options){
    // 判断是否符合类型
    if(typeof options.state!=="object"){
      throw new Error("state不符合数据类型")
    }
    // 拿到actions，判断里面的函数是否符合类型
    if(typeof options.actions==="object"){
      // 拿到actions对象中所有可枚举类型的变量名
      let actionsName = Object.values(options.actions)
      for(let item of actionsName){
        if(typeof item!=="function"){
          throw new Error("actions中有不符合函数的变量")
        }
      }
      // 所有都符合，则把actions添加进来
      this.actions = options.actions
    }
    // console.log(options);
    // 添加state
    this.state = options.state
    this.Observe(options.state)
    this.eventEmitter = new eventEmitter()
    // console.log(this.state);
  }
  // 给state中的每个变量设置响应操作，get/set
  Observe(state){
    // 对象是整个类
    // const _this = this
    // let keys = Object.keys(state)
    // for(let key of keys){
    //   let value = state[key];
    //   // console.log(state[key]);
    //   Object.defineProperty(state,key,{
    //     get(){
    //       return  value
    //     },
    //     set(newValue){
    //       if(value===newValue) return
    //       // 值改变了，会触发响应的事件
    //       // console.log(newValue);
    //       value=newValue
    //       // 触发事件，执行当这个数改变时的回调函数
    //       // _this.eventEmitter.emit(key,value)
    //     }
    //   })
    // }
    const _this = this
    Object.keys(state).forEach(key => {
      let _value = state[key]
      // 响应式操作，实时监测state中的值有没有发送改变
      Object.defineProperty(state, key, {
        get: function() {
          return _value
        },
        set: function(newValue) {
          if (_value === newValue) return
          _value = newValue
          _this.eventEmitter.emit(key, _value)
          
        }
      })
    })
  }


  // 监听多个数据 statekeys传入的是数组,一组变量名
  onStates(statekeys,callback){
    // 拿到所有管理的数据
    let keys = Object.keys(this.state)
    // console.log(keys);
    let value = {}
    for(let key of statekeys){
      // console.log( key);
      // 没有管理该数据时
      if(keys.indexOf(key)===-1) {
        throw new Error(`没有管理${key}数据`)
      }
      // 找到管理的数据
      this.eventEmitter.on(key,callback)
      //将对应变量名的值拿到
      value[key] = this.state[key]
      // 有问题，那不到值通过键名！！
      // for(var i in this.state){
      //   console.log("键："+i);
      //   console.log(this.state[i])
      // }
      console.log(this.state);
    }
    // 执行回调函数,注意apply接受的是数组参数
    callback.apply(this.state,[value])
  }
  
// onStates(statekeys, stateCallback) {
//     // 拿到全局中所有的数据
//     const keys = Object.keys(this.state)
//     // console.log(keys);
//     const value = {}
//     // 拿到要监听的数据
//     for (const theKey of statekeys) {
//       if (keys.indexOf(theKey) === -1) {
//         throw new Error("the state does not contain your key")
//       }
//       // 监听这个数据，传入回调函数
//       this.eventEmitter.on(theKey, stateCallback)
//       value[theKey] = this.state[theKey]
//       console.log(this.state);
//       console.log(value);
//     }
//   }

  // 取消监听参数
  offStates(statekeys,callback){
    // 拿到目前所有监听的数据
    let keys = Object.keys(this.state)
    statekeys.forEach(key=>{
      if(keys.indexOf(key)===-1){
        throw new Error(`没有找到${key}`)
      }
      // 取消监听
      this.eventEmitter.off(key,callback)
    })
  }
  // 设置值
  setState(statekey,value){
    this.state[statekey] = value
  }
  // 调动任务，分派任务 (注意，reset参数，可以将空值转为 [])
  dispatch(actionsName,...argu){
    // 首先找到任务
    if(typeof actionsName !=='string') throw new Error('输入类型不符合')
    if(Object.keys(this.actions).indexOf(actionsName)===-1) throw new Error('未找到任务')

    let action = this.actions[actionsName]
    // 因为相应的方法中，一般默认参数包含上下文ctx,所以要加入this.state
    action.apply(this,[this.state,...argu])
  }
}
export default eventStore