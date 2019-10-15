/**
 * 需求: 深拷贝
 * 作者: yinxg
 * 时间: 2019-07-11
 */
export function deepCopyRow(row) {
    let newRow = {}
    try {
        newRow = JSON.parse(JSON.stringify(row))
    } catch (e) {
        console.log(e)
    }
    return newRow

}
