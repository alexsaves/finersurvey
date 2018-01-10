import md5 from "react-native-md5";

var ____pastKeys = [];

// Produce keys
export default function (str) {
  var orig = ____pastKeys.find((vl) => {
    return vl.src === str;
  });
  if (orig) {
    return orig.val;
  } else {
    var keyv = "_" + md5.b64_md5(str).replace(/[\/\\]/g, '');
    ____pastKeys.push({src: str, val: keyv});
    return keyv;
  }
};
