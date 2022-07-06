import { serve } from "https://deno.land/std@0.138.0/http/server.ts";

import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

let randomword=["りんご","ごりら","らっぱ","きつね","ねこ"]
let firstword = randomword[Math.floor(Math.random() * 5)] //5つの単語からランダム
let previousWord = firstword;
let alword = []; //単語の配列
alword.push(firstword);//最初の単語

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

    if(!(nextWord.match(/^[ぁ-んー]+$/))){ //ひらがな以外を検出
      return new Response("単語はひらがなのみにしてください。", { status: 400 });
    }
    for(let i=0;i<alword.length;++i){
      if(nextWord==alword[i]){
        return new Response("すでに出ている言葉です", { status: 400 });
      }
    }
    if (nextWord.length > 0 &&  "ん" == nextWord.charAt(nextWord.length - 1)) { //「ん」を検出
      return new Response("「ん」で終わったのであなたの負けです", { status: 400 }); //TODO ゲーム終了
    }
    if (nextWord.length > 0 && previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)) {
        return new Response("前の単語に続いていません。", { status: 400 });
      }
      
    previousWord = nextWord;
    alword.push(nextWord); //単語を配列に追加
    document.write('<p>seadegjvfaeufgbajyfeefju</p>');
    return new Response(previousWord);
  }


  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });

});