class FaceRecognitionApp {
    constructor() {
        this.API_BASE = 'http://127.0.0.1:8000'; 
        this.currentView = 'main';
        this.video = document.getElementById('webcam');
        this.stream = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Add student form
        const addForm = document.getElementById('addStudentForm');
        if (addForm) {
            addForm.addEventListener('submit', (e) => this.addStudent(e));
        }
        
        // Recognition buttons
        document.getElementById('uploadBtn').addEventListener('click', () => this.handleUploadClick());
        document.getElementById('webcamBtn').addEventListener('click', () => this.toggleWebcam());
        
        const captureBtn = document.getElementById('captureBtn');
        if (captureBtn) {
            captureBtn.addEventListener('click', () => this.captureAndRecognize());
        }
        
        // File inputs
        const uploadImage = document.getElementById('uploadImage');
        if (uploadImage) {
            uploadImage.addEventListener('change', (e) => this.recognizeImage(e.target.files[0]));
        }

        const studentImage = document.getElementById('studentImage');
        if (studentImage) {
            studentImage.addEventListener('change', () => this.validateStudentImage());
        }
        
        // Drop zone
        const dropZone = document.getElementById('dropZone');
        if (dropZone) {
            dropZone.addEventListener('click', () => document.getElementById('uploadImage').click());
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('border-blue-500');
            });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('border-blue-500'));
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-blue-500');
                const file = e.dataTransfer.files[0];
                if (file) this.recognizeImage(file);
            });
        }
    }

    // 1. Student Registration Function (Fixed Logic)
    async addStudent(e) {
        e.preventDefault();
        
        // Form fields ko pakarna (IDs ke zariye jo HTML mein hain)
        const rollNum = document.getElementById('rollNumber').value;
        const sName = document.getElementById('studentName').value;
        const dept = document.getElementById('department').value;
        const sImage = document.getElementById('studentImage').files[0];

        if (!sImage) {
            alert("Please select a photo first!");
            return;
        }

        // Backend ke mutabiq FormData banana
        const formData = new FormData();
        formData.append('roll_number', rollNum);
        formData.append('name', sName);
        formData.append('department', dept);
        formData.append('image', sImage);

        try {
            const response = await fetch(`${this.API_BASE}/add_student`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                alert("Mubarak ho! Student register ho gaya.");
                e.target.reset();
            } else {
                alert("Error: " + (result.detail || "Image format sahi nahi ya face detect nahi hua"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Backend se rabta nahi ho pa raha! Check karein backend chal raha hai?");
        }
    }

    // 2. Image Recognition (File Upload)
    async recognizeImage(file) {
        if (!file) return;
        
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`${this.API_BASE}/recognize`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                alert(`Pehchan liya! Yeh ${result.student.name} hai. Roll No: ${result.student.roll_number}`);
            } else {
                alert("Nahi pehchan saka: " + (result.error || "Unknown Face"));
            }
        } catch (error) {
            alert("Recognition server se rabta toot gaya!");
        }
    }

    // 3. Webcam Functions
    async toggleWebcam() {
        const webcamContainer = document.getElementById('webcamContainer');
        const captureBtn = document.getElementById('captureBtn');

        if (this.stream) {
            this.stopWebcam();
            webcamContainer.classList.add('hidden');
            if(captureBtn) captureBtn.classList.add('hidden');
        } else {
            try {
                this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
                this.video.srcObject = this.stream;
                webcamContainer.classList.remove('hidden');
                if(captureBtn) captureBtn.classList.remove('hidden');
            } catch (err) {
                alert("Camera access nahi mila! Permission check karein.");
            }
        }
    }

    stopWebcam() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }

    async captureAndRecognize() {
        const canvas = document.createElement('canvas');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        canvas.getContext('2d').drawImage(this.video, 0, 0);
        
        canvas.toBlob((blob) => {
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            this.recognizeImage(file);
        }, 'image/jpeg');
    }

    handleUploadClick() {
        document.getElementById('uploadImage').click();
    }

    validateStudentImage() {
        console.log("Image selected for registration");
    }
}

// Start the App
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FaceRecognitionApp();
});