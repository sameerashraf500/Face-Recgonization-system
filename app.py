from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import io
from utils.face_utils import FaceRecognitionManager
import os

app = FastAPI(title="Face Recognition API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize face recognition manager
face_manager = FaceRecognitionManager()

@app.get("/")
async def root():
    return {"message": "Face Recognition API is running!"}

@app.post("/add_student")
async def add_student(
    roll_number: str = Form(...),
    name: str = Form(...),
    department: str = Form(...),
    image: UploadFile = File(...)
):
    """Add new student with face image"""
    try:
        # Validate image
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image bytes
        image_bytes = await image.read()
        face_encoding = face_manager.extract_face_encoding(image_bytes)
        
        if face_encoding is None:
            raise HTTPException(status_code=400, detail="No face detected in image or multiple faces found")
        
        # Add student
        result = face_manager.add_student(roll_number, name, department, face_encoding)
        
        if result["success"]:
            return JSONResponse(content=result, status_code=201)
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.post("/recognize")
async def recognize(image: UploadFile = File(...)):
    """Recognize face from uploaded image"""
    try:
        # Validate image
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image bytes
        image_bytes = await image.read()
        face_encoding = face_manager.extract_face_encoding(image_bytes)
        
        if face_encoding is None:
            return JSONResponse(
                content={"success": False, "error": "No face detected or multiple faces found"},
                status_code=400
            )
        
        # Recognize face
        student_data = face_manager.recognize_face(face_encoding)
        
        if student_data:
            return JSONResponse(content={"success": True, "student": student_data})
        else:
            return JSONResponse(
                content={"success": False, "error": "Unknown face"},
                status_code=404
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.get("/students")
async def get_students():
    """Get all registered students"""
    return {"students": list(face_manager.students_data.values())}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)