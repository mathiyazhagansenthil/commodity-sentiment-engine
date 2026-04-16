from transformers import pipeline
from scraper import get_commodity_news

# We make sure the model is loaded once at the top level
sentiment_pipeline = pipeline("sentiment-analysis", model="ProsusAI/finbert")

def analyze_sentiment():
    news_data = get_commodity_news()
    results = []
    
    for item in news_data:
        headline = item['title']
        ai_result = sentiment_pipeline(headline)[0]
        
        # We save the data into a clean dictionary
        results.append({
            "commodity": item['commodity'],
            "title": headline,
            "sentiment_label": ai_result['label'].upper(),
            "confidence_score": round(ai_result['score'] * 100, 1)
        })
        
    return results # Return it so FastAPI can send it to React!