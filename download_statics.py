import json
import asyncio
from pathlib import Path
from rnet import Client, Impersonate
from tqdm import tqdm

rnet_client = Client(impersonate=Impersonate.Chrome137, verify=False)

with open("marksort/website/public/bilibili.json", "r", encoding="utf-8") as f:
    bilibili = json.load(f)

async def download_image(url: str, path: str):
    response = await rnet_client.get(url)
    with open(Path(path) / url.split('/')[-1], "wb") as f:
        f.write(await response.bytes())

async def main():
    for item in tqdm(bilibili):
        # await download_image(item["cover"], "marksort/website/public/images")
        await download_image(item["upper"]["face"], "marksort/website/public/images")

if __name__ == "__main__":
    asyncio.run(main())