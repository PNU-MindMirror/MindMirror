from django.http.response import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
import torch
from torch import nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import gluonnlp as nlp
import numpy as np
from tqdm import tqdm, notebook
import math
from kobert.utils import get_tokenizer
from kobert.pytorch_kobert import get_pytorch_kobert_model
from transformers import AdamW
from transformers.optimization import get_cosine_schedule_with_warmup
from sklearn.model_selection import train_test_split
import pandas as pd
import json
from collections import OrderedDict
from kss import split_sentences

@csrf_exempt
def response(request):
      data = json.loads(request.body)
      setences = []
      text = str(data.content)
      setences= split_sentences(text)

device = torch.device("cuda:0")

#BERT 모델, Vocabulary 불러오기
bertmodel, vocab = get_pytorch_kobert_model()


# In[25]:


class BERTClassifier(nn.Module):
    def __init__(self,
                 bert,
                 hidden_size = 768,
                 num_classes=9,   ##클래스 수 조정##
                 dr_rate=None,
                 params=None):
        super(BERTClassifier, self).__init__()
        self.bert = bert
        self.dr_rate = dr_rate
                 
        self.classifier = nn.Linear(hidden_size , num_classes)
        if dr_rate:
            self.dropout = nn.Dropout(p=dr_rate)
    
    def gen_attention_mask(self, token_ids, valid_length):
        attention_mask = torch.zeros_like(token_ids)
        for i, v in enumerate(valid_length):
            attention_mask[i][:v] = 1
        return attention_mask.float()

    def forward(self, token_ids, valid_length, segment_ids):
        attention_mask = self.gen_attention_mask(token_ids, valid_length)
        
        _, pooler = self.bert(input_ids = token_ids, token_type_ids = segment_ids.long(), attention_mask = attention_mask.float().to(token_ids.device), return_dict=False)
        if self.dr_rate:
            out = self.dropout(pooler)
        return self.classifier(out)


# In[26]:


max_len = 200
batch_size = 32


# In[27]:


class BERTDataset(Dataset):
    def __init__(self, dataset, sent_idx, label_idx, bert_tokenizer, max_len,
                 pad, pair):
        transform = nlp.data.BERTSentenceTransform(bert_tokenizer, max_seq_length=max_len, pad=pad, pair=pair)

        self.sentences = [transform([i[sent_idx]]) for i in dataset]
        self.labels = [np.int32(i[label_idx]) for i in dataset]

    def __getitem__(self, i):
        return (self.sentences[i] + (self.labels[i], ))

    def __len__(self):
        return (len(self.labels))


# In[28]:


situation_model = torch.load("situation7.pth")
emotion_model = torch.load("model4.pth")


# In[42]:


#토큰화
tokenizer = get_tokenizer()
tok = nlp.data.BERTSPTokenizer(tokenizer, vocab, lower=False)

def predict_emotion(predict_sentence):

    data = [predict_sentence, '0']
    dataset_another = [data]

    another_test = BERTDataset(dataset_another, 0, 1, tok, max_len, True, False)
    test_dataloader = torch.utils.data.DataLoader(another_test, batch_size=batch_size)
    
    emotion_model.eval()

    for batch_id, (token_ids, valid_length, segment_ids, label) in enumerate(test_dataloader):
        token_ids = token_ids.long().to(device)
        segment_ids = segment_ids.long().to(device)

        valid_length= valid_length
        label = label.long().to(device)

        out = emotion_model(token_ids, valid_length, segment_ids)


        test_eval=[]
        for i in out:
            logits=i
            logits = logits.detach().cpu().numpy()

            if np.argmax(logits) == 0:
                test_eval.append("분노")
            elif np.argmax(logits) == 1:
                test_eval.append("슬픔")
            elif np.argmax(logits) == 2:
                test_eval.append("불안")
            elif np.argmax(logits) == 3:
                test_eval.append("상처")
            elif np.argmax(logits) == 4:
                test_eval.append("당황")
            elif np.argmax(logits) == 5:
                test_eval.append("기쁨")
            elif np.argmax(logits) == 6:
                test_eval.append("중립")

        print(">> 입력하신 내용에서 " + test_eval[0] + " 느껴집니다.")
        return test_eval[0]


def predict_situation(predict_sentence):

    data = [predict_sentence, '0']
    dataset_another = [data]

    another_test = BERTDataset(dataset_another, 0, 1, tok, max_len, True, False)
    test_dataloader = torch.utils.data.DataLoader(another_test, batch_size=batch_size)
    
    situation_model.eval()

    for batch_id, (token_ids, valid_length, segment_ids, label) in enumerate(test_dataloader):
        token_ids = token_ids.long().to(device)
        segment_ids = segment_ids.long().to(device)

        valid_length= valid_length
        label = label.long().to(device)

        out = situation_model(token_ids, valid_length, segment_ids)


        test_eval=[]
        for i in out:
            logits=i
            logits = logits.detach().cpu().numpy()

            if np.argmax(logits) == 0:
                test_eval.append("가족관계")
            elif np.argmax(logits) == 1:
                test_eval.append("학업 및 진로")
            elif np.argmax(logits) == 2:
                test_eval.append("학교폭력/따돌림")
            elif np.argmax(logits) == 3:
                test_eval.append("대인관계")
            elif np.argmax(logits) == 4:
                test_eval.append("직장, 업무 스트레스")
            elif np.argmax(logits) == 5:
                test_eval.append("연애, 결혼, 출산")
            elif np.argmax(logits) == 6:
                test_eval.append("진로, 취업, 직장")
            elif np.argmax(logits) == 7:
                test_eval.append("재정, 은퇴, 노후준비")
            elif np.argmax(logits) == 8:
                test_eval.append("건강, 죽음")

        print(">> 입력하신 내용에서 " + test_eval[0] + " 상황입니다.")

        return test_eval[0]


      emotion_list= []
      situation_list = []
      for i, sent in enumerate(setences) :
        emotion_data = []
        emotion_pre = predict_emotion(sent)
        emotion_data.append(sent)
        emotion_data.append(str(emotion_pre))
        emotion_list.append(emotion_data)


        situation_data = []
        situation_pre = predict_situation(sent)
        situation_data.append(sent)
        situation_data.append(str(situation_pre))
        situation_list.append(situation_data)


      cnt_total1=0
      cnt1=[0,0,0,0,0,0,0]

      for i in range(len(emotion_list)):
          cnt_total1+=1
          if emotion_list[i][1]=='분노':
              cnt1[0]+=1
          elif emotion_list[i][1]=='슬픔':
              cnt1[1]+=1
          elif emotion_list[i][1]=='불안':
              cnt1[2]+=1
          elif emotion_list[i][1]=='상처':
              cnt1[3]+=1
          elif emotion_list[i][1]=='당황':
              cnt1[4]+=1
          elif emotion_list[i][1]=='기쁨':
              cnt1[5]+=1
          elif emotion_list[i][1]=='중립':
              cnt1[6]+=1
          else:
              print('error')
          
      emo_per=round(max(cnt1)/cnt_total1,4)

      emotions_dict={0:'분노',1:'슬픔',2:'불안',3:'상처',4:'당황',5:'기쁨', 6:"중립"}

      situations_dict={0:'가족관계',
      1:'학업 및 진로',
      2:'학교폭력/따돌림',
      3:'대인관계',
      4:'직장, 업무 스트레스',
      5:'연애, 결혼, 출산',
      6:'진로, 취업, 직장',
      7:'재정, 은퇴, 노후준비',
      8:'건강, 죽음',
      }

      cnt_total2=0
      cnt2=[0,0,0,0,0,0,0,0,0]

      for j in range(len(situation_list)):
          cnt_total2+=1
          if situation_list[j][1]=='가족관계':
              cnt2[0]+=1
          elif situation_list[j][1]=='학업 및 진로':
              cnt2[1]+=1
          elif situation_list[j][1]=='학교폭력/따돌림':
              cnt2[2]+=1
          elif situation_list[j][1]=='대인관계':
              cnt2[3]+=1
          elif situation_list[j][1]=='직장, 업무 스트레스':
              cnt2[4]+=1
          elif situation_list[j][1]=='연애, 결혼, 출산':
              cnt2[5]+=1
          elif situation_list[j][1]=='진로, 취업, 직장':
              cnt2[6]+=1
          elif situation_list[j][1]=='재정, 은퇴, 노후준비':
              cnt2[7]+=1
          elif situation_list[j][1]=='건강, 죽음':
              cnt2[8]+=1
          else:
              print('error')
      obj={
          'emotion':{"분노":round(cnt1[0]/cnt_total1*100,4),
                  "슬픔":round(cnt1[1]/cnt_total1*100,4),
                  "불안":round(cnt1[2]/cnt_total1*100,4),
                  "상처":round(cnt1[3]/cnt_total1*100,4),
                  "당황":round(cnt1[4]/cnt_total1*100,4),
                  "기쁨":round(cnt1[5]/cnt_total1*100,4),
                  "중립":round(cnt1[6]/cnt_total1*100,4)},
        
      'sentence':{"분노":[],
                  "슬픔":[],
                  "불안":[],
                  "상처":[],
                  "당황":[],
                  "기쁨":[],
                  "중립":[]},
      'situation':{emotions_dict[cnt1.index(max(cnt1))]:situations_dict[cnt2.index(max(cnt2))]}
      }
      for i in range(len(emotion_list)):
          cnt_total1+=1
          if emotion_list[i][1]=='분노':
              obj['sentence']['분노']=emotion_list[i][0]
          elif emotion_list[i][1]=='슬픔':
              obj['sentence']['슬픔'].append(emotion_list[i][0])
          elif emotion_list[i][1]=='불안':
              obj['sentence']['불안'].append(emotion_list[i][0])
          elif emotion_list[i][1]=='상처':
              obj['sentence']['상처'].append(emotion_list[i][0])
          elif emotion_list[i][1]=='당황':
              obj['sentence']['당황'].append(emotion_list[i][0])
          elif emotion_list[i][1]=='기쁨':
              obj['sentence']['기쁨'].append(emotion_list[i][0])
          elif emotion_list[i][1]=='중립':
              obj['sentence']['중립'].append(emotion_list[i][0])
          else:
              print('error')
          
      emo_per=round(max(cnt1)/cnt_total1,4)


      return JsonResponse(obj)