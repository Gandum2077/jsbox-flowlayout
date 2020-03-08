const FlowLayout = require("./components/flowlayout");
const idManager = require("./utils/id");

const texts = [
  "1",
  "22",
  "333",
  "4444",
  "55555",
  "666666",
  "7777777",
  "88888888",
  "999999999",
  "0000000000",
  "1",
  "22",
  "333",
  "4444",
  "55555",
  "666666",
  "7777777",
  "88888888",
  "999999999",
  "0000000000",
  "1",
  "22",
  "333",
  "4444",
  "55555",
  "666666",
  "7777777",
  "88888888",
  "999999999",
  "0000000000"
];

function init() {
  const flowLayout = new FlowLayout({ 
    props: {
      data: texts,
      spacing: 8,
      //cellHeight: 50,
      //scrollEnabled: false,
      bgcolor: $color("white"),
      template: {
        props: {
          radius: 5,
          //borderWidth: 0.5,
          //borderColor: $color("gray")
        }
      }
    },
    layout: (make, view) => {
      make.size.equalTo($size(300, 200))
      make.center.equalTo(view.super)
    },
    events: {
      didScroll: function(sender) {
        console.info(1)
      },
      didSelect: (sender, indexPath, data) => {
        console.info(data)
      }
    }
  })
  $ui.render({
    views: [
      {
        type: "view",
        props: {
          bgcolor: $color("yellow")
        },
        layout: $layout.fill,
        events: {
          ready: sender => {
            sender.relayout()
            sender.add(flowLayout.definition);
          }
        }
      }
    ]
  });
}

module.exports = {
  init
};
