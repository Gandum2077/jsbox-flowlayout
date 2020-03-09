const FlowLayout = require("./components/flowlayout");

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
          radius: 5
          //borderWidth: 0.5,
          //borderColor: $color("gray")
        }
      }
    },
    layout: (make, view) => {
      make.size.equalTo($size(300, 200));
      make.center.equalTo(view.super);
    },
    events: {
      didScroll: function(sender) {
        console.info(1);
      },
      didSelect: (sender, indexPath, data) => {
        console.info("didSelect", data);
      },
      didLongPress: (sender, indexPath, data) => {
        console.info("didLongPress", data);
      }
    }
  });
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
            sender.relayout();
            sender.add(flowLayout.definition);
          }
        }
      }
    ]
  });
  $delay(1, function() {
    flowLayout.data = ["1", "2"];
  });
  $delay(2, function() {
    flowLayout.insert({ indexPath: $indexPath(0, 0), value: "0" });
  });
  $delay(3, function() {
    flowLayout.delete($indexPath(0, 0));
  });
}

module.exports = {
  init
};
