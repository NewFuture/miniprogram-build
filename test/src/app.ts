import { test } from "/lib/test";

test
//@ts-ignore
App({
    onLoad(){
        console.log(test);
    },
    
    appId: "{{APP_ID}}"
})
