import { serve } from "https://deno.land/std@0.138.0/http/server.ts";

import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

let previousWord = "しりとり";
let alword = ["りんご"]//alword

console.log("Listening on http://localhost:8000");

serve(async (req) => {

  const pathname = new URL(req.url).pathname;

  console.log(pathname);

  if (req.method === "GET" && pathname === "/shiritori") {
    return new Response(previousWord);
  }

  if (req.method === "POST" && pathname === "/shiritori") {
    const requestJson = await req.json();
    const nextWord = requestJson.nextWord;
    for(let i=0;i<alword.length;++i){
      if(nextWord==alword[i]){
        return new Response("すでに出ている言葉です", { status: 400 });
      }
    }
    if (nextWord.length > 0 &&  "ん" == nextWord.charAt(nextWord.length - 1)) { //「ん」を検出
      return new Response("「ん」で終わったのであなたの負けです", { status: 400 });
    }
    if (nextWord.length > 0 && previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)) {
        return new Response("前の単語に続いていません。", { status: 400 });
      }
      
    previousWord = nextWord;
    alword.push(nextWord);//alword
    return new Response(previousWord);
  }


  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });

});