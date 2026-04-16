import yfinance as yf

def get_commodity_news():
    headlines = []
    
    # Tickers for Gold and Silver
    commodities = {"Gold": "GC=F", "Silver": "SI=F"}
    
    for name, ticker_symbol in commodities.items():
        ticker = yf.Ticker(ticker_symbol)
        news_items = ticker.news
        
        for item in news_items:
            # API Robustness: Check standard 'title', then fallback to nested 'content'
            title = item.get("title")
            if not title and "content" in item:
                title = item.get("content", {}).get("title")
                
            link = item.get("link")
            if not link and "content" in item:
                link = item.get("content", {}).get("canonicalUrl")
                
            # Only save the headline if we successfully extracted text
            if title:
                headlines.append({
                    "commodity": name,
                    "title": title,
                    "link": link
                })
            
    return headlines

if __name__ == "__main__":
    latest_news = get_commodity_news()
    
    print(f"\nSuccessfully fetched {len(latest_news)} readable headlines!\n")
    
    for news in latest_news[:5]:
        print(f"[{news['commodity']}] {news['title']}")