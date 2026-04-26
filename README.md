# 🎓 AI-Powered Face Recognition & Student Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/Python-3.12%2B-green)
![FastAPI](https://img.shields.io/badge/FastAPI-v0.100%2B-009688)

A professional Full-Stack web application designed to automate student registration and identification using state-of-the-art Facial Recognition technology.



🎯 Purpose
The primary goal of this project is to provide a seamless, digital solution for educational institutions to manage student records and verify identities. By replacing manual attendance and verification with AI, this system ensures high accuracy, prevents proxy entries, and saves valuable administrative time.

---

📸 Screenshots & Demo

 1. Registration Dashboard

<img width="1535" height="886" alt="image" src="https://github.com/user-attachments/assets/45deb96e-47cf-4a59-b846-35b961c32c4f" />











 🚀 Key Features
* Smart Registration:** Captures student metadata (Roll No, Name, Dept) and stores facial encodings.
* Real-time Identification:** Uses webcam stream to identify registered students instantly.
* Flexible Uploads:** Support for static image recognition via file upload.
* Responsive Design:** A clean UI built with Tailwind CSS that works on all screen sizes.
* High Accuracy:** Powered by `dlib`'s deep learning model with 99.38% accuracy.

--- 🛠️ Technical Architecture
The project follows a decoupled architecture:
* Frontend:** HTML5, Modern JavaScript (ES6+), and **Tailwind CSS**.
* Backend:** **Python** with **FastAPI** for high-performance API management.
* AI Engine:** **OpenCV** for image processing and **face_recognition** (dlib) for feature extraction.

---

⚙️ Installation & Setup
 Prerequisites
- Python 3.12 or higher
- A working webcam (for live recognition)

1. Clone the Repository
bash
git clone [https://github.com/YourUsername/Face-Recognition-System.git](https://github.com/YourUsername/Face-Recognition-System.git)
cd Face-Recognition-System
