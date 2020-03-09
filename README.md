# jsbox-flowlayout

实现一个 columns 不定，spacing 固定，左对齐，自动换行的 FlowLayout

可以继承 scroll 控件的全部属性、布局、事件

独特属性：

- spacing: 指定间距
- cellHeight: cell 高度
- data: 字符串组成的 Array
- template: object，但是其中只有 props 会生效，方便为子 view 指定属性

独特事件：

- didSelect: (sender, indexPath, data) => {}
- didLongPress: function(sender, indexPath, data) {}

独特方法：

- cell(indexPath) 返回 indexPath 位置的 view
- object(indexPath) 返回在 indexPath 位置的数据
- insert({ indexPath, value }) 插入一条数据
- delete(indexPath) 删除一条数据
- set data 更新数据，用法为 flowlayout.data = data
- get view 返回本 view，用法为 flowlayout.view

注意事项：

- 方法必须在视图被添加以后才能使用
- 请注意 props 里面指定 id 是无效的，如果你需要获取视图，请使用 flowlayout.view 代替 id 查找
