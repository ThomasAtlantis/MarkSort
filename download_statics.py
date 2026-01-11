import json
import asyncio
from pathlib import Path
from rnet import Client, Impersonate
from tqdm import tqdm

rnet_client = Client(impersonate=Impersonate.Chrome137, verify=False)

async def download_image(url: str, path: str):
    response = await rnet_client.get(url, headers={"Referer": "https://www.xiaohongshu.com/"})
    if response.status_code.as_int() != 200:
        print(f"Failed to download image: {url}, status code: {response.status_code}")
        return
    url = url.split('!')[0]
    url = url.split('?')[0]
    file_name = url.split('/')[-1]
    if file_name and not file_name.endswith(".jpg"):
        file_name = file_name + ".jpg"
    with open(Path(path) / file_name, "wb") as f:
        f.write(await response.bytes())

async def main():
    # with open("marksort/website/public/bilibili.json", "r", encoding="utf-8") as f:
    #     bilibili = json.load(f)
    # for item in tqdm(bilibili):
        # await download_image(item["cover"], "marksort/website/public/images")
        # await download_image(item["upper"]["face"], "marksort/website/public/images")
    with open("marksort/website/public/rednote.json", "r", encoding="utf-8") as f:
        rednote = json.load(f)
    for item in tqdm(rednote):
        await download_image(item["cover"]["url_default"], "marksort/website/public/images_rednote")
        await download_image(item["user"]["avatar"], "marksort/website/public/images_rednote")

if __name__ == "__main__":
    asyncio.run(main())