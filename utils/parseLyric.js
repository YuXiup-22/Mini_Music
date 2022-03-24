// 使用正则表达式，拿到时间
// 使用 / / 匹配，然后 匹配 []，但是方括号在正则里面有特殊的含义，所以使用转义字符\,使得将其变成普通的子父  ，\d表示数字， {2,3}表示匹配的数字个数  2到3个

const lyrRegExp = /\[(\d{2}):(\d{2}).(\d{2,3})\]/
export default function (lyric) {
  const Strings = lyric.split('\n')
  const lyricRes = []
  for(const lyric of Strings){
    let timeRes = lyrRegExp.exec(lyric) 
    // 如果没有拿到，因为有些没有，则继续
    if(!timeRes) continue
    const min = timeRes[1] * 60 *1000
    const second = timeRes[2] * 1000
    const mileSecond  =timeRes[3].length===2?timeRes[3]*10:timeRes[3]*1
    // 拿到最后的总时间毫秒数
    const time = min+second+mileSecond;

    // 拿到歌词文本,将前面的时间，替换为空字符 可以使用正则或者字符串
    let text  = lyric.replace(lyrRegExp,"")
    lyricRes.push({time,text})
  }
  return lyricRes
}