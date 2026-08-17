import urllib.request, re
try:
    html = urllib.request.urlopen('https://www.youtube.com/results?search_query=full+movie+free').read().decode()
    print(re.findall(r'"videoId":"(.*?)"', html)[:20])
except Exception as e:
    print(e)
