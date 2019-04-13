import { test } from "/lib/test";

test
//@ts-ignore
App({
    onLoad(){
        console.log(test,"{{Vx}}");
    },
    
    appId: "{{APP_ID}}",
    version: "{{VERSION}}",
})
