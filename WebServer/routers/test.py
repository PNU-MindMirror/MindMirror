import sys
import json

def test(data):
    json_data = json.loads(data)
    print(json_data)
    res_data= {'슬픔': '0.33','기쁨':'0.2352'}
    print(res_data)
    return sys.stdout.flush()


test(sys.argv[1])