import { events } from "bdsx/event";
import { command } from "bdsx/command";
import { CANCEL } from "bdsx/common";
import * as fs from "fs";
import { CxxString, int32_t } from "bdsx/nativetype";
let jsonObject: {
  masterData: { Place: (arg0: (item: any) => true | undefined) => {} };
};

var masterData: {
  x: int32_t;
  y: int32_t;
  z: int32_t;
  name: CxxString;
}[] = [];
let masterData2 = JSON.stringify({ masterData: masterData }, null, " ");
fs.writeFileSync("./protect.json", masterData2);

command.register("protection", "protect world").overload(
  (param, origin, output) => {
    const actor = origin.getEntity();
    var data = {
      name: param.name,
      x: param.x,
      y: param.y,
      z: param.z,
      x2: param.x,
      y2: param.y,
      z2: param.z,
    };
    masterData.push(data);
    let masterData2 = JSON.stringify({ masterData }, null, " ");
    fs.writeFileSync("./protection.json", masterData2);
  },
  {
    option: command.enum("Protect.guard", "-add"),
    x: int32_t,
    y: int32_t,
    z: int32_t,
    x2: int32_t,
    y2: int32_t,
    z2: int32_t,
    name: CxxString,
  }
);

events.blockDestroy.on((ev) => {
  try {
    jsonObject = JSON.parse(fs.readFileSync("./protect.json", "utf8"));
  } catch (e) {
    console.log(e);
  }
  const a: object =
    jsonObject.masterData.Place.filter((item: any) => {
      if (
        item.x < ev.blockPos.x < item.x2 &&
        item.y < ev.blockPos.y < item.y &&
        item.z < ev.blockPos.z < item.z2
      )
        return true;
    }) || {};
  for (const i in a) {
    let cmd = `tellraw @s {"rawtext":[{"text":"§l§c"${i}"}]}`;
    ev.player.runCommand(cmd);
    return CANCEL;
  }
});

events.blockPlace.on((ev) => {
  try {
    jsonObject = JSON.parse(fs.readFileSync("./protect.json", "utf8"));
  } catch (e) {
    console.log(e);
  }
  const a: object =
    jsonObject.masterData.Place.filter(
      (item: {
        x: int32_t;
        x2: int32_t;
        y: int32_t;
        z: int32_t;
        z2: int32_t;
      }) => {
        if (
          (item.x << ev.blockPos.x) << item.x2 &&
          (item.y << ev.blockPos.y) << item.y &&
          (item.z << ev.blockPos.z) << item.z2
        ) {
          return true;
        }
      }
    ) || {};
  for (const i in a) {
    let cmd = `tellraw @s {"rawtext":[{"text":"§l§c"${i}"}]}`;
    ev.player.runCommand(cmd);
    return CANCEL;
  }
});
