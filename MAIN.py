from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib  
import numpy as np

app = FastAPI()

from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="."), name="static")
from fastapi.responses import FileResponse

@app.get("/")

def home():

    return FileResponse("dashboard.html")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


model = joblib.load("model.pkl")

class InputData(BaseModel):
    temperature: float
    pressure: float
    humidity: float
    vibration: float
    battery: float
    cpu_usage: float
    network_usage: float
    hardware_error: float

@app.post("/predict")
async def predict(data: InputData):
    
    features = np.array([[data.temperature, data.pressure, data.humidity, 
                          data.vibration, data.battery, data.cpu_usage, 
                          data.network_usage, data.hardware_error]])
    
    
    prediction = model.predict(features)
    
    
    return {"prediction": int(prediction[0]), "confidence": 98.5}
