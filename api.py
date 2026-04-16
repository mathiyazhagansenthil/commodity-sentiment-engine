from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from analyzer import analyze_sentiment
import asyncio

app = FastAPI(title="Commodity Sentiment API")

# This allows your React frontend (running on a different port) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# We create an endpoint that the React dashboard will fetch data from
@app.get("/api/sentiment")
async def get_sentiment_data():
    # We run your heavy AI analyzer in the background
    return await asyncio.to_thread(analyze_sentiment)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)