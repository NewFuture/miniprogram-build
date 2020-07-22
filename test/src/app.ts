import { test } from "/lib/test";
import {request} from "miniprogram-network"
test
const data = {


    appId: "{{APP_ID}}",
    version: "{{VERSION}}",
};
App({

    onLaunch() {
        request("POST","/");
        console.log(test, "{{Vx}}");
    }
})
