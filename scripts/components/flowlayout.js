const BaseView = require("./baseView");

class Cell extends BaseView {
  constructor({ props = {}, events: { tapped, longPressed } = {} }) {
    super();
    this.props = Object.assign({}, this.constructor.defaultProps, props);
    this.tapped = tapped;
    this.longPressed = longPressed;
  }

  _defineView() {
    this.props.size = this.realSize;
    return {
      type: "button",
      props: {
        bgcolor: $color("clear"),
        radius: 0,
        info: {
          index: this.props.info.index,
          text: this.props.text
        }
      },
      views: [
        {
          type: "label",
          props: this.props,
          events: {
            themeChanged: sender => sender.borderColor = this.props.borderColor
          }
        }
      ],
      events: {
        tapped: this.tapped,
        longPressed: this.longPressed
      }
    };
  }

  get realSize() {
    if (this._realSize) {
      return this._realSize;
    } else {
      const textSize = $text.sizeThatFits({
        text: this.props.text,
        width: 10000,
        font: this.props.font
      });
      this._realSize = $size(
        Math.round(textSize.width) + 27,
        this.props.cellHeight
      );
      return this._realSize;
    }
  }

  set frame(f) {
    if (!this.view) {
      const view = $(this.id);
      if (!view) this.view = view;
    }
    if (this.view) this.view.frame = f;
  }

  get frame() {
    if (!this.view) {
      const view = $(this.id);
      if (!view) this.view = view;
    }
    if (this.view) return this.view.frame;
    return $zero.rect;
  }
}

Cell.defaultProps = {
  font: $font(15),
  radius: 5,
  bgcolor: $color("#f9f9f9", $color("tertiarySurface")),
  borderColor: $color("separatorColor"),
  borderWidth: 0.5,
  align: $align.center,
  userInteractionEnabled: false
};

/**
 * 实现一个columns不定，spacing固定，左对齐，自动换行的FlowLayout
 * 可以继承scroll控件的全部属性、布局、事件
 *
 * 独特属性：
 *   spacing: 指定间距
 *   cellHeight: cell高度
 *   data: 字符串组成的Array
 *   template: object，但是其中只有props会生效，方便为子view指定属性
 *
 * 独特事件：
 *   didSelect: (sender, indexPath, data) => {}
 *   didLongPress: function(sender, indexPath, data) {}
 *
 * 独特方法：
 *   cell(indexPath) 返回 indexPath 位置的view
 *   object(indexPath)  返回在 indexPath 位置的数据
 *   view 返回本view
 *
 * 注意事项：
 *   方法必须在视图被添加以后才能使用
 *   请注意方法均需要用到id全局查找，因此最好是不要自行指定id，本class通过idManager自动创建的id是全局唯一的。
 *
 */
class FlowLayout extends BaseView {
  constructor({
    props,
    props: { spacing = 5, cellHeight = 30, data = [], template = {} } = {},
    layout,
    events = {}
  }) {
    super();
    this.props = Object.assign({}, this.constructor.defaultProps, props);
    this.props.id = this.id;
    this.props.spacing = spacing;
    this.props.data = data;
    this.cellHeight = cellHeight;
    this._data = data;
    this.template = template;
    this.layout = layout;
    this.events = events;
    const {
      ready: ready_origin,
      layoutSubviews: layoutSubviews_origin,
      ...rest
    } = this.events;
    this.events = { ready_origin, layoutSubviews_origin, ...rest };
    const classThis = this;
    this.events.ready = sender => {
      classThis.ready = false;
      sender.relayout();
      classThis.width = sender.frame.width;
      classThis.cells.forEach(cell => sender.add(cell.created));
      classThis.ready = true;
      if (classThis.events.ready_origin) classThis.events.ready_origin(sender);
    };
    this.events.layoutSubviews = sender => {
      if (classThis.ready) {
        sender.relayout();
        classThis.width = sender.frame.width;
        const height = classThis._layoutCells();
        sender.contentSize = $size(0, height);
        if (classThis.events.layoutSubviews_origin) {
          classThis.events.layoutSubviews_origin(sender);
        }
      }
    };
  }

  _createCells() {
    const classThis = this;
    const otherProps = this.template.props || {};
    const cells = this._data.map(
      (text, index) =>
        new Cell({
          props: {
            text,
            cellHeight: this.cellHeight,
            info: { index },
            ...otherProps
          },
          events: {
            tapped: sender => {
              if (classThis.events.didSelect) {
                classThis.events.didSelect(
                  sender.super,
                  $indexPath(0, sender.info.index),
                  sender.info.text
                );
              }
            },
            longPressed: ({ sender }) => {
              if (classThis.events.didLongPress) {
                classThis.events.didLongPress(
                  sender.super,
                  $indexPath(0, sender.info.index),
                  sender.info.text
                );
              }
            }
          }
        })
    );
    this.cells = cells;
  }

  _layoutCells() {
    let rowIndex = 0;
    let cumWidth = 0;
    for (let cell of this.cells) {
      if (
        cell.realSize.width + cumWidth <=
        this.width - 2 * this.props.spacing
      ) {
        cell.frame = $rect(
          cumWidth + this.props.spacing,
          rowIndex * (cell.realSize.height + this.props.spacing) +
            this.props.spacing,
          cell.realSize.width,
          cell.realSize.height
        );
        cumWidth += cell.realSize.width + this.props.spacing;
      } else {
        rowIndex += 1;
        cumWidth = 0;
        cell.frame = $rect(
          cumWidth + this.props.spacing,
          rowIndex * (cell.realSize.height + this.props.spacing) +
            this.props.spacing,
          cell.realSize.width,
          cell.realSize.height
        );
        cumWidth += cell.realSize.width + this.props.spacing;
      }
    }
    return (
      (rowIndex + 1) * (this.cellHeight + this.props.spacing) +
      this.props.spacing
    );
  }

  _defineView() {
    this._createCells();
    return {
      type: "scroll",
      props: this.props,
      layout: this.layout,
      events: this.events
    };
  }

  set data(data) {
    this._data = data;
    this._createCells();
    this.view.views.forEach(n => n.remove());
    this.cells.forEach(cell => this.view.add(cell.created));
  }

  cell(indexPath) {
    const { item } = indexPath;
    return $(this.id).views[item];
  }

  object(indexPath) {
    const { item } = indexPath;
    return $(this.id).views[item].text;
  }

  insert({ indexPath, value }) {
    this._data.splice(indexPath.item, 0, value);
    this.data = this._data;
  }

  delete(indexPath) {
    this._data.splice(indexPath.item, 1);
    this.data = this._data;
  }
}

FlowLayout.defaultProps = {
  bgcolor: $color("primarySurface")
};


module.exports = FlowLayout;
