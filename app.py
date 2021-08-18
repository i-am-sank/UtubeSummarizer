from flask import Flask
from flask_restful import Resource, Api
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import pipeline
import re

app = Flask(__name__)
api = Api(app)

def get_transcript(video_id,language):
    
    if language != None:
        langList = [language]
        transcript = YouTubeTranscriptApi.get_transcript(video_id,languages=langList)
    else:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)

    parsed_text = ''
    for obj in transcript:
        text = re.sub(r'\n', ' ', obj['text'])
        parsed_text += " "+ text

    return parsed_text    

def summarize(text):
    summarization = pipeline("summarization")
    summary = summarization(text)[0]['summary_text']
    return summary


class Transcript(Resource):
    def get(self, video_id):
        transcript = get_transcript(video_id, None)
        return {'transcript': transcript}
                 #'summary': summarize(transcript)}

class TranscriptWithLanguage(Resource):
    def get(self, video_id, lang):
        transcript = get_transcript(video_id, lang)
        return {'transcript': transcript}

class TranscriptLanguage(Resource):
    def get(self,video_id):
        languages =  YouTubeTranscriptApi.list_transcripts(video_id)
        languageList = []
        for lang in languages:
            languageList.append({'language': lang.language, 'code': lang.language_code})
        return languageList     

api.add_resource(Transcript, '/api/summarize/<string:video_id>')
api.add_resource(TranscriptLanguage,'/api/language/<string:video_id>')
api.add_resource(TranscriptWithLanguage, '/api/summarize/<string:lang>/<string:video_id>')

if __name__ == '__main__':
    app.run(debug=True)