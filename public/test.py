import json
import pandas as pd

filepath = 'F:\\Website\\1A线上项目\\vue图片搜索\\public\\test.json'
with open(filepath,encoding='utf-8') as f:
    data = json.load(f)

rows = []
for test in data:
    for post in data[test]['post']:
        rows.append([data[test]['title'],data[test]['raw'],post['id'],post['name'],post['link']])
df = pd.DataFrame(rows, columns=['title','raw','id','name','link'])

df.to_excel('file.xlsx',index=False)
